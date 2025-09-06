const Pays = require('../../../src/models/pays.model');
const mongoose = require('mongoose');

describe('Pays Model', () => {
  describe('Validation', () => {
    it('devrait créer un pays valide', async () => {
      
      const paysData = {
        code: 'JP',
        nom: 'Japon',
        langue: 'Japonais'
      };

      // Act
      const pays = new Pays(paysData);
      await pays.save();

      // Assert
      expect(pays.code).toBe('JP');
      expect(pays.nom).toBe('Japon');
      expect(pays.langue).toBe('Japonais');
      expect(pays.createdAt).toBeDefined();
      expect(pays.updatedAt).toBeDefined();
    });

    it('devrait convertir le code en majuscules', async () => {
      
      const paysData = {
        code: 'ca',
        nom: 'Canada',
        langue: 'Anglais/Français'
      };

      // Act
      const pays = new Pays(paysData);
      await pays.save();

      // Assert
      expect(pays.code).toBe('CA');
    });

    it('devrait rejeter un code trop long', async () => {
      
      const paysData = {
        code: 'TOOLONG',
        nom: 'Test',
        langue: 'Test'
      };

      
      const pays = new Pays(paysData);
      await expect(pays.save()).rejects.toThrow();
    });

    it('devrait rejeter un code avec des chiffres', async () => {
      
      const paysData = {
        code: 'A1',
        nom: 'Test',
        langue: 'Test'
      };

      
      const pays = new Pays(paysData);
      await expect(pays.save()).rejects.toThrow();
    });

    it('devrait rejeter des champs manquants', async () => {
      
      const paysData = {
        code: 'FR'
        // nom et langue manquants
      };

      
      const pays = new Pays(paysData);
      await expect(pays.save()).rejects.toThrow();
    });

    it('devrait rejeter un code en double', async () => {
      
      await Pays.create({
        code: 'AU',
        nom: 'Australie',
        langue: 'Anglais'
      });

      const paysData = {
        code: 'AU',
        nom: 'Autriche',
        langue: 'Allemand'
      };

      
      const pays = new Pays(paysData);
      await expect(pays.save()).rejects.toThrow(/duplicate key|E11000/);
    });

    it('devrait supprimer les espaces en début et fin de nom', async () => {
      
      const paysData = {
        code: 'SE',
        nom: '  Suède  ',
        langue: '  Suédois  '
      };

      // Act
      const pays = new Pays(paysData);
      await pays.save();

      // Assert
      expect(pays.nom).toBe('Suède');
      expect(pays.langue).toBe('Suédois');
    });
  });

  describe('Indexes', () => {
    it('devrait avoir un index unique sur le code', async () => {
      
      const pays1 = new Pays({ code: 'NZ', nom: 'Nouvelle-Zélande', langue: 'Anglais' });
      await pays1.save();

      
      const pays2 = new Pays({ code: 'NZ', nom: 'Test', langue: 'Test' });
      await expect(pays2.save()).rejects.toThrow(/duplicate key|E11000/);
    });
  });
});
