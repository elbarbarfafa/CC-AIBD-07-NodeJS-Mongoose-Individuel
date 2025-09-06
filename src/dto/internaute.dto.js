class InternauteDto {
    constructor(id, email, nom, prenom, anneeNaissance, createdAt) {
        this.id = id;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.anneeNaissance = anneeNaissance;
        this.createdAt = createdAt;
    }
}

module.exports = InternauteDto;
