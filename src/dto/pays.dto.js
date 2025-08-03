class PaysDto {
    static toDto(pays) {
        return {
            id: pays._id,
            code: pays.code,
            nom: pays.nom,
            langue: pays.langue
        };
    }
}

module.exports = PaysDto;
