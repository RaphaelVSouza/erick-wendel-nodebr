const assert = require('assert');
const api = require('./../api');
let app = {};

const MOCHA_CREATE_HERO = {
  name: 'Thanos',
  power: 'Manopla do infinito',
};

describe('Test suit for api heroes', function() {
  this.beforeAll( async () => {
    app = await api;
  });

  it('Create', async () => {
    const response = await app.inject({
      method:'POST',
      url: '/heroes',
      payload: MOCHA_CREATE_HERO
    });

    const { hero } = JSON.parse(response.payload)
    const { name, power } = hero;
    const statusCode = response.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.deepStrictEqual({ name, power }, MOCHA_CREATE_HERO);
  });

  it('Read', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
    });

    const dados = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('Read /heroes - should return 3 items', async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const dados = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);
  });

  it('Read /heroes - should return filtered name', async () => {
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?name=${MOCHA_CREATE_HERO.name}`,
    });

    const  [ dados ] = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.deepStrictEqual(dados.name, MOCHA_CREATE_HERO.name);
  });
});
