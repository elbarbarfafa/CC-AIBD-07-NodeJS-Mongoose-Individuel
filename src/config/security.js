// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Liste des domaines autorisés
    const allowedOrigins = [
      "http://localhost",
      "http://localhost:3000", // Pour le développement
    ];

    // Autoriser les requêtes sans origin (ex: Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true, // Autoriser les cookies
  methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  maxAge: 86400, // Cache preflight 24h
};

module.exports = corsOptions;