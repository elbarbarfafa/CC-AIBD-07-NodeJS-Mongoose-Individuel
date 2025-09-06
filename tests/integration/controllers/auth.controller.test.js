const request = require('supertest');
const express = require('express');
const authRoutes = require('../../../src/routes/auth.routes');
const Internaute = require('../../../src/models/internaute.model');
const jwt = require('jsonwebtoken');

// Mock JWT pour éviter les dépendances externes
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller Integration Tests', () => {
  beforeEach(() => {
    // Mock du token JWT
    jwt.sign.mockReturnValue('fake-jwt-token');
    jwt.verify.mockReturnValue({ id: 'user123' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('devrait inscrire un nouvel utilisateur', async () => {
      
      const userData = {
        email: 'test@example.com',
        nom: 'Test',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1990
      };

      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('Internaute créé avec succès');
      expect(response.body.token).toBe('fake-jwt-token');
      expect(response.body.internaute.email).toBe('test@example.com');
      expect(response.body.internaute).not.toHaveProperty('motDePasse');

      // Vérifier en base
      const userInDb = await Internaute.findOne({ email: 'test@example.com' });
      expect(userInDb).toBeTruthy();
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      await Internaute.create({
        email: 'existing@example.com',
        nom: 'Existing',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1985
      });

      const userData = {
        email: 'existing@example.com',
        nom: 'New',
        prenom: 'User',
        motDePasse: 'password456',
        anneeNaissance: 1990
      };

      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Cet email est déjà utilisé');
    });

    it('devrait rejeter des données invalides', async () => {
      
      const userData = {
        email: 'invalid-email',
        nom: '', // Vide
        motDePasse: '123' // Trop court
      };

      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de login
      await Internaute.create({
        email: 'login@test.com',
        nom: 'Login',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1990
      });
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      
      const credentials = {
        email: 'login@test.com',
        motDePasse: 'password123'
      };

      
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.message).toBe('Connexion réussie');
      expect(response.body.token).toBe('fake-jwt-token');
      expect(response.body.internaute.email).toBe('login@test.com');
      expect(response.body.internaute).not.toHaveProperty('motDePasse');
    });

    it('devrait rejeter des identifiants invalides', async () => {
      
      const credentials = {
        email: 'login@test.com',
        motDePasse: 'wrongpassword'
      };

      
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.error).toBe('Identifiants invalides');
    });

    it('devrait rejeter un email inexistant', async () => {
      
      const credentials = {
        email: 'nonexistent@test.com',
        motDePasse: 'password123'
      };

      
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.error).toBe('Identifiants invalides');
    });

    it('devrait rejeter des données de validation invalides', async () => {
      
      const credentials = {
        email: 'invalid-email',
        motDePasse: '' // Vide
      };

      
      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });
});
