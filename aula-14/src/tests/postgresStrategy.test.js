const assert = require('assert');

const Postgres = require('../database/strategies/postgres/postgres');
const Hero = require('../database/strategies/postgres/model/Hero');
const Context = require('../database/strategies/base/contextStrategy');

let context = {};
let connection = false;
const MOCK_HERO_REGISTER = { name: 'Gavião Negro', power: 'Flechas' };
const MOCK_HERO_UPDATE = { name: 'Batman', power: 'Dinheiro' };

describe('Postgres Strategy', function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    connection = await Postgres.connect();

    const model = await Postgres.defineModel(connection, Hero);

    context = new Context(new Postgres(connection, model));

    await context.delete();

    await context.create(MOCK_HERO_UPDATE);
  });

  it('PostgresSQL Connection', async () => {
    const result = await context.isConnected();

    assert.deepStrictEqual(result, true);
  });
  it('Create', async () => {
    const { name, power } = await context.create(MOCK_HERO_REGISTER);

    assert.deepStrictEqual({ name, power }, MOCK_HERO_REGISTER);
  });

  it('Read', async () => {
    const [result] = await context.read({ name: MOCK_HERO_REGISTER.name });
    delete result.id;
    assert.deepStrictEqual(result, MOCK_HERO_REGISTER);
  });

  it('Update', async () => {
    const [itemAtualizar] = await context.read({ name: MOCK_HERO_UPDATE.name });
    const novoItem = {
      ...MOCK_HERO_UPDATE,
      name: 'Mulher Maravilha',
    };

    const [result] = await context.update(itemAtualizar.id, novoItem);
    const [itemAtualizado] = await context.read({ id: itemAtualizar.id });

    assert.deepStrictEqual(result, 1);
    assert.deepStrictEqual(itemAtualizado.name, novoItem.name);
  });

  it('Delete', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    assert.deepStrictEqual(result, 1);
  });
});
