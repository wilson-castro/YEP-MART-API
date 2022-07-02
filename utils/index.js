const firebase = require("../db");
const Client = require("../models/client");
const Product = require("../models/product");
const firestore = firebase.firestore();

const returnErrorMessage = (campo) => `Preencha corretamente o campo ${campo}`;

async function readDocuments(collection, options = {}) {
  let { where, orderBy, limit } = options;
  let query = await firestore.collection(collection);

  if (where) {
    if (where[0] instanceof Array) {
      for (let w of where) {
        query = query.where(...w);
      }
    } else {
      query = query.where(...where);
    }
  }

  if (orderBy) {
    query = query.orderBy(...orderBy);
  }

  if (limit) {
    query = query.limit(limit);
  }

  return await query.get();
}

const getProdutoPorNome = async (nome) => {
  let productResponse = null;
  const product = await firestore
    .collection("products")
    .where("nome", "==", nome);

  await product
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        productResponse = new Product(
          doc.id,
          data.nome,
          data.preco,
          data.quantidade,
          data.validade
        );
      });
    })
    .catch((err) => {
      console.log(err);
      throw new Error(
        `Ocorreu um erro durante a busca por produtos: ${err.message}`
      );
    });

  return productResponse;
};

const getClientePorEmail = async (email) => {
  let clientResponse = null;
  const client = await firestore
    .collection("clients")
    .where("email", "==", email);

  await client
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        clientResponse = new Client(
          doc.id,
          data.nome,
          data.idade,
          data.email,
          data.telefone,
          data.endereco,
          data.produtosPreferidos ?? []
        );
      });
    })
    .catch((err) => {
      console.log(err);
      throw new Error(
        `Ocorreu um erro durante a busca por clientes: ${err.message}`
      );
    });

  return clientResponse;
};

module.exports = {
  returnErrorMessage,
  readDocuments,
  getProdutoPorNome,
  getClientePorEmail,
};
