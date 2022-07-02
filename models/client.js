class Client {
  constructor(
    id,
    nome,
    idade,
    email,
    telefone,
    endereco,
    produtosPreferidos = []
  ) {
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.email = email;
    this.produtosPreferidos = produtosPreferidos;
    this.telefone = telefone;
    this.endereco = endereco;
  }
}

module.exports = Client;
