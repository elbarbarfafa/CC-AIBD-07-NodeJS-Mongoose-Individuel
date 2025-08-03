// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');


const dotenv = require('dotenv');

// Logging
const logger = require('./config/logger');

// Routes
const authRoutes = require('./routes/auth.routes');
const internauteRoutes = require('./routes/internautes.routes');
const artisteRoutes = require('./routes/artistes.routes');
const FilmRouter = require('./routes/films.routes');
const paysRoutes = require('./routes/pays.routes');
const noteRoutes = require('./routes/notes.routes');
const apiDocRoutes = require('./routes/api.doc.routes');

// Importation des middlewares
const errorHandler = require('./middlewares/errorHandler');
const { auth } = require('./middlewares/auth');

// Sécurité
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const corsOptions = require('./config/security');
const csrfProtection = require('./middlewares/csrf.middleware'); // Protection CSRF

dotenv.config();

// Création de l'application Express
const app = express();

// Middleware global
app.use(helmet()) // Protection contre les attaques courantes
app.use(cors(corsOptions)); // cors activé
app.use(express.json()); // parseur JSON
app.use(express.urlencoded({ extended: true })); // Parseur URL-encoded
app.use(cookieParser()); // Parseur de cookies
app.use(xss()); // Protection contre les attaques XSS

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('✅ Connecté à MongoDB'))
  .catch(err => logger.error('❌ Erreur MongoDB:', err));

// Routes avec sécurisation de l'accès
app.use('/api/auth', authRoutes);
app.use('/api/internautes', auth, internauteRoutes);
app.use('/api/artistes', auth, artisteRoutes);
app.use('/api/films', auth, FilmRouter);
app.use('/api/pays', auth, paysRoutes);
app.use('/api/notes', auth, noteRoutes);
app.use('/api/docs', apiDocRoutes); // Swagger UI

app.use('/api/**', csrfProtection);

// Route pour obtenir le token CSRF
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API - Express.js avec MongoDB', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      internautes: '/api/internautes',
      artistes: '/api/artistes',
      films: '/api/films',
      pays: '/api/pays',
      notes: '/api/notes'
    }
  });
});

// Middleware de gestion d'erreurs centralisé
app.use(errorHandler);

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
