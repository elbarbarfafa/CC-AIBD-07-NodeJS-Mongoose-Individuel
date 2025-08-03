class InternauteDto {
    static toDto(internaute) {
        return {
            id: internaute._id,
            email: internaute.email,
            nom: internaute.nom,
            prenom: internaute.prenom,
            anneeNaissance: internaute.anneeNaissance,
            createdAt: internaute.createdAt
        };
    }
}

module.exports = InternauteDto;
