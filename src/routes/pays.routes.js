// routes/pays.js
const express = require('express');
const paysController = require('../controllers/pays.controller');

const router = express.Router();

/**
 * @openapi
 * /api/pays:
 *   get:
 *     tags: [Pays]
 *     summary: Récupère tous les pays
 *     responses:
 *       200:
 *         description: Liste des pays
 */
router.get('/', paysController.getAllPays.bind(paysController));

/**
 * @openapi
 * /api/pays/{code}:
 *   get:
 *     tags: [Pays]
 *     summary: Récupère un pays et ses films
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du pays et ses films
 *       404:
 *         description: Pays non trouvé
 */
router.get('/:code', paysController.getPaysWithFilms.bind(paysController));

/**
 * @openapi
 * /api/pays:
 *   post:
 *     tags: [Pays]
 *     summary: Crée un nouveau pays
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pays créé
 *       400:
 *         description: Requête invalide
 */
router.post('/', paysController.createPays.bind(paysController));

/**
 * @openapi
 * /api/pays/{code}:
 *   put:
 *     tags: [Pays]
 *     summary: Met à jour un pays existant
 *     parameters:
 *       - in: path
 *         name: code
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pays mis à jour
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Pays non trouvé
 */
router.put('/:code', paysController.updatePays.bind(paysController));

/**
 * @openapi
 * /api/pays/{code}:
 *   delete:
 *     tags: [Pays]
 *     summary: Supprime un pays
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pays supprimé
 *       404:
 *         description: Pays non trouvé
 */
router.delete('/:code', paysController.deletePays.bind(paysController));

module.exports = router;