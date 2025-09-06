const PaysDto = require('../dto/pays.dto');

/**
 * Mapper pour transformer les entités Pays en PaysDto et vice versa
 */
class PaysMapper {
    /**
     * Transforme une entité Pays en PaysDto
     * @param {Object} pays - L'entité Pays de Mongoose
     * @returns {PaysDto} L'objet DTO correspondant
     */
    static toDto(pays) {
        if (!pays) return null;
        
        return new PaysDto(
            pays._id,
            pays.code,
            pays.nom,
            pays.langue
        );
    }

    /**
     * Transforme un tableau d'entités Pays en tableau de PaysDto
     * @param {Array} paysArray - Tableau d'entités Pays
     * @returns {Array<PaysDto>} Tableau de DTOs correspondant
     */
    static toDtoList(paysArray) {
        if (!paysArray || !Array.isArray(paysArray)) return [];
        return paysArray.map(pays => this.toDto(pays));
    }
}

module.exports = PaysMapper;
