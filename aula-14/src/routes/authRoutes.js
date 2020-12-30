const BaseRoute = require('./base/baseRoute');
const Boom = require('boom');
const jwt = require('jsonwebtoken');

const Joi = require('joi');

const failAction = (request, headers, error) => {
  throw error;
};

const USER = {
  username: 'Xuxa',
  password: '123',
};

class AuthRoutes extends BaseRoute {
  constructor(secret) {
    super();
    this.secret = secret;
  }
  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Get token',
        notes: 'Login with username and password',
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        if (
          username.toLowerCase() !== USER.username.toLowerCase() ||
          password !== USER.password
        )
          return Boom.unauthorized();

        const token = jwt.sign(
          {
            username: username,
            id: 1,
          },
          this.secret
        );
        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoutes;
