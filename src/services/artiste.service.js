const Artiste = require('../models/artiste.model');
const Film = require('../models/film.model');
const Role = require('../models/role.model');
const { ArtisteMapper, FilmMapper } = require('../mappers');

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
      artistes: ArtisteMapper.toDtoList(artistes),
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
      artiste: ArtisteMapper.toDto(artiste),
      filmographie: {
        realisateur: FilmMapper.toDtoList(filmsRealises),
        roles: roles.map(role => ({
          id: role._id,
          libelle: role.libelle,
          film: FilmMapper.toDto(role.film)
        }))
      }
    };
  }

}

module.exports = new ArtisteService();