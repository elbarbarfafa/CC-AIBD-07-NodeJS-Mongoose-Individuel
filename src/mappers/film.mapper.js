const FilmDto = require('../dto/film.dto');

/**
 * Mapper pour transformer les entités Film en FilmDto et vice versa
 */
class FilmMapper {
    /**
     * Transforme une entité Film en FilmDto
     * @param {Object} film - L'entité Film de Mongoose avec populate
     * @returns {FilmDto} L'objet DTO correspondant
     */
    static toDto(film) {
        if (!film) return null;
        
        return new FilmDto(
            film._id,
            film.titre,
            film.annee,
            film.genre,
            film.synopsis,
            film.realisateur ? {
                id: film.realisateur._id,
                nom: film.realisateur.nom,
                prenom: film.realisateur.prenom
            } : null,
            [], // roles - à implémenter si nécessaire
            film.pays ? {
                id: film.pays._id,
                nom: film.pays.nom,
                code: film.pays.code
            } : null,
            null // document_chemin - à implémenter si nécessaire
        );
    }

    /**
     * Transforme un tableau d'entités Film en tableau de FilmDto
     * @param {Array} films - Tableau d'entités Film
     * @returns {Array<FilmDto>} Tableau de DTOs correspondant
     */
    static toDtoList(films) {
        if (!films || !Array.isArray(films)) return [];
        return films.map(film => this.toDto(film));
    }
}

module.exports = FilmMapper;
