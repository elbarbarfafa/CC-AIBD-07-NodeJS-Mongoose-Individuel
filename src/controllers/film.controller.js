const filmService = require("../services/film.service");

/**
 * Contrôleur gérant les opérations CRUD sur les films
 */
class FilmController {
  /**
   * Récupère la liste paginée des films avec filtres optionnels
   * @param {Request} req - Requête Express avec query params: page, limit, genre, annee, titre
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getAllFilms(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = {};
      if (req.query.genre) filter.genre = req.query.genre; // Recherche par genre
      if (req.query.annee) filter.annee = parseInt(req.query.annee); // Recherche par année
      if (req.query.titre) filter.titre = new RegExp(req.query.titre, "i"); // Recherche par titre
      if (req.query.realisateur) filter.realisateur = req.query.realisateur; // Recherche par réalisateur

      const result = await filmService.getAllFilms(page, limit, filter);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupère le détail d'un film par son identifiant
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async getFilmById(req, res, next) {
    try {
      const result = await filmService.getFilmById(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Film non trouvé" });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crée un nouveau film
   * @param {Request} req - Requête Express avec body contenant les données du film
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async createFilm(req, res, next) {
    try {
      const film = await filmService.createFilm(req.body);
      res.status(201).json({
        message: "Film créé avec succès",
        film,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Met à jour le document associé au résumé d'un film
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @returns 
   */
  async updateResumeFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier n'a été uploadé" });
    }

    const filmId = req.params.id;
    const documentPath = req.file.path;

    const film = await filmService.updateResumeFile(filmId, documentPath);
    
    if (!film) {
      return res.status(404).json({ error: "Film non trouvé" });
    }

    res.json({
      message: "Document résumé mis à jour avec succès",
      film
    });
  } catch (error) {
    next(error);
  }
}

  /**
   * Met à jour un film existant
   * @param {Request} req - Requête Express avec params.id et body contenant les données à mettre à jour
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async updateFilm(req, res, next) {
    try {
      const film = await filmService.updateFilm(req.params.id, req.body);
      if (!film) {
        return res.status(404).json({ error: "Film non trouvé" });
      }
      res.json({
        message: "Film mis à jour",
        film,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprime un film
   * @param {Request} req - Requête Express avec params.id
   * @param {Response} res - Réponse Express
   * @param {NextFunction} next - Fonction next d'Express
   */
  async deleteFilm(req, res, next) {
    try {
      const film = await filmService.deleteFilm(req.params.id);
      if (!film) {
        return res.status(404).json({ error: "Film non trouvé" });
      }
      res.json({ message: "Film supprimé" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FilmController();
