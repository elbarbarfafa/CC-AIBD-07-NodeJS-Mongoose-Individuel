const Note = require("../models/note.model");
const NoteDto = require("../dto/note.dto");

/**
 * Service pour gérer les opérations liées aux notes
 */
class NoteService {
  /**
   * Récupère toutes les notes avec pagination et filtres
   * @param {number} page Numéro de page pour la pagination
   * @param {number} limit Limite de notes par page
   * @param {Object} filters Filtres optionnels pour la recherche (film, internaute)
   * @returns {Promise<{notes: NoteDto[], pagination: Object}>} Liste des notes et informations de pagination
   */
  async getAllNotes(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const notes = await Note.find(filters)
      .populate("internaute", "nom prenom")
      .populate("film", "titre annee")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments(filters);

    return {
      notes: notes.map((note) => NoteDto.toDto(note)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Récupère toutes les notes d'un internaute
   * @param {*} internauteId Identifiant de l'internaute dont on veut les notes
   * @returns {Promise<NoteDto[]>} Liste des notes de l'internaute
   */
  async getInternauteNotes(internauteId) {
    const notes = await Note.find({ internaute: internauteId })
      .populate("film", "titre annee genre")
      .sort({ createdAt: -1 });
    return notes.map((note) => NoteDto.toDto(note));
  }

  async getFilmNotes(filmId) {
    const notes = await Note.find({ film: filmId })
      .populate("internaute", "nom prenom")
      .sort({ createdAt: -1 });

    const moyenneNote =
      notes.length > 0
        ? Math.round(
            (notes.reduce((acc, note) => acc + note.note, 0) / notes.length) *
              10
          ) / 10
        : null;

    return {
      notes: notes.map((note) => NoteDto.toDto(note)),
      moyenneNote,
      nombreNotes: notes.length,
    };
  }

  /**
   * Permet la création d'une nouvelle note pour un film
   * @param {*} internauteId Identifiant de l'internaute qui crée la note
   * @param {*} noteData Données de la note à créer (film, note, commentaire)
   * @returns {Promise<NoteDto>} Note créée convertie en DTO
   */
  async createNote(internauteId, noteData) {
    const existingNote = await Note.findOne({
      internaute: internauteId,
      film: noteData.film,
    });

    if (existingNote) {
      throw new Error("Vous avez déjà noté ce film");
    }

    const nouvelleNote = new Note({
      internaute: internauteId,
      ...noteData,
    });

    await nouvelleNote.save();
    await nouvelleNote.populate([
      { path: "internaute", select: "nom prenom" },
      { path: "film", select: "titre annee" },
    ]);
    return NoteDto.toDto(nouvelleNote);
  }

  /**
   * Met à jour une note existante
   * @param {*} noteId Identifiant de la note à mettre à jour
   * @param {*} internauteId Identifiant de l'internaute qui souhaite mettre à jour la note
   * @param {*} updateData Nouvelles données de la note
   * @throws {Error} Si la note n'existe pas ou si l'internaute n'est pas autorisé à la modifier
   * @returns {Promise<NoteDto>} Note mise à jour convertie en DTO
   */
  async updateNote(noteId, internauteId, updateData) {
    const noteExistante = await Note.findById(noteId);

    if (!noteExistante) {
      throw new Error("Note non trouvée");
    }

    if (noteExistante.internaute.toString() !== internauteId) {
      throw new Error("Accès refusé");
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "internaute", select: "nom prenom" },
      { path: "film", select: "titre annee" },
    ]);
    return NoteDto.toDto(updatedNote);
  }

  /**
   * Permet de supprimer une note appartenant à un internaute
   * @param {Object} noteId Identifiant de la note à supprimer
   * @param {Object} internauteId Identifiant de l'internaute qui souhaite supprimer la note
   * @throws {Error} Si la note n'existe pas ou si l'internaute n'est pas autorisé à la modifier
   * @returns {Promise<Note|null>} Note supprimée ou null si non trouvée
   */
  async deleteNote(noteId, internauteId) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new Error("Note non trouvée");
    }

    if (note.internaute.toString() !== internauteId) {
      throw new Error("Accès refusé");
    }

    return Note.findByIdAndDelete(noteId);
  }
}

module.exports = new NoteService();
