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

});
