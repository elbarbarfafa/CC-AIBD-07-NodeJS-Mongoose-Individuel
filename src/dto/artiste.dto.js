class ArtisteDto {
    id;
    nom;
    prenom;
    annee_naissance;

    constructor(id, nom, prenom, annee_naissance) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.annee_naissance = annee_naissance;
    }
}

module.exports = ArtisteDto;
