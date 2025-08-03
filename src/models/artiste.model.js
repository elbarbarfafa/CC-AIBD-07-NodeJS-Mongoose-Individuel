const mongoose = require("mongoose");

const artisteSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    anneeNaissance: {
      type: Number,
      required: [true, "L'année de naissance est requise"],
      min: [1900, "Année de naissance invalide"],
      max: [new Date().getFullYear(), "Année de naissance invalide"],
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ]
  },
  {
    timestamps: true,
  }
);

// Index pour recherche
artisteSchema.index({ nom: 1, prenom: 1 });

module.exports = mongoose.model("Artiste", artisteSchema);
