const assert = require('assert');
const api = require('./../api');
let app = {};

const MOCHA_CREATE_HERO = {
  name: 'Thanos',
  power: 'Manopla do infinito',
};

const MOCK_INITIAL_HERO = {
  name: 'Gavião Negro',
  power: 'A mira',
}

let MOCK_ID = '';

describe('Test suit for api heroes', function() {
  this.beforeAll( async () => {
    app = await api;

    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: JSON.stringify(MOCK_INITIAL_HERO),
    });

   const { _id } = JSON.parse(result.payload);
    MOCK_ID = _id;

  });

  it('Create', async () => {
    const response = await app.inject({
      method:'POST',
      url: '/heroes',
      payload: MOCHA_CREATE_HERO
    });

    const { _id, message } = JSON.parse(response.payload)
    const statusCode = response.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.notDeepStrictEqual(_id, undefined);
    assert.deepStrictEqual(message, 'Hero successfully registered');
  });

  it('Read', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
    });

    const data = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });

  it('Read /heroes - should return 3 items', async () => {
    const TAMANHO_LIMITE = 3;
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const data = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(data.length === TAMANHO_LIMITE);
  });

  it('Read /heroes - should return filtered name', async () => {
    const result = await app.inject({
      method: 'GET',
      url: `/heroes?name=${MOCHA_CREATE_HERO.name}`,
    });

    const  [ data ] = JSON.parse(result.payload);

    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.deepStrictEqual(data.name, MOCHA_CREATE_HERO.name);
  });

  it('PATCH', async () => {
    const _id = MOCK_ID;
    const expected = {
      power: 'Super Mira',
    };

    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Hero successfully updated')
  });

  it('NOT PATCH if incorrect ID', async () => {
    const incorrectId = '2b2b2b2b2b21b1a1a1a1a1a1';
    const expected = {
      power: 'Super Mira',
    };

    const result = await app.inject({
      method: 'PATCH',
      url: `/heroes/${incorrectId}`,
      payload: JSON.stringify(expected)
    });

    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID not found in database'
    }

    const statusCode = result.statusCode;
    assert.ok(statusCode === 412);
    const data = JSON.parse(result.payload);
    assert.deepStrictEqual(data, expectedError)
  });

  it('DELETE', async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${_id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Hero successfully removed')
  });

  it('NOT DELETE if incorrect ID', async () => {
    const incorrectId = '2b2b2b2b2b21b1a1a1a1a1a1';
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${incorrectId}`
    });

    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID not found in database'
    }
    const statusCode = result.statusCode;
    assert.ok(statusCode === 412);
    const data = JSON.parse(result.payload);
    assert.deepStrictEqual(data, expectedError)
  })
});
