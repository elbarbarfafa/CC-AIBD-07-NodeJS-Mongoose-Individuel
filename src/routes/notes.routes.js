// routes/notes.js
const express = require('express');
const noteController = require('../controllers/note.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @openapi
 * /api/notes:
 *   get:
 *     tags: [Notes]
 *     summary: Récupère toutes les notes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: film
 *         schema:
 *           type: string
 *       - in: query
 *         name: internaute
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des notes
 */
router.get('/', noteController.getAllNotes.bind(noteController));

/**
 * @openapi
 * /api/notes/film/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Récupère les notes d'un film
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes du film
 */
router.get('/film/:id', noteController.getFilmNotes.bind(noteController));

/**
 * @openapi
 * /api/notes/internaute/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Récupère les notes d'un internaute
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes de l'internaute
 */
router.get('/internaute/:id', noteController.getInternauteNotes.bind(noteController));

/**
 * @openapi
 * /api/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Crée une nouvelle note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filmId:
 *                 type: string
 *               internauteId:
 *                 type: string
 *               note:
 *                 type: number
 *     responses:
 *       201:
 *         description: Note créée
 *       400:
 *         description: Requête invalide
 */
router.post('/', auth, noteController.createNote.bind(noteController));

/**
 * @openapi
 * /api/notes/{id}:
 *   put:
 *     tags: [Notes]
 *     summary: Met à jour une note
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
 *               note:
 *                 type: number
 *     responses:
 *       200:
 *         description: Note mise à jour
 *       404:
 *         description: Note non trouvée
 */
router.put('/:id', auth, noteController.updateNote.bind(noteController));

/**
 * @openapi
 * /api/notes/{id}:
 *   delete:
 *     tags: [Notes]
 *     summary: Supprime une note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note supprimée
 *       404:
 *         description: Note non trouvée
 */
router.delete('/:id', auth, noteController.deleteNote.bind(noteController));

module.exports = router;