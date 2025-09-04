const PaysService = require('../../src/services/pays.service');
const Pays = require('../../src/models/pays.model');
const Film = require('../../src/models/film.model');

describe('PaysService', () => {
  describe('getAllPays', () => {
    it('devrait retourner tous les pays triés par nom', async () => {
      
      await Pays.create([
        { code: 'FR', nom: 'France', langue: 'Français' },
        { code: 'US', nom: 'États-Unis', langue: 'Anglais' },
        { code: 'DE', nom: 'Allemagne', langue: 'Allemand' }
      ]);

      // Act
      const result = await PaysService.getAllPays();

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].nom).toBe('Allemagne');
      expect(result[1].nom).toBe('France');
      expect(result[2].nom).toBe('États-Unis');
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('code', 'DE');
    });

    it('devrait retourner un tableau vide si aucun pays existe', async () => {
      // Act
      const result = await PaysService.getAllPays();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('createPays', () => {
    it('devrait créer un nouveau pays', async () => {
      
      const paysData = {
        code: 'IT',
        nom: 'Italie',
        langue: 'Italien'
      };

      // Act
      const result = await PaysService.createPays(paysData);

      // Assert
      expect(result.code).toBe('IT');
      expect(result.nom).toBe('Italie');
      expect(result.langue).toBe('Italien');
      expect(result).toHaveProperty('id');
      
      // Vérifier en base de données
      const paysInDb = await Pays.findOne({ code: 'IT' });
      expect(paysInDb).toBeTruthy();
      expect(paysInDb.nom).toBe('Italie');
    });

    it('devrait rejeter un pays avec un code invalide', async () => {
      
      const paysData = {
        code: 'INVALID',
        nom: 'Test',
        langue: 'Test'
      };

      
      await expect(PaysService.createPays(paysData))
        .rejects.toThrow();
    });

    it('devrait rejeter un pays sans données requises', async () => {
      
      const paysData = {
        code: 'FR'
        // nom et langue manquants
      };

      
      await expect(PaysService.createPays(paysData))
        .rejects.toThrow();
    });
  });

  describe('updatePays', () => {
    it('devrait mettre à jour un pays existant', async () => {
      
      await Pays.create({ code: 'ES', nom: 'Espagne', langue: 'Espagnol' });

      // Act
      const result = await PaysService.updatePays('ES', { nom: 'España' });

      // Assert
      expect(result).toBeTruthy();
      expect(result.nom).toBe('España');
      expect(result.code).toBe('ES');
      expect(result.langue).toBe('Espagnol');
    });

    it('devrait retourner null pour un pays inexistant', async () => {
      // Act
      const result = await PaysService.updatePays('XX', { nom: 'Test' });

      // Assert
      expect(result).toBeNull();
    });

    it('devrait fonctionner avec un code en minuscules', async () => {
      
      await Pays.create({ code: 'PT', nom: 'Portugal', langue: 'Portugais' });

      // Act
      const result = await PaysService.updatePays('pt', { nom: 'República Portuguesa' });

      // Assert
      expect(result).toBeTruthy();
      expect(result.nom).toBe('República Portuguesa');
    });
  });

  describe('deletePays', () => {
    it('devrait supprimer un pays existant', async () => {
      
      const pays = await Pays.create({ code: 'BR', nom: 'Brésil', langue: 'Portugais' });

      // Act
      const result = await PaysService.deletePays('BR');

      // Assert
      expect(result).toBeTruthy();
      expect(result._id.toString()).toBe(pays._id.toString());

      // Vérifier que le pays n'existe plus
      const paysInDb = await Pays.findOne({ code: 'BR' });
      expect(paysInDb).toBeNull();
    });

    it('devrait retourner null pour un pays inexistant', async () => {
      // Act
      const result = await PaysService.deletePays('XX');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getPaysWithFilms', () => {
    it('devrait retourner null pour un pays inexistant', async () => {
      // Act
      const result = await PaysService.getPaysWithFilms('XX');

      // Assert
      expect(result).toBeNull();
    });

    it('devrait retourner un pays sans films', async () => {
      
      await Pays.create({ code: 'NO', nom: 'Norvège', langue: 'Norvégien' });

      // Act
      const result = await PaysService.getPaysWithFilms('NO');

      // Assert
      expect(result).toBeTruthy();
      expect(result.pays.nom).toBe('Norvège');
      expect(result.films).toEqual([]);
    });
  });
});
