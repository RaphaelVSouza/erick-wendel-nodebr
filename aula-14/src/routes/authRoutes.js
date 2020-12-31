const Boom = require('boom');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const BaseRoute = require('./base/baseRoute');

const PasswordHelper = require('../utils/passwordHelper');

const failAction = (request, headers, error) => {
  throw error;
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
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

        const [user] = await this.db.read({
          username: username.toLowerCase(),
        });
        if (!user) {
          return Boom.unauthorized('User does not exist');
        }

        const match = await PasswordHelper.comparePassword(password, user.password);

        if (!match) {
          return Boom.unauthorized('User or password invalid');
        }

        const token = jwt.sign(
          {
            username,
            id: user._id,
          },
          this.secret,
        );
        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoutes;
