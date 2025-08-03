const express = require('express');
const internauteController = require('../controllers/internaute.controller');
const { auth } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @openapi
 * /api/internautes:
 *   get:
 *     tags: [Internautes]
 *     summary: Récupère tous les internautes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des internautes
 */

router.get('/', internauteController.getAllInternautes.bind(internauteController));

/**
 * @openapi
 * /api/internautes/{id}:
 *   get:
 *     tags: [Internautes]
 *     summary: Récupère un internaute par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'internaute
 *       404:
 *         description: Internaute non trouvé
 */
router.get('/:id', internauteController.getInternauteById.bind(internauteController));

// Mettre à jour un internaute
/**
 * @openapi
 * /api/internautes/{id}:
 *   put:
 *     tags: [Internautes]
 *     summary: Met à jour un internaute
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Internaute mis à jour
 */
router.put('/:id', auth, internauteController.updateInternaute.bind(internauteController));

// Supprimer un internaute
/**
 * @openapi
 * /api/internautes/{id}:
 *   delete:
 *     tags: [Internautes]
 *     summary: Supprime un internaute
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Internaute supprimé avec succès
 *       404:
 *         description: Internaute non trouvé
 */
router.delete('/:id', auth, internauteController.deleteInternaute.bind(internauteController));

module.exports = router;