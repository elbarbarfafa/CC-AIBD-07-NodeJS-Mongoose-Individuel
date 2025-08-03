class NoteDto {
    static toDto(note) {
        return {
            id: note._id,
            note: note.note,
            commentaire: note.commentaire,
            createdAt: note.createdAt,
            internaute: note.internaute ? {
                id: note.internaute._id,
                nom: note.internaute.nom,
                prenom: note.internaute.prenom
            } : null,
            film: note.film ? {
                id: note.film._id,
                titre: note.film.titre,
                annee: note.film.annee
            } : null
        };
    }
}

module.exports = NoteDto;
