const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');

/**
 * Contrôleur gérant l'authentification et l'enregistrement des utilisateurs
 */
class AuthController {
  /**
   * Enregistre un nouvel internaute
   * @param {Request} req - Requête Express avec body contenant email, motDePasse, nom, prenom, anneeNaissance
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, internaute } = await authService.register(req.body);

      res.status(201).json({
        message: 'Internaute créé avec succès',
        token,
        internaute
      });
    } catch (error) {
      if (error.message === 'Cet email est déjà utilisé') {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Authentifie un internaute
   * @param {Request} req - Requête Express avec body contenant email et motDePasse
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, motDePasse } = req.body;
      const { token, internaute } = await authService.login(email, motDePasse);

      res.json({
        message: 'Connexion réussie',
        token,
        internaute
      });
    } catch (error) {
      if (error.message === 'Identifiants invalides') {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  }

  /**
   * Récupère le profil de l'internaute connecté
   * @param {Request} req - Requête Express avec l'internaute authentifié
   * @param {Response} res - Réponse Express
   */
  async getProfile(req, res) {
    res.json({ internaute: req.internaute });
  }
}

module.exports = new AuthController();