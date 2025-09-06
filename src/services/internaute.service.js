const Internaute = require('../models/internaute.model');
const { InternauteMapper } = require('../mappers');

/**
 * Service pour gérer les opérations liées aux internautes
 */
class InternauteService {
  /**
   * Récupère tous les internautes avec pagination
   * @param {number} page - Numéro de la page
   * @param {number} limit - Nombre d'éléments par page
   * @returns {Promise<{internautes: InternauteDto[], pagination: Object}>} Internautes et informations de pagination
   */
  async getAllInternautes(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const internautes = await Internaute.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Internaute.countDocuments();

    return {
      internautes: InternauteMapper.toDtoList(internautes),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupère un internaute par son identifiant
   * @param {string} id - Identifiant de l'internaute
   * @returns {Promise<InternauteDto|null>} Internaute converti en DTO ou null si non trouvé
   */
  async getInternauteById(id) {
    const internaute = await Internaute.findById(id);
    return internaute ? InternauteMapper.toDto(internaute) : null;
  }

  /**
   * Met à jour un internaute
   * @param {string} id - Identifiant de l'internaute
   * @param {Object} updateData - Nouvelles données de l'internaute
   * @returns {Promise<InternauteDto|null>} Internaute mis à jour converti en DTO ou null si non trouvé
   */
  async updateInternaute(id, updateData) {
    const internaute = await Internaute.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    return internaute ? InternauteMapper.toDto(internaute) : null;
  }

  /**
   * Supprime un internaute
   * @param {string} id - Identifiant de l'internaute à supprimer
   * @returns {Promise<InternauteDto|null>} Internaute supprimé converti en DTO ou null si non trouvé
   */
  async deleteInternaute(id) {
    const internaute = await Internaute.findByIdAndDelete(id);
    return internaute ? InternauteMapper.toDto(internaute) : null;
  }
}

module.exports = new InternauteService();