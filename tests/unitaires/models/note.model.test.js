const Note = require('../../../src/models/note.model');
const Internaute = require('../../../src/models/internaute.model');
const Film = require('../../../src/models/film.model');
const Pays = require('../../../src/models/pays.model');
const mongoose = require('mongoose');

describe('Note Model', () => {
  let internaute, film, pays;

  beforeEach(async () => {
    // Créer des données de test
    pays = await Pays.create({
      code: 'FR',
      nom: 'France',
      langue: 'Français'
    });

    internaute = await Internaute.create({
      email: 'test@example.com',
      nom: 'Test',
      prenom: 'User',
      motDePasse: 'password123',
      anneeNaissance: 1990
    });

    film = await Film.create({
      titre: 'Film Test',
      annee: 2020,
      genre: 'Action',
      resume: 'Un film de test',
      document_chemin: '/path/to/film.mp4',
      pays: pays._id
    });
  });

  describe('Validation', () => {
    it('devrait créer une note valide', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 8,
        commentaire: 'Excellent film!'
      };

      // Act
      const note = new Note(noteData);
      await note.save();

      // Assert
      expect(note.internaute.toString()).toBe(internaute._id.toString());
      expect(note.film.toString()).toBe(film._id.toString());
      expect(note.note).toBe(8);
      expect(note.commentaire).toBe('Excellent film!');
      expect(note.createdAt).toBeDefined();
      expect(note.updatedAt).toBeDefined();
    });

    it('devrait accepter une note sans commentaire', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 7
      };

      // Act
      const note = new Note(noteData);
      await note.save();

      // Assert
      expect(note.note).toBe(7);
      expect(note.commentaire).toBeUndefined();
    });

    it('devrait rejeter une note sans internaute', async () => {
      
      const noteData = {
        film: film._id,
        note: 8
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/internaute.*requis/);
    });

    it('devrait rejeter une note sans film', async () => {
      
      const noteData = {
        internaute: internaute._id,
        note: 8
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/film.*requis/);
    });

    it('devrait rejeter une note sans valeur de note', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/note.*requise/);
    });

    it('devrait rejeter une note inférieure à 0', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: -1
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/note minimum/);
    });

    it('devrait rejeter une note supérieure à 10', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 11
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/note maximum/);
    });

    it('devrait accepter les notes limites 0 et 10', async () => {
      
      const noteData1 = {
        internaute: internaute._id,
        film: film._id,
        note: 0
      };

      const noteData2 = {
        internaute: internaute._id,
        film: film._id,
        note: 10
      };

      
      const note1 = new Note(noteData1);
      await expect(note1.save()).resolves.toBeTruthy();

      // Nettoyer avant le second test
      await Note.deleteMany({});

      const note2 = new Note(noteData2);
      await expect(note2.save()).resolves.toBeTruthy();
    });

    it('devrait rejeter un commentaire trop long', async () => {
      
      const longComment = 'x'.repeat(501); // Plus de 500 caractères
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 8,
        commentaire: longComment
      };

      
      const note = new Note(noteData);
      await expect(note.save()).rejects.toThrow(/500 caractères/);
    });

    it('devrait accepter un commentaire de 500 caractères exactement', async () => {
      
      const maxComment = 'x'.repeat(500);
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 8,
        commentaire: maxComment
      };

      // Act
      const note = new Note(noteData);
      await note.save();

      // Assert
      expect(note.commentaire.length).toBe(500);
    });
  });

  describe('Indexes', () => {
    it('devrait avoir un index unique sur internaute + film', async () => {
      
      const noteData = {
        internaute: internaute._id,
        film: film._id,
        note: 8
      };

      // Act - Créer la première note
      const note1 = new Note(noteData);
      await note1.save();

      // Assert - Tentative de créer une seconde note pour le même couple
      const note2 = new Note(noteData);
      await expect(note2.save()).rejects.toThrow(/duplicate key/);
    });

    it('devrait permettre à différents internautes de noter le même film', async () => {
      
      const internaute2 = await Internaute.create({
        email: 'test2@example.com',
        nom: 'Test2',
        prenom: 'User2',
        motDePasse: 'password123',
        anneeNaissance: 1995
      });

      const noteData1 = {
        internaute: internaute._id,
        film: film._id,
        note: 8
      };

      const noteData2 = {
        internaute: internaute2._id,
        film: film._id,
        note: 6
      };

      
      const note1 = new Note(noteData1);
      await expect(note1.save()).resolves.toBeTruthy();

      const note2 = new Note(noteData2);
      await expect(note2.save()).resolves.toBeTruthy();
    });

    it('devrait permettre au même internaute de noter différents films', async () => {
      
      const film2 = await Film.create({
        titre: 'Film Test 2',
        annee: 2021,
        genre: 'Comédie',
        resume: 'Un autre film de test',
        document_chemin: '/path/to/film2.mp4',
        pays: pays._id
      });

      const noteData1 = {
        internaute: internaute._id,
        film: film._id,
        note: 8
      };

      const noteData2 = {
        internaute: internaute._id,
        film: film2._id,
        note: 6
      };

      
      const note1 = new Note(noteData1);
      await expect(note1.save()).resolves.toBeTruthy();

      const note2 = new Note(noteData2);
      await expect(note2.save()).resolves.toBeTruthy();
    });
  });
});
