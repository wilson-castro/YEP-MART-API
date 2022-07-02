const firebase = require("../db");
const Product = require("../models/product");
const Message = require("../models/message");
const { getProdutoPorNome } = require("../utils");
const firestore = firebase.firestore();

const save = async (req, res, next) => {
  try {
    const productData = req.body;
    await firestore.collection("products").add(productData);

    res.send(new Message("Produto salvo com sucesso!", productData));
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const getAll = async (req, res, next) => {
  try {
    const productsCollection = await firestore.collection("products");
    const data = await productsCollection.get();
    const products = [];

    if (data.empty) {
      res.status(404).send(new Message("Nenhum registro foi encontrado!"));
    } else {
      let count = 0;

      data.forEach((doc) => {
        const produto = new Product(
          doc.id,
          doc.data().nome,
          doc.data().preco,
          doc.data().quantidade,
          doc.data().validade
        );

        products.push(produto);
        count++;
      });
      res.send({ entities: products.sort((a, b) => a.nome > b.nome), count });
    }
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await firestore.collection("products").doc(id);
    const data = await product.get();

    if (!data.exists) {
      res.status(404).send("Este Produto não foi encontrado no banco de dados");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const getByName = async (req, res, next) => {
  try {
    const nome = req.params.nome;
    let product = null;

    try {
      product = await getProdutoPorNome(nome);
    } catch (error) {
      res.status(400).send(error);
    }

    if (!product) {
      res.status(404).send("Este Produto não foi encontrado no banco de dados");
    } else {
      res.send(product);
    }
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = await firestore.collection("products").doc(id);

    if (!(await product.get())?.exists) {
      res.status(404).send("Este Produto não foi encontrado no banco de dados");
    } else {
      await firestore.collection("products").doc(id).delete();
      res.send(new Message("Produto deletado com sucesso!"));
    }

    await product.set(data);
    res.send(new Message("Produto atualizado com sucesso!", data));
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await firestore.collection("products").doc(id);
    const data = await product.get();

    if (!data.exists) {
      res.status(404).send("Este Produto não foi encontrado no banco de dados");
    } else {
      await firestore.collection("products").doc(id).delete();
      res.send(new Message("Produto deletado com sucesso!"));
    }
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

module.exports = {
  save,
  getAll,
  getById,
  getByName,
  update,
  deleteProduct,
};
