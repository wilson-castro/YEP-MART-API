const Message = require("../models/message");
const { returnErrorMessage, getClientePorEmail } = require("../utils");

const validarCamposClientRequisicao = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  const { nome, idade, email, telefone, endereco } = data;
  let { produtosPreferidos } = data;
  const fields = [];
  const errors = [];

  if (!nome || nome == "null" || !nome?.trim()) {
    fields.push("nome");
    errors.push(returnErrorMessage("nome"));
  }

  if (!telefone || telefone == "null" || !telefone?.trim()) {
    fields.push("telefone");
    errors.push(returnErrorMessage("telefone"));
  }

  if (!email || email == "null" || !email?.trim()) {
    fields.push("email");
    errors.push(returnErrorMessage("email"));
  }

  if (!endereco || endereco == "null" || !endereco?.trim()) {
    fields.push("endereco");
    errors.push(returnErrorMessage("endereco"));
  }

  if (idade === null || idade === "null" || isNaN(idade)) {
    fields.push("idade");
    errors.push(returnErrorMessage("idade"));
  }

  produtosPreferidos = produtosPreferidos ?? [];

  let userAlreadyExists = null;
  try {
    userAlreadyExists = await getClientePorEmail(email);
  } catch (error) {
    res.status(400).send(error);
  }

  if (userAlreadyExists && userAlreadyExists?.id != id) {
    fields.push("email");
    errors.push("Já existe um cliente cadastrado com esse email");
  }

  if (errors.length) {
    res.status(422).send(new Message(null, null, fields, errors));
  } else {
    next();
  }
};

module.exports = {
  validarCamposClientRequisicao,
};
