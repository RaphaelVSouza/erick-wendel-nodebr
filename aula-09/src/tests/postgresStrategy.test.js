const assert = require('assert');

const Postgres = require('../database/strategies/postgres');

const Context = require('../database/strategies/base/contextStrategy');

const context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = { nome: 'Gavião Negro', poder: 'Feclas'};


describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
     await context.connect();
  })
  it('PostgresSQL Connection', async function () {
    const result = await context.isConnected();

    assert.deepStrictEqual(result, true);
  })
  it('cadastrar', async function() {
   const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

    assert.deepStrictEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it('listar', async function() {
    const [ result ] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome });
    delete result.id
    assert.deepStrictEqual(result, MOCK_HEROI_CADASTRAR);
  })
})
