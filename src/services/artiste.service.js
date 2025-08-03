const Artiste = require('../models/artiste.model');
const Film = require('../models/film.model');
const Role = require('../models/role.model');
const ArtisteDto = require('../dto/artiste.dto');
const FilmDto = require('../dto/film.dto');

/**
 * Service pour gérer les opérations liées aux artistes
 */
class ArtisteService {
  /**
   * Récupère tous les artistes avec pagination et filtres
   * @param {number} page - Numéro de la page
   * @param {number} limit - Nombre d'éléments par page
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<{artistes: ArtisteDto[], pagination: Object}>} Artistes et informations de pagination
   */
  async getAllArtistes(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const artistes = await Artiste.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ nom: 1, prenom: 1 });

    const total = await Artiste.countDocuments(filters);

    return {
      artistes: artistes.map(artiste => ArtisteDto.toDto(artiste)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupère un artiste et sa filmographie
   * @param {string} id - Identifiant de l'artiste
   * @returns {Promise<{artiste: ArtisteDto, filmographie: Object}|null>} Artiste et sa filmographie ou null si non trouvé
   */
  async getArtisteById(id) {
    const artiste = await Artiste.findById(id);
    if (!artiste) return null;

    // Récupération des films réalisés
    const filmsRealises = await Film.find({ realisateur: id })
      .populate('pays', 'nom code langue');

    // Récupération des rôles de l'artiste
    const roles = await Role.find({ artiste: id })
      .populate({
        path: 'film',
        populate: {
          path: 'pays',
          select: 'nom code langue'
        }
      });

    return {
      artiste: ArtisteDto.toDto(artiste),
      filmographie: {
        realisateur: filmsRealises.map(film => FilmDto.toDto(film)),
        roles: roles.map(role => ({
          id: role._id,
          libelle: role.libelle,
          film: FilmDto.toDto(role.film)
        }))
      }
    };
  }

  /**
   * Crée un nouvel artiste
   * @param {Object} artisteData - Données de l'artiste à créer
   * @returns {Promise<ArtisteDto>} Artiste créé converti en DTO
   */
  async createArtiste(artisteData) {
    const artiste = new Artiste(artisteData);
    await artiste.save();
    return ArtisteDto.toDto(artiste);
  }

  /**
   * Met à jour un artiste existant
   * @param {string} id - Identifiant de l'artiste
   * @param {Object} artisteData - Nouvelles données de l'artiste
   * @returns {Promise<ArtisteDto|null>} Artiste mis à jour converti en DTO ou null si non trouvé
   */
  async updateArtiste(id, artisteData) {
    const artiste = await Artiste.findByIdAndUpdate(
      id,
      artisteData,
      { new: true, runValidators: true }
    );
    return artiste ? ArtisteDto.toDto(artiste) : null;
  }

  /**
   * Supprime un artiste
   * @param {string} id - Identifiant de l'artiste à supprimer
   * @returns {Promise<Object|null>} Artiste supprimé ou null si non trouvé
   */
  async deleteArtiste(id) {
    return Artiste.findByIdAndDelete(id);
  }
}

module.exports = new ArtisteService();