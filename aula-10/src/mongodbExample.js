const Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost:27017/herois', {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}, (error) => {
if(!error) return;
console.error('Falha na conexão!', error);
})

const connection = Mongoose.connection;

connection.once('open', () => {
  console.log('Database rodando!')
})

const heroisSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  poder: {
    type: String,
    required: true,
  },
  insertedAt: {
    type: Date,
    default: new Date(),
  },
});

const model = Mongoose.model('herois', heroisSchema);

async function main() {
  const resultCadastrar = await model.create({
    nome: 'Batman',
    poder: 'Dinheiro',
  });

  console.log('result cadastrar', resultCadastrar)

  const listItens = await model.find();

  console.log('lista', listItens)

}

main();
