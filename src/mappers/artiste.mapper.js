const ArtisteDto = require('../dto/artiste.dto');

/**
 * Mapper pour transformer les entités Artiste en ArtisteDto et vice versa
 */
class ArtisteMapper {
    /**
     * Transforme une entité Artiste en ArtisteDto
     * @param {Object} artiste - L'entité Artiste de Mongoose
     * @returns {ArtisteDto} L'objet DTO correspondant
     */
    static toDto(artiste) {
        if (!artiste) return null;
        
        return new ArtisteDto(
            artiste._id,
            artiste.nom,
            artiste.prenom,
            artiste.anneeNaissance
        );
    }

    /**
     * Transforme un tableau d'entités Artiste en tableau d'ArtisteDto
     * @param {Array} artistes - Tableau d'entités Artiste
     * @returns {Array<ArtisteDto>} Tableau de DTOs correspondant
     */
    static toDtoList(artistes) {
        if (!artistes || !Array.isArray(artistes)) return [];
        return artistes.map(artiste => this.toDto(artiste));
    }

    /**
     * Extrait les données d'un DTO pour créer/mettre à jour une entité
     * @param {ArtisteDto|Object} dto - Le DTO ou objet avec les données
     * @returns {Object} Objet avec les propriétés pour l'entité
     */
    static toEntity(dto) {
        if (!dto) return null;

        const entity = {};
        if (dto.nom !== undefined) entity.nom = dto.nom;
        if (dto.prenom !== undefined) entity.prenom = dto.prenom;
        if (dto.anneeNaissance !== undefined) entity.anneeNaissance = dto.anneeNaissance;
        
        return entity;
    }
}

module.exports = ArtisteMapper;
