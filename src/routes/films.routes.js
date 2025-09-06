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

module.exports = router;
