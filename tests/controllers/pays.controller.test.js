const request = require("supertest");
const express = require("express");
const paysRoutes = require("../../src/routes/pays.routes");
const Pays = require("../../src/models/pays.model");

const app = express();
app.use(express.json());
app.use("/api/pays", paysRoutes);

describe("Pays Controller Integration Tests", () => {
  describe("GET /api/pays", () => {
    it("devrait retourner la liste des pays", async () => {
      
      await Pays.create([
        { code: "FR", nom: "France", langue: "Français" },
        { code: "US", nom: "États-Unis", langue: "Anglais" },
      ]);

      
      const response = await request(app).get("/api/pays").expect(200);

      expect(response.body.pays).toHaveLength(2);
      expect(response.body.pays[0].nom).toBe("France");
      expect(response.body.pays[1].nom).toBe("États-Unis");
    });

    it("devrait retourner un tableau vide s'il n'y a pas de pays", async () => {
      
      const response = await request(app).get("/api/pays").expect(200);

      expect(response.body.pays).toEqual([]);
    });
  });

  describe("POST /api/pays", () => {
    it("devrait créer un nouveau pays", async () => {
      
      const paysData = {
        code: "IT",
        nom: "Italie",
        langue: "Italien",
      };

      
      const response = await request(app)
        .post("/api/pays")
        .send(paysData)
        .expect(201);

      expect(response.body.pays.code).toBe("IT");
      expect(response.body.pays.nom).toBe("Italie");

      // Vérifier en base
      const paysInDb = await Pays.findOne({ code: "IT" });
      expect(paysInDb).toBeTruthy();
    });

    it("devrait retourner une erreur pour des données invalides", async () => {
      
      const paysData = {
        code: "INVALID",
        nom: "Test",
        // langue manquante
      };

      
      const response = await request(app)
        .post("/api/pays")
        .send(paysData)
        .expect(400);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe("GET /api/pays/:code", () => {
    beforeEach(async () => {
      await Pays.create({ code: "ES", nom: "Espagne", langue: "Espagnol" });
    });

    it("devrait retourner un pays spécifique avec ses films", async () => {
      
      const response = await request(app).get("/api/pays/ES").expect(200);

      expect(response.body.pays.nom).toBe("Espagne");
      expect(response.body.films).toEqual([]); // Pas de films associés
    });

    it("devrait retourner 404 pour un pays inexistant", async () => {
      
      await request(app).get("/api/pays/XX").expect(404);
    });
  });

  describe("PUT /api/pays/:code", () => {
    beforeEach(async () => {
      await Pays.create({ code: "DE", nom: "Allemagne", langue: "Allemand" });
    });

    it("devrait mettre à jour un pays existant", async () => {
      
      const updateData = { nom: "Deutschland" };

      
      const response = await request(app)
        .put("/api/pays/DE")
        .send(updateData)
        .expect(200);

      expect(response.body.pays.nom).toBe("Deutschland");
      expect(response.body.pays.code).toBe("DE");
    });

    it("devrait retourner 404 pour un pays inexistant", async () => {
      
      const updateData = { nom: "Test" };

      
      await request(app).put("/api/pays/XX").send(updateData).expect(404);
    });
  });
});
