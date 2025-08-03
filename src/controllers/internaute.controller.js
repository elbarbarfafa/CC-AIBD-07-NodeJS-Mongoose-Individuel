const internauteService = require('../services/internaute.service');

/**
 * Contrôleur gérant les opérations CRUD sur les internautes
 */
class InternauteController {
  /**
   * Récupère la liste paginée des internautes
   * @param {Request} req - Requête Express avec query params: page, limit
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getAllInternautes(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await internauteService.getAllInternautes(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère un internaute par son identifiant
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getInternauteById(req, res, next) {
    try {
      const internaute = await internauteService.getInternauteById(req.params.id);
      if (!internaute) {
        return res.status(404).json({ error: 'Internaute non trouvé' });
      }
      res.json({ internaute });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour un internaute
   * @param {Request} req - Requête Express avec params.id et body contenant nom, prenom, email, anneeNaissance
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async updateInternaute(req, res, next) {
    try {
      const { nom, prenom, email, anneeNaissance } = req.body;
      const internauteId = req.params.id;

      if (req.internaute._id.toString() !== internauteId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const internaute = await internauteService.updateInternaute(
        internauteId,
        { nom, prenom, email, anneeNaissance }
      );

      if (!internaute) {
        return res.status(404).json({ error: 'Internaute non trouvé' });
      }

      res.json({ message: 'Internaute mis à jour', internaute });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un internaute
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async deleteInternaute(req, res, next) {
    try {
      const internauteId = req.params.id;

      if (req.internaute._id.toString() !== internauteId) {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const internaute = await internauteService.deleteInternaute(internauteId);
      if (!internaute) {
        return res.status(404).json({ error: 'Internaute non trouvé' });
      }
      res.json({ message: 'Internaute supprimé' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InternauteController();