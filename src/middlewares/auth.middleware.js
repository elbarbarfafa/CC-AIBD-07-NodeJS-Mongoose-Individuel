const jwt = require('jsonwebtoken');
const User = require('../models/internaute.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // Récupération de l'utilisateur par l'ID du token
    
    if (!user?.actif) {
      return res.status(401).json({ error: 'Token invalide ou utilisateur inactif.' });
    }

    req.user = user; // On ajoute l'utilisateur à la requête
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide.' });
  }
};

module.exports = { auth };