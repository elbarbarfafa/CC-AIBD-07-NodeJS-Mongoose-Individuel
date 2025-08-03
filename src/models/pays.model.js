// models/Pays.js
const mongoose = require('mongoose');

const paysSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code pays est requis'],
    unique: true,
    uppercase: true,
    length: [2, 'Le code pays doit faire 2 caractères'],
    match: [/^[A-Z]{2}$/, 'Le code pays doit être composé de 2 lettres majuscules']
  },
  nom: {
    type: String,
    required: [true, 'Le nom du pays est requis'],
    trim: true
  },
  langue: {
    type: String,
    required: [true, 'La langue est requise'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pays', paysSchema);