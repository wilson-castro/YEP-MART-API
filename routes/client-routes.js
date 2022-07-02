const express = require("express");
const {
  save,
  getAll,
  deleteClient,
  getById,
  getByEmail,
  update,
} = require("../controllers/clientController");
const { validarCamposClientRequisicao } = require("../middlewares/client");

const router = express.Router();

router.post("/clients", validarCamposClientRequisicao, save);
router.get("/clients", getAll);
router.get("/clients/:id", getById);
router.get("/clients/ByEmail/:email", getByEmail);
router.put("/clients/:id", validarCamposClientRequisicao, update);
router.delete("/clients/:id", deleteClient);

module.exports = { routes: router };
