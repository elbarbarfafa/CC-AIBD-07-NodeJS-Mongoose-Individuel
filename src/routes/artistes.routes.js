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

/**
 * @openapi
 * /api/artistes:
 *   post:
 *     tags: [Artistes]
 *     summary: Crée un nouvel artiste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               nationalite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artiste créé
 */
router.post('/', artisteController.createArtiste.bind(artisteController));

// Mettre à jour un artiste
/**
 * @openapi
 * /api/artistes/{id}:
 *   put:
 *     tags: [Artistes]
 *     summary: Met à jour un artiste existant
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
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               nationalite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artiste mis à jour
 */
router.put('/:id', artisteController.updateArtiste.bind(artisteController));

// Supprimer un artiste
/**
 * @openapi
 * /api/artistes/{id}:
 *   delete:
 *     tags: [Artistes]
 *     summary: Supprime un artiste
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Artiste supprimé avec succès
 *       404:
 *         description: Artiste non trouvé
 */
router.delete('/:id', artisteController.deleteArtiste.bind(artisteController));

module.exports = router;