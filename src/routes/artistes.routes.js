// routes/artistes.js
const express = require('express');
const artisteController = require('../controllers/artiste.controller');

const router = express.Router();

/**
 * @openapi
 * /api/artistes:
 *   get:
 *     tags: [Artistes]
 *     summary: Récupère tous les artistes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Filtre par nom
 *       - in: query
 *         name: prenom
 *         schema:
 *           type: string
 *         description: Filtre par prénom
 *     responses:
 *       200:
 *         description: Liste des artistes
 */
router.get('/', artisteController.getAllArtistes.bind(artisteController));

/**
 * @openapi
 * /api/artistes/{id}:
 *   get:
 *     tags: [Artistes]
 *     summary: Récupère un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'artiste
 *       404:
 *         description: Artiste non trouvé
 */
router.get('/:id', artisteController.getArtisteById.bind(artisteController));

module.exports = router;