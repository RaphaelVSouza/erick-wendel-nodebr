const assert = require('assert');

const Mongodb = require('../database/strategies/mongodb/mongodb');
const Hero = require('../database/strategies/mongodb/schemas/heroes');

const Context = require('../database/strategies/base/contextStrategy');

const MOCK_HERO_REGISTER = {
  name: 'Mulher Maravilha',
  power: 'Laço',
};

const MOCK_HERO_DEFAULT = {
  name: `Homem-Aranha-${Date.now()}`,
  power: 'Super Teia',
};

const MOCK_HERO_UPDATE = {
  name: `Patolino${Date.now()}`,
  power: 'Velocidade',
};
let MOCK_HERO_ID = '';
let context = {};
let connection = false;

describe('MongoDB Strategy', function () {
  this.beforeAll(async () => {
    connection = Mongodb.connect();

    context = new Context(new Mongodb(connection, Hero));

    await context.create(MOCK_HERO_DEFAULT);

    const result = await context.create(MOCK_HERO_UPDATE);
    MOCK_HERO_ID = result._id;

  });

  this.afterAll(async () => {
    context.close(connection);
  })

  it('MongoDB Connection', async () => {
    const result = await context.isConnected();
    const expected = 'Connected';

    assert.deepStrictEqual(result, expected);
  });

  it('Create', async () => {
    const { name, power } = await context.create(MOCK_HERO_REGISTER);

    assert.deepStrictEqual({ name, power }, MOCK_HERO_REGISTER);
  });

  it('Read', async () => {
    const [{ name, power }] = await context.read({
      name: MOCK_HERO_DEFAULT.name,
    });

    const result = {
      name,
      power,
    };

    assert.deepStrictEqual(result, MOCK_HERO_DEFAULT);
  });

  it('Update', async () => {
    const result = await context.update(MOCK_HERO_ID, {
      name: 'Pernalonga'
    })

    assert.deepStrictEqual(result.nModified, 1);
  });

  it('Delete', async () => {
    const result = await context.delete(MOCK_HERO_ID);
    assert.deepStrictEqual(result.n, 1);
  })
});
