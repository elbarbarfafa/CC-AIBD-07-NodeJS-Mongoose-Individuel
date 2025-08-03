const paysService = require('../services/pays.service');

/**
 * Contrôleur gérant les opérations CRUD sur les pays
 */
class PaysController {
  /**
   * Récupère la liste de tous les pays
   * @param {Request} req - Requête Express
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getAllPays(req, res, next) {
    try {
      const pays = await paysService.getAllPays();
      res.json({ pays });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un pays et ses films associés
   * @param {Request} req - Requête Express avec params.code du pays
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getPaysWithFilms(req, res, next) {
    try {
      const result = await paysService.getPaysWithFilms(req.params.code);
      if (!result) {
        return res.status(404).json({ error: 'Pays non trouvé' });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crée un nouveau pays
   * @param {Request} req - Requête Express avec body contenant les données du pays
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async createPays(req, res, next) {
    try {
      const pays = await paysService.createPays(req.body);
      res.status(201).json({
        message: 'Pays créé avec succès',
        pays
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un pays existant
   * @param {Request} req - Requête Express avec params.code et body contenant les données à mettre à jour
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async updatePays(req, res, next) {
    try {
      const pays = await paysService.updatePays(req.params.code, req.body);
      if (!pays) {
        return res.status(404).json({ error: 'Pays non trouvé' });
      }
      res.json({
        message: 'Pays mis à jour',
        pays
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un pays
   * @param {Request} req - Requête Express avec params.code
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async deletePays(req, res, next) {
    try {
      const pays = await paysService.deletePays(req.params.code);
      if (!pays) {
        return res.status(404).json({ error: 'Pays non trouvé' });
      }
      res.json({ message: 'Pays supprimé' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaysController();