const Film = require('../models/film.model');
const { FilmMapper } = require('../mappers');

/**
 * Service pour gérer les opérations liées aux films
 */
class FilmService {
  /**
   * Récupère tous les films avec pagination et filtres
   * @param {number} page - Numéro de la page
   * @param {number} limit - Nombre d'éléments par page
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<{films: FilmDto[], pagination: Object}>} Films et informations de pagination
   */
  async getAllFilms(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    
    const films = await Film.find(filters)
      .populate('realisateur', 'nom prenom anneeNaissance')
      .populate('pays', 'nom code langue')
      .skip(skip)
      .limit(limit)
      .sort({ annee: -1 });

    const total = await Film.countDocuments(filters);

    return {
      films: FilmMapper.toDtoList(films),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Permet de récupérer un film par son identifiant
   * @param {*} id - Identifiant du film
   * @returns {Promise<FilmDto|null>} - FilmDto ou null si non trouvé
   */
  async getFilmById(id) {
    const film = await Film.findById(id)
      .populate('realisateur', 'nom prenom anneeNaissance')
      .populate('pays', 'nom code langue');

    if (!film) return null;

    return FilmMapper.toDto(film);
  }

  /**
   * Crée un nouveau film
   * @param {Object} filmData - Données du film à créer
   * @returns {Promise<FilmDto>} Film créé converti en DTO
   */
  async createFilm(filmData) {
    const film = new Film(filmData);
    await film.save();
    await film.populate([
      { path: 'realisateur', select: 'nom prenom anneeNaissance' },
      { path: 'pays', select: 'nom code langue' }
    ]);
    return FilmMapper.toDto(film);
  }

  /**
   * Met à jour un film existant
   * @param {string} id - Identifiant du film
   * @param {Object} filmData - Nouvelles données du film
   * @returns {Promise<FilmDto|null>} Film mis à jour converti en DTO ou null si non trouvé
   */
  async updateFilm(id, filmData) {
    const film = await Film.findByIdAndUpdate(
      id,
      filmData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'realisateur', select: 'nom prenom anneeNaissance' },
      { path: 'pays', select: 'nom code langue' }
    ]);
    return film ? FilmMapper.toDto(film) : null;
  }

  /**
   * Supprime un film
   * @param {string} id - Identifiant du film à supprimer
   * @returns {Promise<Object|null>} Film supprimé ou null si non trouvé
   */
  async deleteFilm(id) {
    return Film.findByIdAndDelete(id);
  }
}

module.exports = new FilmService();