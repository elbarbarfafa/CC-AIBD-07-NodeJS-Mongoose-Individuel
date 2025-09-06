const jwt = require('jsonwebtoken');
const Internaute = require('../models/internaute.model');
const { InternauteMapper } = require('../mappers');

class AuthService {
  /**
   * Permet l'inscription d'un utilisateur.
   * @param {*} userData - Objet contenant les données de l'utilisateur.
   * @param {string} userData.email - L'email de l'utilisateur.
   * @param {string} userData.nom - Le nom de l'utilisateur.
   * @param {string} userData.prenom - Le prénom de l'utilisateur.
   * @param {string} userData.motDePasse - Le mot de passe de l'utilisateur.
   * @param {number} userData.anneeNaissance - L'année de naissance de l'utilisateur.
   * @throws {Error} Si l'email est déjà utilisé.
   * @returns {Promise<{token: string, internaute: InternauteDto}>} L'objet contenant le token JWT et les informations de l'internaute.
   */
  async register(userData) {
    const { email, nom, prenom, motDePasse, anneeNaissance } = userData;

    const existingInternaute = await Internaute.findOne({ email });
    if (existingInternaute) {
      throw new Error('Cet email est déjà utilisé');
    }

    const internaute = new Internaute({ email, nom, prenom, motDePasse, anneeNaissance });
    await internaute.save();

    // gération du token JWT pour l'utilisateur
    const token = this.generateToken(internaute._id);
    return { token, internaute: InternauteMapper.toDto(internaute) };
  }

  /**
   * Permet à un internaute de se connecter.
   * @param {string} email - L'email de l'internaute.
   * @param {string} motDePasse - Le mot de passe de l'internaute.
   * @throws {Error} Si les identifiants sont invalides.
   * @returns  {Promise<{token: string, internaute: InternauteDto}>} L'objet contenant le token JWT et les informations de l'internaute.
   */
  async login(email, motDePasse) {
    const internaute = await Internaute.findOne({ email });
    if (!internaute) {
      throw new Error('Identifiants invalides');
    }

    const isMatch = await internaute.comparePassword(motDePasse);
    if (!isMatch) {
      throw new Error('Identifiants invalides');
    }

    const token = this.generateToken(internaute._id);
    return { token, internaute: InternauteMapper.toDto(internaute) };
  }

  /**
   * Permet de générer un token JWT contenant l'ID de l'utilisateur.
   * @param {string} userId - L'ID de l'utilisateur. 
   * @returns {string} Le token JWT généré.
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Récupère le profil de l'utilisateur connecté.
   * @param {string} userId Identifiant de l'utilisateur pour récupérer son profil.
   * @returns {Promise<InternauteDto|null>} L'objet contenant les informations de l'internaute ou null si non trouvé.
   */
  async getProfile(userId) {
    const internaute = await Internaute.findById(userId);
    return internaute ? InternauteMapper.toDto(internaute) : null;
  }
}

module.exports = new AuthService();