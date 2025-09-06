class FilmDto {
    constructor(id, titre, annee, genre, resume, realisateur, roles, pays, document_chemin) {
        this.id = id;
        this.titre = titre;
        this.annee = annee;
        this.genre = genre;
        this.resume = resume;
        this.realisateur = realisateur;
        this.roles = roles || [];
        this.pays = pays;
        this.document_chemin = document_chemin;
    }
}

module.exports = FilmDto;
