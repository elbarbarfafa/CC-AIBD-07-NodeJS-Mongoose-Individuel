const Pays = require('../models/pays.model');
const Film = require('../models/film.model');
const { PaysMapper, FilmMapper } = require('../mappers');

/**
 * Service pour gérer les opérations liées aux pays
 */
class PaysService {
  /**
   * Récupère tous les pays triés par nom
   * @returns {Promise<PaysDto[]>} Liste des pays convertis en DTO
   */
  async getAllPays() {
    const pays = await Pays.find({}).sort({ nom: 1 });
    return PaysMapper.toDtoList(pays);
  }

  /**
   * Récupère un pays et ses films associés
   * @param {string} code - Code du pays à rechercher
   * @returns {Promise<{pays: PaysDto, films: FilmDto[]}>} Pays et ses films associés
   */
  async getPaysWithFilms(code) {
    const pays = await Pays.findOne({ code: code.toUpperCase() });
    if (!pays) return null;

    const films = await Film.find({ pays: pays._id })
      .populate('realisateur', 'nom prenom')
      .populate('acteurs', 'nom prenom')
      .sort({ annee: -1 });

    return {
      pays: PaysMapper.toDto(pays),
      films: FilmMapper.toDtoList(films)
    };
  }

  /**
   * Crée un nouveau pays
   * @param {Object} paysData - Données du pays à créer
   * @returns {Promise<PaysDto>} Pays créé converti en DTO
   */
  async createPays(paysData) {
    const pays = new Pays(paysData);
    await pays.save();
    return PaysMapper.toDto(pays);
  }

  /**
   * Met à jour un pays existant
   * @param {string} code - Code du pays à mettre à jour
   * @param {Object} paysData - Nouvelles données du pays
   * @returns {Promise<PaysDto|null>} Pays mis à jour converti en DTO ou null si non trouvé
   */
  async updatePays(code, paysData) {
    const pays = await Pays.findOneAndUpdate(
      { code: code.toUpperCase() },
      paysData,
      { new: true, runValidators: true }
    );
    return pays ? PaysMapper.toDto(pays) : null;
  }

  /**
   * Supprime un pays
   * @param {string} code - Code du pays à supprimer
   * @returns {Promise<Object|null>} Pays supprimé ou null si non trouvé
   */
  async deletePays(code) {
    return Pays.findOneAndDelete({ code: code.toUpperCase() });
  }
}

module.exports = new PaysService();