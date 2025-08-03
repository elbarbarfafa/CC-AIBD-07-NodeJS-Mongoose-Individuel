class FilmDto {
    static toDto(film) {
        return {
            id: film._id,
            titre: film.titre,
            annee: film.annee,
            genre: film.genre,
            resume: film.resume,
            realisateur: film.realisateur ? {
                id: film.realisateur._id,
                nom: film.realisateur.nom,
                prenom: film.realisateur.prenom,
                anneeNaissance: film.realisateur.anneeNaissance
            } : null,
            roles: film.roles?.map(role => ({
                id: role._id,
                personnage: role.personnage,
                artiste: {
                    id: role.artiste._id,
                    nom: role.artiste.nom,
                    prenom: role.artiste.prenom,
                    anneeNaissance: role.artiste.anneeNaissance
                }
            })) || [],
            pays: film.pays ? {
                code: film.pays.code,
                nom: film.pays.nom,
                langue: film.pays.langue
            } : null,
            document_chemin: film.document_chemin
        };
    }
}

module.exports = FilmDto;
