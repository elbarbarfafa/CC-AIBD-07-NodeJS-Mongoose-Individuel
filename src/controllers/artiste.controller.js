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

  /**
   * Crée un nouvel artiste
   * @param {Request} req - Requête Express avec body contenant les données de l'artiste
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async createArtiste(req, res, next) {
    try {
      const artiste = await artisteService.createArtiste(req.body);
      res.status(201).json({
        message: 'Artiste créé avec succès',
        artiste
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un artiste existant
   * @param {Request} req - Requête Express avec params.id et body contenant les données à mettre à jour
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async updateArtiste(req, res, next) {
    try {
      const artiste = await artisteService.updateArtiste(req.params.id, req.body);
      if (!artiste) {
        return res.status(404).json({ error: 'Artiste non trouvé' });
      }
      res.json({
        message: 'Artiste mis à jour',
        artiste
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un artiste
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async deleteArtiste(req, res, next) {
    try {
      const artiste = await artisteService.deleteArtiste(req.params.id);
      if (!artiste) {
        return res.status(404).json({ error: 'Artiste non trouvé' });
      }
      res.json({ message: 'Artiste supprimé' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArtisteController();