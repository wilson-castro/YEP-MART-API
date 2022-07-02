const firebase = require("../db");
const Client = require("../models/client");
const Message = require("../models/message");
const { getClientePorEmail } = require("../utils");
const firestore = firebase.firestore();

const save = async (req, res, next) => {
  try {
    const clientData = req.body;
    await firestore.collection("clients").add(clientData);

    res.send(new Message("Cliente salvo com sucesso!", clientData));
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const getAll = async (req, res, next) => {
  try {
    const clientsCollection = await firestore.collection("clients");
    const data = await clientsCollection.get();
    const clients = [];

    if (data.empty) {
      res.status(404).send(new Message("Nenhum registro foi encontrado!"));
    } else {
      let count = 0;

      data.forEach((doc) => {
        const cliente = new Client(
          doc.id,
          doc.data().nome,
          doc.data().idade,
          doc.data().email,
          doc.data().telefone,
          doc.data().endereco,
          doc.data().produtosPreferidos ?? []
        );

        clients.push(cliente);
        count++;
      });
      res.send({ entities: clients.sort((a, b) => a.nome > b.nome), count });
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
    const client = await firestore.collection("clients").doc(id);
    const data = await client.get();

    if (!data.exists) {
      res.status(404).send("Este Cliente não foi encontrado no banco de dados");
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const getByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    let client = null;

    try {
      client = await getClientePorEmail(email);
    } catch (error) {
      res.status(400).send(error);
    }

    if (!client) {
      res.status(404).send("Este Cliente não foi encontrado no banco de dados");
    } else {
      res.send(client);
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
    const client = await firestore.collection("clients").doc(id);

    if (!(await client.get())?.exists) {
      res.status(404).send("Este Cliente não foi encontrado no banco de dados");
    } else {
      await client.set(data);
      res.send(new Message("Cliente atualizado com sucesso!", data));
    }
  } catch (err) {
    res
      .status(400)
      .send(new Message(`Ocorreu um erro durante a operação ${err.message}`));
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const id = req.params.id;

    const client = await firestore.collection("clients").doc(id);
    const data = await client.get();

    if (!data.exists) {
      res.status(404).send("Este Cliente não foi encontrado no banco de dados");
    } else {
      await firestore.collection("clients").doc(id).delete();
      res.send(new Message("Cliente deletado com sucesso!"));
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
  deleteClient,
  getById,
  getByEmail,
  update,
};
