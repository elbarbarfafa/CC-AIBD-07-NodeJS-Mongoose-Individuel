// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  internaute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internaute',
    required: [true, 'L\'internaute est requis']
  },
  film: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
    required: [true, 'Le film est requis']
  },
  note: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [0, 'La note minimum est 0'],
    max: [10, 'La note maximum est 10']
  },
  commentaire: {
    type: String,
    maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Index unique pour éviter qu'un internaute note plusieurs fois le même film
noteSchema.index({ internaute: 1, film: 1 }, { unique: true });