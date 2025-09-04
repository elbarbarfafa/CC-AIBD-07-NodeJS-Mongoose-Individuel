const { auth } = require('../../src/middlewares/auth.middleware');
const jwt = require('jsonwebtoken');
const Internaute = require('../../src/models/internaute.model');

// Mock des dépendances
jest.mock('jsonwebtoken');
jest.mock('../../src/models/internaute.model');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();

    // Reset des mocks
    jest.clearAllMocks();
  });

  it('devrait passer au middleware suivant avec un token valide', async () => {
    
    const userId = 'user123';
    const user = { _id: userId, actif: true, nom: 'Test', email: 'test@test.com' };
    
    req.header.mockReturnValue('Bearer valid-token');
    jwt.verify.mockReturnValue({ id: userId });
    Internaute.findById.mockResolvedValue(user);

    // Act
    await auth(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(Internaute.findById).toHaveBeenCalledWith(userId);
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('devrait rejeter une requête sans header Authorization', async () => {
    
    req.header.mockReturnValue(undefined);

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès refusé. Token manquant.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait rejeter une requête avec un header Authorization vide', async () => {
    
    req.header.mockReturnValue('');

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès refusé. Token manquant.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait extraire correctement le token du header Bearer', async () => {
    
    const userId = 'user123';
    const user = { _id: userId, actif: true };
    
    req.header.mockReturnValue('Bearer my-jwt-token');
    jwt.verify.mockReturnValue({ id: userId });
    Internaute.findById.mockResolvedValue(user);

    // Act
    await auth(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('my-jwt-token', process.env.JWT_SECRET);
  });

  it('devrait rejeter un token invalide', async () => {
    
    req.header.mockReturnValue('Bearer invalid-token');
    jwt.verify.mockImplementation(() => {
      throw new Error('Token invalide');
    });

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait rejeter un token pour un utilisateur inexistant', async () => {
    
    req.header.mockReturnValue('Bearer valid-token');
    jwt.verify.mockReturnValue({ id: 'nonexistent-user' });
    Internaute.findById.mockResolvedValue(null);

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou utilisateur inactif.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait rejeter un token pour un utilisateur inactif', async () => {
    
    const userId = 'user123';
    const user = { _id: userId, actif: false }; // Utilisateur inactif
    
    req.header.mockReturnValue('Bearer valid-token');
    jwt.verify.mockReturnValue({ id: userId });
    Internaute.findById.mockResolvedValue(user);

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide ou utilisateur inactif.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('devrait gérer les erreurs de base de données', async () => {
    
    req.header.mockReturnValue('Bearer valid-token');
    jwt.verify.mockReturnValue({ id: 'user123' });
    Internaute.findById.mockRejectedValue(new Error('Database error'));

    // Act
    await auth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide.' });
    expect(next).not.toHaveBeenCalled();
  });
});
