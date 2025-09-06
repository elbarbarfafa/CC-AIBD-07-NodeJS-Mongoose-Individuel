class NoteDto {
    constructor(id, note, commentaire, created_at, internaute, film) {
        this.id = id;
        this.note = note;
        this.commentaire = commentaire;
        this.created_at = created_at;
        this.internaute = internaute;
        this.film = film;
    }
}

module.exports = NoteDto;
