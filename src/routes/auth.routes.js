const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.middleware");

const router = express.Router();

const registerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("nom").notEmpty().withMessage("Le nom est requis"),
  body("prenom").notEmpty().withMessage("Le prénom est requis"),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("anneeNaissance")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Année de naissance invalide"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("motDePasse").notEmpty().withMessage("Le mot de passe est requis"),
];

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *               - nom
 *               - prenom
 *               - anneeNaissance
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *                 minimum: 6
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               anneeNaissance:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides
 */
router.post(
  "/register",
  registerValidation,
  authController.register.bind(authController)
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post(
  "/login",
  loginValidation,
  authController.login.bind(authController)
);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *      tags: [Authentication]
 *      summary: Récupère le profil de l'utilisateur connecté
 *      responses:
 *        200:
 *          description: Profil de l'utilisateur
 *        401:
 *          description: Non autorisé
 */
router.get("/profile", auth, authController.getProfile.bind(authController));

module.exports = router;
