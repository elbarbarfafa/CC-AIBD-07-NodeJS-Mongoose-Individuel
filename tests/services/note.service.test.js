const NoteService = require('../../src/services/note.service');
const Note = require('../../src/models/note.model');
const Internaute = require('../../src/models/internaute.model');
const Film = require('../../src/models/film.model');
const Pays = require('../../src/models/pays.model');
const mongoose = require('mongoose');

describe('NoteService', () => {
  let internaute1, internaute2, film1, film2, pays;

  beforeEach(async () => {
    // Créer des données de test
    pays = await Pays.create({
      code: 'FR',
      nom: 'France',
      langue: 'Français'
    });

    internaute1 = await Internaute.create({
      email: 'user1@test.com',
      nom: 'Dupont',
      prenom: 'Jean',
      motDePasse: 'password123',
      anneeNaissance: 1990
    });

    internaute2 = await Internaute.create({
      email: 'user2@test.com',
      nom: 'Martin',
      prenom: 'Marie',
      motDePasse: 'password123',
      anneeNaissance: 1985
    });

    film1 = await Film.create({
      titre: 'Film Test 1',
      annee: 2020,
      genre: 'Action',
      resume: 'Un film d\'action passionnant avec des scènes spectaculaires',
      document_chemin: '/path/to/film1.mp4',
      pays: pays._id
    });

    film2 = await Film.create({
      titre: 'Film Test 2',
      annee: 2021,
      genre: 'Comédie',
      resume: 'Une comédie hilarante qui vous fera rire aux éclats',
      document_chemin: '/path/to/film2.mp4',
      pays: pays._id
    });
  });

  describe('createNote', () => {
    it('devrait créer une nouvelle note', async () => {
      
      const noteData = {
        film: film1._id,
        note: 8,
        commentaire: 'Excellent film!'
      };

      // Act
      const result = await NoteService.createNote(internaute1._id, noteData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.note).toBe(8);
      expect(result.commentaire).toBe('Excellent film!');
      expect(result.internaute.nom).toBe('Dupont');
      expect(result.film.titre).toBe('Film Test 1');

      // Vérifier en base
      const noteInDb = await Note.findById(result.id);
      expect(noteInDb).toBeTruthy();
    });

    it('devrait rejeter une note en double pour le même film', async () => {
      
      await Note.create({
        internaute: internaute1._id,
        film: film1._id,
        note: 7,
        commentaire: 'Première note'
      });

      const noteData = {
        film: film1._id,
        note: 8,
        commentaire: 'Deuxième note'
      };

      
      await expect(NoteService.createNote(internaute1._id, noteData))
        .rejects.toThrow('Vous avez déjà noté ce film');
    });

    it('devrait permettre à différents internautes de noter le même film', async () => {
      
      const noteData1 = {
        film: film1._id,
        note: 7,
        commentaire: 'Pas mal'
      };

      const noteData2 = {
        film: film1._id,
        note: 9,
        commentaire: 'Excellent'
      };

      // Act
      const result1 = await NoteService.createNote(internaute1._id, noteData1);
      const result2 = await NoteService.createNote(internaute2._id, noteData2);

      // Assert
      expect(result1.note).toBe(7);
      expect(result2.note).toBe(9);
      expect(result1.internaute.id).not.toBe(result2.internaute.id);
    });
  });

  describe('getAllNotes', () => {
    beforeEach(async () => {
      // Créer quelques notes de test
      await Note.create([
        {
          internaute: internaute1._id,
          film: film1._id,
          note: 8,
          commentaire: 'Super film'
        },
        {
          internaute: internaute2._id,
          film: film2._id,
          note: 6,
          commentaire: 'Moyen'
        },
        {
          internaute: internaute1._id,
          film: film2._id,
          note: 9,
          commentaire: 'Excellent'
        }
      ]);
    });

    it('devrait retourner toutes les notes avec pagination', async () => {
      // Act
      const result = await NoteService.getAllNotes(1, 10);

      // Assert
      expect(result.notes).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(1);
      expect(result.pagination.page).toBe(1);
    });

    it('devrait appliquer la pagination correctement', async () => {
      // Act
      const result = await NoteService.getAllNotes(1, 2);

      // Assert
      expect(result.notes).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('devrait filtrer par film', async () => {
      // Act
      const result = await NoteService.getAllNotes(1, 10, { film: film1._id });

      // Assert
      expect(result.notes).toHaveLength(1);
      expect(result.notes[0].film.titre).toBe('Film Test 1');
    });
  });

  describe('getInternauteNotes', () => {
    beforeEach(async () => {
      await Note.create([
        {
          internaute: internaute1._id,
          film: film1._id,
          note: 8,
          commentaire: 'Super film'
        },
        {
          internaute: internaute1._id,
          film: film2._id,
          note: 7,
          commentaire: 'Pas mal'
        },
        {
          internaute: internaute2._id,
          film: film1._id,
          note: 6,
          commentaire: 'Moyen'
        }
      ]);
    });

    it('devrait retourner toutes les notes d\'un internaute', async () => {
      // Act
      const result = await NoteService.getInternauteNotes(internaute1._id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every(note => note.internaute.id.toString() === internaute1._id.toString())).toBe(true);
    });

    it('devrait retourner un tableau vide pour un internaute sans notes', async () => {
      
      const newInternaute = await Internaute.create({
        email: 'new@test.com',
        nom: 'Nouveau',
        prenom: 'User',
        motDePasse: 'password123',
        anneeNaissance: 1995
      });

      // Act
      const result = await NoteService.getInternauteNotes(newInternaute._id);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getFilmNotes', () => {
    beforeEach(async () => {
      await Note.create([
        {
          internaute: internaute1._id,
          film: film1._id,
          note: 8,
          commentaire: 'Super film'
        },
        {
          internaute: internaute2._id,
          film: film1._id,
          note: 6,
          commentaire: 'Moyen'
        }
      ]);
    });

    it('devrait retourner les notes d\'un film avec la moyenne', async () => {
      // Act
      const result = await NoteService.getFilmNotes(film1._id);

      // Assert
      expect(result.notes).toHaveLength(2);
      expect(result.moyenneNote).toBe(7); // (8 + 6) / 2 = 7
      expect(result.nombreNotes).toBe(2);
    });

    it('devrait retourner null pour la moyenne d\'un film sans notes', async () => {
      // Act
      const result = await NoteService.getFilmNotes(film2._id);

      // Assert
      expect(result.notes).toEqual([]);
      expect(result.moyenneNote).toBeNull();
      expect(result.nombreNotes).toBe(0);
    });
  });

  describe('updateNote', () => {
    let note;

    beforeEach(async () => {
      note = await Note.create({
        internaute: internaute1._id,
        film: film1._id,
        note: 7,
        commentaire: 'Original comment'
      });
    });

    it('devrait mettre à jour une note existante', async () => {
      
      const updateData = {
        note: 9,
        commentaire: 'Updated comment'
      };

      // Act
      const result = await NoteService.updateNote(note._id, internaute1._id.toString(), updateData);

      // Assert
      expect(result.note).toBe(9);
      expect(result.commentaire).toBe('Updated comment');
    });

    it('devrait rejeter la mise à jour par un autre internaute', async () => {
      
      const updateData = { note: 9 };

      
      await expect(NoteService.updateNote(note._id, internaute2._id.toString(), updateData))
        .rejects.toThrow('Accès refusé');
    });

    it('devrait rejeter la mise à jour d\'une note inexistante', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { note: 9 };

      
      await expect(NoteService.updateNote(fakeId, internaute1._id.toString(), updateData))
        .rejects.toThrow('Note non trouvée');
    });
  });

  describe('deleteNote', () => {
    let note;

    beforeEach(async () => {
      note = await Note.create({
        internaute: internaute1._id,
        film: film1._id,
        note: 7,
        commentaire: 'À supprimer'
      });
    });

    it('devrait supprimer une note existante', async () => {
      // Act
      const result = await NoteService.deleteNote(note._id, internaute1._id.toString());

      // Assert
      expect(result).toBeTruthy();

      // Vérifier que la note n'existe plus
      const deletedNote = await Note.findById(note._id);
      expect(deletedNote).toBeNull();
    });

    it('devrait rejeter la suppression par un autre internaute', async () => {
      
      await expect(NoteService.deleteNote(note._id, internaute2._id.toString()))
        .rejects.toThrow('Accès refusé');
    });

    it('devrait rejeter la suppression d\'une note inexistante', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();

      
      await expect(NoteService.deleteNote(fakeId, internaute1._id.toString()))
        .rejects.toThrow('Note non trouvée');
    });
  });
});
