const AuthService = require('../../src/services/auth.service');
const Internaute = require('../../src/models/internaute.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock JWT pour éviter les dépendances externes
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  describe('register', () => {
    beforeEach(() => {
      // Mock du token JWT
      jwt.sign.mockReturnValue('fake-jwt-token');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('devrait inscrire un nouvel utilisateur', async () => {
      
      const userData = {
        email: 'newuser@test.com',
        nom: 'Nouveau',
        prenom: 'Utilisateur',
        motDePasse: 'password123',
        anneeNaissance: 1990
      };

      // Act
      const result = await AuthService.register(userData);

      // Assert
      expect(result.token).toBe('fake-jwt-token');
      expect(result.internaute.email).toBe('newuser@test.com');
      expect(result.internaute.nom).toBe('Nouveau');
      expect(result.internaute.prenom).toBe('Utilisateur');
      expect(result.internaute).not.toHaveProperty('motDePasse');

      // Vérifier que l'utilisateur a bien été créé en base
      const userInDb = await Internaute.findOne({ email: 'newuser@test.com' });
      expect(userInDb).toBeTruthy();
      expect(userInDb.nom).toBe('Nouveau');
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      await Internaute.create({
        email: 'existing@test.com',
        nom: 'Existing',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1985
      });

      const userData = {
        email: 'existing@test.com',
        nom: 'Nouveau',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1990
      };

      
      await expect(AuthService.register(userData))
        .rejects.toThrow('Cet email est déjà utilisé');
    });

    it('devrait hacher le mot de passe', async () => {
      
      const userData = {
        email: 'hashtest@test.com',
        nom: 'Hash',
        prenom: 'Test',
        motDePasse: 'plainpassword',
        anneeNaissance: 1990
      };

      // Act
      await AuthService.register(userData);

      // Assert
      const userInDb = await Internaute.findOne({ email: 'hashtest@test.com' });
      expect(userInDb.motDePasse).not.toBe('plainpassword');
      
      // Vérifier que le mot de passe peut être validé
      const isValid = await bcrypt.compare('plainpassword', userInDb.motDePasse);
      expect(isValid).toBe(true);
    });

    it('devrait rejeter des données invalides', async () => {
      
      const userData = {
        email: 'invalid-email',
        nom: '',
        prenom: 'Test',
        motDePasse: '123',
        anneeNaissance: 1990
      };

      
      await expect(AuthService.register(userData))
        .rejects.toThrow();
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de login
      await Internaute.create({
        email: 'logintest@test.com',
        nom: 'Login',
        prenom: 'Test',
        motDePasse: 'password123',
        anneeNaissance: 1990
      });

      jwt.sign.mockReturnValue('fake-login-token');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      // Act
      const result = await AuthService.login('logintest@test.com', 'password123');

      // Assert
      expect(result.token).toBe('fake-login-token');
      expect(result.internaute.email).toBe('logintest@test.com');
      expect(result.internaute.nom).toBe('Login');
      expect(result.internaute).not.toHaveProperty('motDePasse');
    });

    it('devrait rejeter un email inexistant', async () => {
      
      await expect(AuthService.login('nonexistent@test.com', 'password123'))
        .rejects.toThrow('Identifiants invalides');
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      
      await expect(AuthService.login('logintest@test.com', 'wrongpassword'))
        .rejects.toThrow('Identifiants invalides');
    });
  });

  describe('generateToken', () => {
    it('devrait appeler jwt.sign avec les bons paramètres', () => {
      
      const userId = 'user123';
      jwt.sign.mockReturnValue('generated-token');

      // Act
      const result = AuthService.generateToken(userId);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(result).toBe('generated-token');
    });
  });
});
