const Artiste = require('../../../src/models/artiste.model');

describe('Artiste Model', () => {
  describe('Validation', () => {
    it('devrait créer un artiste valide', async () => {
      
      const artisteData = {
        nom: 'Tarantino',
        prenom: 'Quentin',
        anneeNaissance: 1963
      };

      // Act
      const artiste = new Artiste(artisteData);
      await artiste.save();

      // Assert
      expect(artiste.nom).toBe('Tarantino');
      expect(artiste.prenom).toBe('Quentin');
      expect(artiste.anneeNaissance).toBe(1963);
      expect(artiste.createdAt).toBeDefined();
      expect(artiste.updatedAt).toBeDefined();
    });

    it('devrait rejeter un artiste sans nom', async () => {
      
      const artisteData = {
        prenom: 'Test',
        anneeNaissance: 1980
      };

      
      const artiste = new Artiste(artisteData);
      await expect(artiste.save()).rejects.toThrow(/nom.*requis/);
    });

    it('devrait rejeter un artiste sans prénom', async () => {
      
      const artisteData = {
        nom: 'Test',
        anneeNaissance: 1980
      };

      
      const artiste = new Artiste(artisteData);
      await expect(artiste.save()).rejects.toThrow(/prénom.*requis/);
    });

    it('devrait rejeter un artiste sans année de naissance', async () => {
      
      const artisteData = {
        nom: 'Test',
        prenom: 'Artiste'
      };

      
      const artiste = new Artiste(artisteData);
      await expect(artiste.save()).rejects.toThrow(/année de naissance.*requise/);
    });

    it('devrait rejeter une année de naissance trop ancienne', async () => {
      
      const artisteData = {
        nom: 'Ancient',
        prenom: 'Artist',
        anneeNaissance: 1850
      };

      
      const artiste = new Artiste(artisteData);
      await expect(artiste.save()).rejects.toThrow(/Année de naissance invalide/);
    });

    it('devrait rejeter une année de naissance future', async () => {
      
      const currentYear = new Date().getFullYear();
      const artisteData = {
        nom: 'Future',
        prenom: 'Artist',
        anneeNaissance: currentYear + 1
      };

      
      const artiste = new Artiste(artisteData);
      await expect(artiste.save()).rejects.toThrow(/Année de naissance invalide/);
    });

    it('devrait accepter l\'année courante comme année de naissance', async () => {
      
      const currentYear = new Date().getFullYear();
      const artisteData = {
        nom: 'Current',
        prenom: 'Artist',
        anneeNaissance: currentYear
      };

      // Act
      const artiste = new Artiste(artisteData);
      await artiste.save();

      // Assert
      expect(artiste.anneeNaissance).toBe(currentYear);
    });

    it('devrait supprimer les espaces en début et fin de nom et prénom', async () => {
      
      const artisteData = {
        nom: '  Trimmed  ',
        prenom: '  Name  ',
        anneeNaissance: 1980
      };

      // Act
      const artiste = new Artiste(artisteData);
      await artiste.save();

      // Assert
      expect(artiste.nom).toBe('Trimmed');
      expect(artiste.prenom).toBe('Name');
    });

    it('devrait pouvoir avoir un tableau de rôles vide', async () => {
      
      const artisteData = {
        nom: 'NoRoles',
        prenom: 'Artist',
        anneeNaissance: 1980
      };

      // Act
      const artiste = new Artiste(artisteData);
      await artiste.save();

      // Assert
      expect(artiste.roles).toEqual([]);
    });
  });
});
