const express = require("express");
const {
  save,
  getAll,
  deleteProduct,
  getById,
  getByName,
  update,
} = require("../controllers/productController");
const { validarCamposProdutoRequisicao } = require("../middlewares/products");

const router = express.Router();

router.post("/products", validarCamposProdutoRequisicao, save);
router.get("/products", getAll);
router.get("/products/:id", getById);
router.get("/products/ByName/:nome", getByName);
router.put("/products/:id", validarCamposProdutoRequisicao, update);
router.delete("/products/:id", deleteProduct);

module.exports = { routes: router };
