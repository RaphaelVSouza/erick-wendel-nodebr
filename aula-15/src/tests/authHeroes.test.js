const assert = require('assert');
const api = require('../api');
const Context = require('../database/strategies/base/contextStrategy');
const Postgres = require('../database/strategies/postgres/postgres');
const UserSchema = require('../database/strategies/postgres/model/User');

let app = {};
const USER = {
  username: 'Xuxa',
  password: 'MYPASSWORD123',
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: '$2b$10$UihHpb.XY04FBMsjzr7I8.VA80rdoTRFeuAA8Udnel8gtCXYQUIPi',
};

describe('Auth test suit', function () {
  this.beforeAll(async () => {
    app = await api;
    const connection = await Postgres.connect();
    const User = await Postgres.defineModel(connection, UserSchema);
    const postgres = new Context(new Postgres(connection, User));

    await postgres.update(null, USER_DB, true);
  });

  it('Should get a token if the credentials are correct', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER,
    });

    const { statusCode } = result;

    const data = JSON.parse(result.payload);
    console.log(data.token);
    assert.deepStrictEqual(statusCode, 200);
    assert.ok(data.token.length > 10);
  });

  it('Shoult NOT get a token if the credentials are incorrect', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { ...USER, password: 'some incorrect password' },
    });

    const { statusCode } = result;
    const data = JSON.parse(result.payload);
    assert.deepStrictEqual(statusCode, 401);
    assert.deepStrictEqual(data.error, 'Unauthorized');
  });
});
