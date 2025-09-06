const InternauteDto = require('../dto/internaute.dto');

/**
 * Mapper pour transformer les entités Internaute en InternauteDto et vice versa
 */
class InternauteMapper {
    /**
     * Transforme une entité Internaute en InternauteDto
     * @param {Object} internaute - L'entité Internaute de Mongoose
     * @returns {InternauteDto} L'objet DTO correspondant
     */
    static toDto(internaute) {
        if (!internaute) return null;
        
        return new InternauteDto(
            internaute._id,
            internaute.email,
            internaute.nom,
            internaute.prenom,
            internaute.anneeNaissance,
            internaute.createdAt
        );
    }

    /**
     * Transforme un tableau d'entités Internaute en tableau d'InternauteDto
     * @param {Array} internautes - Tableau d'entités Internaute
     * @returns {Array<InternauteDto>} Tableau de DTOs correspondant
     */
    static toDtoList(internautes) {
        if (!internautes || !Array.isArray(internautes)) return [];
        return internautes.map(internaute => this.toDto(internaute));
    }

    /**
     * Extrait les données d'un DTO pour créer/mettre à jour une entité
     * @param {InternauteDto|Object} dto - Le DTO ou objet avec les données
     * @returns {Object} Objet avec les propriétés pour l'entité
     */
    static toEntity(dto) {
        if (!dto) return null;

        const entity = {};
        if (dto.nom !== undefined) entity.nom = dto.nom;
        if (dto.prenom !== undefined) entity.prenom = dto.prenom;
        if (dto.email !== undefined) entity.email = dto.email;
        if (dto.annee_naissance !== undefined) entity.anneeNaissance = dto.annee_naissance;
        if (dto.motDePasse !== undefined) entity.motDePasse = dto.motDePasse;
        
        return entity;
    }
}

module.exports = InternauteMapper;
