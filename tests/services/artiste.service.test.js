const ArtisteService = require('../../src/services/artiste.service');
const Artiste = require('../../src/models/artiste.model');
const Film = require('../../src/models/film.model');
const Role = require('../../src/models/role.model');
const Pays = require('../../src/models/pays.model');
const mongoose = require('mongoose');

describe('ArtisteService', () => {
  let pays;

  beforeEach(async () => {
    // Créer un pays pour les films
    pays = await Pays.create({
      code: 'FR',
      nom: 'France',
      langue: 'Français'
    });
  });

  describe('getAllArtistes', () => {
    beforeEach(async () => {
      await Artiste.create([
        { nom: 'Martin', prenom: 'Pierre', anneeNaissance: 1975 },
        { nom: 'Durand', prenom: 'Marie', anneeNaissance: 1985 },
        { nom: 'Bernard', prenom: 'Luc', anneeNaissance: 1970 }
      ]);
    });

    it('devrait retourner tous les artistes triés par nom et prénom', async () => {
      // Act
      const result = await ArtisteService.getAllArtistes(1, 10);

      // Assert
      expect(result.artistes).toHaveLength(3);
      expect(result.artistes[0].nom).toBe('Bernard');
      expect(result.artistes[1].nom).toBe('Durand');
      expect(result.artistes[2].nom).toBe('Martin');
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(1);
    });

    it('devrait appliquer la pagination correctement', async () => {
      // Act
      const result = await ArtisteService.getAllArtistes(1, 2);

      // Assert
      expect(result.artistes).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.pages).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('devrait filtrer par nom', async () => {
      
      const filters = { nom: /Martin/i };

      // Act
      const result = await ArtisteService.getAllArtistes(1, 10, filters);

      // Assert
      expect(result.artistes).toHaveLength(1);
      expect(result.artistes[0].nom).toBe('Martin');
    });

    it('devrait retourner un tableau vide si aucun artiste', async () => {
      await Artiste.deleteMany({});

      // Act
      const result = await ArtisteService.getAllArtistes(1, 10);

      // Assert
      expect(result.artistes).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('getArtisteById', () => {
    let artiste, film, role;

    beforeEach(async () => {
      artiste = await Artiste.create({
        nom: 'Spielberg',
        prenom: 'Steven',
        anneeNaissance: 1946
      });

      film = await Film.create({
        titre: 'Film Test',
        annee: 2020,
        genre: 'Action',
        resume: 'Un film de test',
        document_chemin: '/path/to/film.mp4',
        realisateur: artiste._id,
        pays: pays._id
      });

      role = await Role.create({
        libelle: 'Acteur principal',
        artiste: artiste._id,
        film: film._id
      });
    });

    it('devrait retourner un artiste avec sa filmographie', async () => {
      // Act
      const result = await ArtisteService.getArtisteById(artiste._id);

      // Assert
      expect(result).toBeTruthy();
      expect(result.artiste.nom).toBe('Spielberg');
      expect(result.artiste.prenom).toBe('Steven');
      
      // Vérifier la filmographie
      expect(result.filmographie.realisateur).toHaveLength(1);
      expect(result.filmographie.realisateur[0].titre).toBe('Film Test');
      
      expect(result.filmographie.roles).toHaveLength(1);
      expect(result.filmographie.roles[0].libelle).toBe('Acteur principal');
    });

    it('devrait retourner null pour un artiste inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const result = await ArtisteService.getArtisteById(fakeId);

      // Assert
      expect(result).toBeNull();
    });

    it('devrait retourner un artiste sans filmographie', async () => {
      
      const newArtiste = await Artiste.create({
        nom: 'Nouveau',
        prenom: 'Artiste',
        anneeNaissance: 1990
      });

      // Act
      const result = await ArtisteService.getArtisteById(newArtiste._id);

      // Assert
      expect(result).toBeTruthy();
      expect(result.artiste.nom).toBe('Nouveau');
      expect(result.filmographie.realisateur).toEqual([]);
      expect(result.filmographie.roles).toEqual([]);
    });
  });
  
});
