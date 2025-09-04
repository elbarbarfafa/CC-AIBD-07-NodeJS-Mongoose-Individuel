const FilmService = require('../../src/services/film.service');
const Film = require('../../src/models/film.model');
const Artiste = require('../../src/models/artiste.model');
const Pays = require('../../src/models/pays.model');
const mongoose = require('mongoose');

describe('FilmService', () => {
  let pays, realisateur;

  beforeEach(async () => {
    // Créer des données de base
    pays = await Pays.create({
      code: 'US',
      nom: 'États-Unis',
      langue: 'Anglais'
    });

    realisateur = await Artiste.create({
      nom: 'Nolan',
      prenom: 'Christopher',
      anneeNaissance: 1970
    });
  });

  describe('createFilm', () => {
    it('devrait créer un nouveau film', async () => {
      
      const filmData = {
        titre: 'Inception',
        annee: 2010,
        genre: 'Science-fiction',
        resume: 'Un thriller de science-fiction captivant',
        document_chemin: '/path/to/inception.mp4',
        realisateur: realisateur._id,
        pays: pays._id
      };

      // Act
      const result = await FilmService.createFilm(filmData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.titre).toBe('Inception');
      expect(result.annee).toBe(2010);
      expect(result.genre).toBe('Science-fiction');
      expect(result).toHaveProperty('id');

      // Vérifier en base
      const filmInDb = await Film.findById(result.id);
      expect(filmInDb).toBeTruthy();
      expect(filmInDb.titre).toBe('Inception');
    });

    it('devrait rejeter un film sans titre', async () => {
      
      const filmData = {
        annee: 2010,
        genre: 'Action',
        resume: 'Un film sans titre',
        document_chemin: '/path/to/film.mp4',
        pays: pays._id
      };

      
      await expect(FilmService.createFilm(filmData))
        .rejects.toThrow();
    });

    it('devrait rejeter un film avec une année invalide', async () => {
      
      const filmData = {
        titre: 'Film Ancien',
        annee: 1800, // Trop ancienne
        genre: 'Drame',
        resume: 'Un film très ancien',
        document_chemin: '/path/to/film.mp4',
        pays: pays._id
      };

      
      await expect(FilmService.createFilm(filmData))
        .rejects.toThrow();
    });

    it('devrait rejeter un film avec un genre invalide', async () => {
      
      const filmData = {
        titre: 'Film Genre Invalide',
        annee: 2020,
        genre: 'GenreInexistant', // Pas dans l'enum
        resume: 'Un film avec un genre invalide',
        document_chemin: '/path/to/film.mp4',
        pays: pays._id
      };

      
      await expect(FilmService.createFilm(filmData))
        .rejects.toThrow();
    });
  });

  describe('getAllFilms', () => {
    beforeEach(async () => {
      await Film.create([
        {
          titre: 'Film 2023',
          annee: 2023,
          genre: 'Action',
          resume: 'Film récent',
          document_chemin: '/path/to/film2023.mp4',
          pays: pays._id
        },
        {
          titre: 'Film 2020',
          annee: 2020,
          genre: 'Comédie',
          resume: 'Film plus ancien',
          document_chemin: '/path/to/film2020.mp4',
          pays: pays._id
        },
        {
          titre: 'Film 2021',
          annee: 2021,
          genre: 'Drame',
          resume: 'Film intermédiaire',
          document_chemin: '/path/to/film2021.mp4',
          pays: pays._id
        }
      ]);
    });

    it('devrait retourner tous les films triés par année décroissante', async () => {
      // Act
      const result = await FilmService.getAllFilms(1, 10);

      // Assert
      expect(result.films).toHaveLength(3);
      expect(result.films[0].annee).toBe(2023); // Plus récent en premier
      expect(result.films[1].annee).toBe(2021);
      expect(result.films[2].annee).toBe(2020);
      expect(result.pagination.total).toBe(3);
    });

    it('devrait appliquer la pagination', async () => {
      // Act
      const result = await FilmService.getAllFilms(1, 2);

      // Assert
      expect(result.films).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(2);
    });

    it('devrait filtrer les films', async () => {
      
      const filters = { genre: 'Action' };

      // Act
      const result = await FilmService.getAllFilms(1, 10, filters);

      // Assert
      expect(result.films).toHaveLength(1);
      expect(result.films[0].genre).toBe('Action');
    });
  });

  describe('getFilmById', () => {
    let film;

    beforeEach(async () => {
      film = await Film.create({
        titre: 'Film Test Détail',
        annee: 2022,
        genre: 'Thriller',
        resume: 'Un thriller captivant',
        document_chemin: '/path/to/thriller.mp4',
        realisateur: realisateur._id,
        pays: pays._id
      });
    });

    it('devrait retourner un film avec tous ses détails', async () => {
      // Act
      const result = await FilmService.getFilmById(film._id);

      // Assert
      expect(result).toBeTruthy();
      expect(result.titre).toBe('Film Test Détail');
      expect(result.annee).toBe(2022);
      expect(result.genre).toBe('Thriller');
      
      // Vérifier les relations populées
      expect(result.realisateur).toBeTruthy();
      expect(result.realisateur.nom).toBe('Nolan');
      expect(result.pays).toBeTruthy();
      expect(result.pays.nom).toBe('États-Unis');
    });

    it('devrait retourner null pour un film inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const result = await FilmService.getFilmById(fakeId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateFilm', () => {
    let film;

    beforeEach(async () => {
      film = await Film.create({
        titre: 'Film Original',
        annee: 2020,
        genre: 'Action',
        resume: 'Résumé original',
        document_chemin: '/path/to/original.mp4',
        pays: pays._id
      });
    });

    it('devrait mettre à jour un film existant', async () => {
      
      const updateData = {
        titre: 'Film Modifié',
        genre: 'Comédie'
      };

      // Act
      const result = await FilmService.updateFilm(film._id, updateData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.titre).toBe('Film Modifié');
      expect(result.genre).toBe('Comédie');
      expect(result.annee).toBe(2020); // Inchangé

      // Vérifier en base
      const updatedInDb = await Film.findById(film._id);
      expect(updatedInDb.titre).toBe('Film Modifié');
    });

    it('devrait retourner null pour un film inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { titre: 'Test' };

      // Act
      const result = await FilmService.updateFilm(fakeId, updateData);

      // Assert
      expect(result).toBeNull();
    });

    it('devrait valider les données lors de la mise à jour', async () => {
      
      const updateData = {
        genre: 'GenreInvalide' // Pas dans l'enum
      };

      
      await expect(FilmService.updateFilm(film._id, updateData))
        .rejects.toThrow();
    });
  });

  describe('deleteFilm', () => {
    let film;

    beforeEach(async () => {
      film = await Film.create({
        titre: 'Film à Supprimer',
        annee: 2020,
        genre: 'Horreur',
        resume: 'Un film à supprimer',
        document_chemin: '/path/to/delete.mp4',
        pays: pays._id
      });
    });

    it('devrait supprimer un film existant', async () => {
      // Act
      const result = await FilmService.deleteFilm(film._id);

      // Assert
      expect(result).toBeTruthy();
      expect(result._id.toString()).toBe(film._id.toString());

      // Vérifier que le film n'existe plus
      const deletedFilm = await Film.findById(film._id);
      expect(deletedFilm).toBeNull();
    });

    it('devrait retourner null pour un film inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const result = await FilmService.deleteFilm(fakeId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
