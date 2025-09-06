const NoteDto = require('../dto/note.dto');

/**
 * Mapper pour transformer les entités Note en NoteDto et vice versa
 */
class NoteMapper {
    /**
     * Transforme une entité Note en NoteDto
     * @param {Object} note - L'entité Note de Mongoose avec populate
     * @returns {NoteDto} L'objet DTO correspondant
     */
    static toDto(note) {
        if (!note) return null;
        
        return new NoteDto(
            note._id,
            note.note,
            note.commentaire,
            note.dateAjout || note.createdAt,
            note.internaute ? {
                id: note.internaute._id,
                nom: note.internaute.nom,
                pseudo: note.internaute.pseudo
            } : null,
            note.film ? {
                id: note.film._id,
                titre: note.film.titre
            } : null
        );
    }

    /**
     * Transforme un tableau d'entités Note en tableau de NoteDto
     * @param {Array} notes - Tableau d'entités Note
     * @returns {Array<NoteDto>} Tableau de DTOs correspondant
     */
    static toDtoList(notes) {
        if (!notes || !Array.isArray(notes)) return [];
        return notes.map(note => this.toDto(note));
    }

    /**
     * Extrait les données d'un DTO pour créer/mettre à jour une entité
     * @param {NoteDto|Object} dto - Le DTO ou objet avec les données
     * @returns {Object} Objet avec les propriétés pour l'entité
     */
    static toEntity(dto) {
        if (!dto) return null;

        const entity = {};
        if (dto.note !== undefined) entity.note = dto.note;
        if (dto.commentaire !== undefined) entity.commentaire = dto.commentaire;
        if (dto.dateAjout !== undefined) entity.dateAjout = dto.dateAjout;
        if (dto.internauteId !== undefined) entity.internaute = dto.internauteId;
        if (dto.filmId !== undefined) entity.film = dto.filmId;
        
        return entity;
    }
}

module.exports = NoteMapper;
