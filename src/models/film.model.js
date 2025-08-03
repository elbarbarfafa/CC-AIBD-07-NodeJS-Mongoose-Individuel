const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
    },
    annee: {
      type: Number,
      required: [true, "L'année est requise"],
      min: [1895, "Première année du cinéma"],
      max: [new Date().getFullYear() + 5, "Année trop éloignée dans le futur"],
    },
    genre: {
      type: String,
      required: [true, "Le genre est requis"],
      enum: [
        "Action",
        "Aventure",
        "Comédie",
        "Drame",
        "Fantastique",
        "Horreur",
        "Romance",
        "Science-fiction",
        "Thriller",
        "Documentaire",
        "Animation",
        "Autre",
      ],
    },
    resume: {
      type: String,
      required: [true, "Le résumé est requis"],
      maxlength: [1000, "Le résumé ne peut pas dépasser 1000 caractères"],
    },
    document_chemin: {
      type: String,
      required: [true, "Le chemin du document est requis"],
      trim: true
    },
    // Relations
    realisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artiste",
      default: null,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    pays: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pays",
      required: [true, "Le pays d'origine est requis"],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour recherche
filmSchema.index({ titre: 1, annee: 1 });
filmSchema.index({ genre: 1 });
filmSchema.index({ pays: 1 });

module.exports = mongoose.model("Film", filmSchema);
