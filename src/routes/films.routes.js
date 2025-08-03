const express = require("express");
const filmController = require("../controllers/film.controller");
const upload = require("../middlewares/storage.middleware");

const router = express.Router();

/**
 * @openapi
 * /api/films:
 *   get:
 *     tags: [Films]
 *     summary: Récupère tous les films
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *       - in: query
 *         name: titre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des films
 */
router.get("/", filmController.getAllFilms.bind(filmController));

/**
 * @openapi
 * /api/films/{id}:
 *   get:
 *     tags: [Films]
 *     summary: Récupère un film par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du film
 *       404:
 *         description: Film non trouvé
 */
router.get("/:id", filmController.getFilmById.bind(filmController));

/**
 * @openapi
 * /api/films:
 *   post:
 *     tags: [Films]
 *     summary: Crée un nouveau film
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               annee:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Film créé
 *       400:
 *         description: Requête invalide
 */
router.post("/", filmController.createFilm.bind(filmController));

/**
 * @openapi
 * /api/films/{id}/resume/upload:
 *   post:
 *     tags: [Films]
 *     summary: Upload un document résumé pour un film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resumeFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Document résumé mis à jour
 *       400:
 *         description: Erreur dans l'upload
 *       404:
 *         description: Film non trouvé
 */
router.post("/:id/resume/upload", upload.single('resumeFile'), filmController.updateResumeFile.bind(filmController));

/**
 * @openapi
 * /api/films/{id}:
 *   put:
 *     tags: [Films]
 *     summary: Met à jour un film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               annee:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Film mis à jour
 */
router.put("/:id", filmController.updateFilm.bind(filmController));

/**
 * @openapi
 * /api/films/{id}:
 *   delete:
 *     tags: [Films]
 *     summary: Supprime un film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Film supprimé
 *       404:
 *        description: Film non trouvé
 */
router.delete("/:id", filmController.deleteFilm.bind(filmController));

module.exports = router;
