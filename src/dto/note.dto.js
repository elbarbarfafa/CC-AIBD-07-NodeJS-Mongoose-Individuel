class NoteDto {
    constructor(id, note, commentaire, createdAt, internaute, film) {
        this.id = id;
        this.note = note;
        this.commentaire = commentaire;
        this.createdAt = createdAt;
        this.internaute = internaute;
        this.film = film;
    }
}

module.exports = NoteDto;
