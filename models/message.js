class Message {
  constructor(message = null, data = null, fields = [], errors = []) {
    this.message = message;
    this.data = data;
    this.fields = fields;
    this.errors = errors;
  }
}

module.exports = Message;
