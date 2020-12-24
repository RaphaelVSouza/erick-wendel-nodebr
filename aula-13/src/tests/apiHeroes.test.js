const assert = require('assert');
const api = require('./../api');
let app = {};

describe('Test suit for api heroes', function() {
  this.beforeAll( async () => {
    app = await api;
  });

  it('Read', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
    })

    const dados = JSON.parse(result.payload)


    const statusCode = result.statusCode;
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });


});
