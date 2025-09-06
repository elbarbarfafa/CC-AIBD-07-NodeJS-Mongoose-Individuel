const artisteService = require('../services/artiste.service');

/**
 * Contrôleur gérant les opérations CRUD sur les artistes
 */
class ArtisteController {
  /**
   * Récupère la liste paginée des artistes avec filtres optionnels
   * @param {Request} req - Requête Express avec query params: page, limit, nom, prenom
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getAllArtistes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};
      if (req.query.nom) filter.nom = new RegExp(req.query.nom, 'i');
      if (req.query.prenom) filter.prenom = new RegExp(req.query.prenom, 'i');

      const result = await artisteService.getAllArtistes(page, limit, filter);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un artiste par son identifiant
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getArtisteById(req, res, next) {
    try {
      const result = await artisteService.getArtisteById(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Artiste non trouvé' });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  
}

module.exports = new ArtisteController();