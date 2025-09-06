class InternauteDto {
    constructor(id, email, nom, prenom, annee_naissance, created_at) {
        this.id = id;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.annee_naissance = annee_naissance;
        this.created_at = created_at;
    }
}

module.exports = InternauteDto;
