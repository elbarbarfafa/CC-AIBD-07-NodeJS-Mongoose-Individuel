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

  describe('createArtiste', () => {
    it('devrait créer un nouvel artiste', async () => {
      
      const artisteData = {
        nom: 'Dupont',
        prenom: 'Jean',
        anneeNaissance: 1980
      };

      // Act
      const result = await ArtisteService.createArtiste(artisteData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.nom).toBe('Dupont');
      expect(result.prenom).toBe('Jean');
      expect(result.anneeNaissance).toBe(1980);
      expect(result).toHaveProperty('id');

      // Vérifier en base
      const artisteInDb = await Artiste.findById(result.id);
      expect(artisteInDb).toBeTruthy();
      expect(artisteInDb.nom).toBe('Dupont');
    });

    it('devrait rejeter un artiste sans nom', async () => {
      
      const artisteData = {
        prenom: 'Jean',
        anneeNaissance: 1980
      };

      
      await expect(ArtisteService.createArtiste(artisteData))
        .rejects.toThrow();
    });

    it('devrait rejeter une année de naissance invalide', async () => {
      
      const artisteData = {
        nom: 'Dupont',
        prenom: 'Jean',
        anneeNaissance: 1800 // Trop ancienne
      };

      
      await expect(ArtisteService.createArtiste(artisteData))
        .rejects.toThrow();
    });

    it('devrait rejeter une année de naissance future', async () => {
      
      const artisteData = {
        nom: 'Dupont',
        prenom: 'Jean',
        anneeNaissance: 2030 // Dans le futur
      };

      
      await expect(ArtisteService.createArtiste(artisteData))
        .rejects.toThrow();
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

  describe('updateArtiste', () => {
    let artiste;

    beforeEach(async () => {
      artiste = await Artiste.create({
        nom: 'Original',
        prenom: 'Name',
        anneeNaissance: 1980
      });
    });

    it('devrait mettre à jour un artiste existant', async () => {
      
      const updateData = {
        nom: 'Updated',
        prenom: 'Name Updated'
      };

      // Act
      const result = await ArtisteService.updateArtiste(artiste._id, updateData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.nom).toBe('Updated');
      expect(result.prenom).toBe('Name Updated');
      expect(result.anneeNaissance).toBe(1980); // Inchangé

      // Vérifier en base
      const updatedInDb = await Artiste.findById(artiste._id);
      expect(updatedInDb.nom).toBe('Updated');
    });

    it('devrait retourner null pour un artiste inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = { nom: 'Test' };

      // Act
      const result = await ArtisteService.updateArtiste(fakeId, updateData);

      // Assert
      expect(result).toBeNull();
    });

    it('devrait valider les données lors de la mise à jour', async () => {
      
      const updateData = {
        anneeNaissance: 1800 // Invalide
      };

      
      await expect(ArtisteService.updateArtiste(artiste._id, updateData))
        .rejects.toThrow();
    });
  });

  describe('deleteArtiste', () => {
    let artiste;

    beforeEach(async () => {
      artiste = await Artiste.create({
        nom: 'ToDelete',
        prenom: 'Artist',
        anneeNaissance: 1980
      });
    });

    it('devrait supprimer un artiste existant', async () => {
      // Act
      const result = await ArtisteService.deleteArtiste(artiste._id);

      // Assert
      expect(result).toBeTruthy();
      expect(result._id.toString()).toBe(artiste._id.toString());

      // Vérifier que l'artiste n'existe plus
      const deletedArtiste = await Artiste.findById(artiste._id);
      expect(deletedArtiste).toBeNull();
    });

    it('devrait retourner null pour un artiste inexistant', async () => {
      
      const fakeId = new mongoose.Types.ObjectId();

      // Act
      const result = await ArtisteService.deleteArtiste(fakeId);

      // Assert
      expect(result).toBeNull();
    });
  });
});
