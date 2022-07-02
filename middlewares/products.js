const { isDate } = require("util/types");
const Message = require("../models/message");
const { returnErrorMessage, getProdutoPorNome } = require("../utils");

const validarCamposProdutoRequisicao = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const { nome, preco, quantidade, validade } = data;
  const fields = [];
  const errors = [];

  if (!nome || nome == "null" || !nome?.trim()) {
    fields.push("nome");
    errors.push(returnErrorMessage("nome"));
  }

  if (preco === null || preco === "null" || isNaN(preco)) {
    fields.push("preco");
    errors.push(returnErrorMessage("preco"));
  }

  if (quantidade === null || quantidade === "null" || isNaN(quantidade)) {
    fields.push("quantidade");
    errors.push(returnErrorMessage("quantidade"));
  }

  try {
    if (!validade?.trim() || !isDate(new Date(validade))) {
      fields.push("validade");
      errors.push(returnErrorMessage("validade"));
    }
  } catch (err) {
    fields.push("validade");
    errors.push(returnErrorMessage("validade"));
  }

  let produtoAlreadyExists = null;
  try {
    produtoAlreadyExists = await getProdutoPorNome(nome);
  } catch (error) {
    res.status(400).send(error);
  }

  if (produtoAlreadyExists && produtoAlreadyExists?.id != id) {
    fields.push("nome");
    errors.push("Já existe um produto cadastrado com esse nome");
  }

  if (errors.length) {
    res.status(422).send(new Message(null, null, fields, errors));
  } else {
    next();
  }
};

module.exports = {
  validarCamposProdutoRequisicao,
};
