const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const internauteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  anneeNaissance: {
    type: Number,
    required: [true, 'L\'année de naissance est requise'],
    min: [1900, 'Année de naissance invalide'],
    max: [new Date().getFullYear(), 'Année de naissance invalide']
  }
}, {
  timestamps: true
});

// Hachage du mot de passe avant sauvegarde
internauteSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
internauteSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.motDePasse);
};

// Méthode pour obtenir les données publiques
internauteSchema.methods.toJSON = function() {
  const internauteObject = this.toObject();
  delete internauteObject.motDePasse;
  return internauteObject;
};

module.exports = mongoose.model('Internaute', internauteSchema);