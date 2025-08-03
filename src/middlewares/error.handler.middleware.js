const logger = require('../config/logger');

// centralise les erreurs de l'application
// et les formate avant de les envoyer au client
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Erreur de duplication MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} déjà existant`;
    error = { message, statusCode: 400 };
  }

  // Erreur ObjectId invalide
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = { message, statusCode: 404 };
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Erreur serveur'
  });
};

module.exports = errorHandler;