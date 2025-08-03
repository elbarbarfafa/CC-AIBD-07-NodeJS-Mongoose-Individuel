class ArtisteDto {
    static toDto(artiste) {
        return {
            id: artiste._id,
            nom: artiste.nom,
            prenom: artiste.prenom,
            anneeNaissance: artiste.anneeNaissance
        };
    }
}

module.exports = ArtisteDto;
