const assert = require('assert');

const Postgres = require('../database/strategies/postgres');

const Context = require('../database/strategies/base/contextStrategy');

const context = new Context(new Postgres());
const MOCK_HEROI_CADASTRAR = { nome: 'Gavião Negro', poder: 'Flechas'};
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro'};


describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async function () {
     await context.connect();
     await context.delete();
     await context.create(MOCK_HEROI_ATUALIZAR);
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
  });

  it('atualizar', async function() {
    const [ itemAtualizar ] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome});
    const novoItem = {
      ...MOCK_HEROI_ATUALIZAR,
      nome: 'Mulher Maravilha'
    };

    const [ result ] = await context.update(itemAtualizar.id, novoItem);
    const  [ itemAtualizado ] = await context.read({ id: itemAtualizar.id});


    assert.deepStrictEqual(result, 1);
    assert.deepStrictEqual(itemAtualizado.nome, novoItem.nome);
  })

  it('remover', async function() {
    const [ item ] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepStrictEqual(result, 1);
  });
})
