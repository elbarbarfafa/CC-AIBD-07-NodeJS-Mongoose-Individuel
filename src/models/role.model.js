const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    libelle: {
        type: String,
        required: true,
        trim: true
    },
    artiste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artiste',
        required: true
    },
    film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;