const noteService = require('../services/note.service');

/**
 * Contrôleur gérant les opérations CRUD sur les notes
 */
class NoteController {
  /**
   * Récupère la liste paginée des notes avec filtres optionnels
   * @param {Request} req - Requête Express avec query params: page, limit, film, internaute
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getAllNotes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};
      if (req.query.film) filter.film = req.query.film; // Recherche par un film donnée
      if (req.query.internaute) filter.internaute = req.query.internaute; // Recherche par un internaute spécifique

      const result = await noteService.getAllNotes(page, limit, filter);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère toutes les notes d'un film
   * @param {Request} req - Requête Express avec params.id du film
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getFilmNotes(req, res, next) {
    try {
      const result = await noteService.getFilmNotes(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crée une nouvelle note
   * @param {Request} req - Requête Express avec body contenant film, note, commentaire et l'internaute authentifié
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async createNote(req, res, next) {
    try {
      const { film, note, commentaire } = req.body;
      const nouvelleNote = await noteService.createNote(req.user._id, { film, note, commentaire });
      
      res.status(201).json({
        message: 'Note créée avec succès',
        note: nouvelleNote
      });
    } catch (error) {
      if (error.message === 'Vous avez déjà noté ce film') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Met à jour une note existante
   * @param {Request} req - Requête Express avec params.id et body contenant les modifications
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async updateNote(req, res, next) {
    try {
      const noteModifiee = await noteService.updateNote(
        req.params.id,
        req.user._id,
        req.body
      );
      
      res.json({
        message: 'Note mise à jour',
        note: noteModifiee
      });
    } catch (error) {
      if (error.message === 'Note non trouvée') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Accès refusé') {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Supprime une note
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async deleteNote(req, res, next) {
    try {
      await noteService.deleteNote(req.params.id, req.user._id);
      res.json({ message: 'Note supprimée' });
    } catch (error) {
      if (error.message === 'Note non trouvée') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Accès refusé') {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }
}

module.exports = new NoteController();