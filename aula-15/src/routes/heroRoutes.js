const Boom = require('boom');

const Joi = require('joi');
const BaseRoute = require('./base/baseRoute');

const failAction = (request, headers, error) => {
  throw error;
};

const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  read() {
    return {
      path: '/heroes',
      method: 'GET',
      options: {
        tags: ['api'],
        description: 'Should list heroes',
        notes: 'Can paginate and filter per name',
        validate: {
          // payload -> body
          // headers -> header
          // params -> na URL :id
          // query -> ?skip=10&limit=100
          failAction,
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100),
          },
          headers,
        },
      },
      handler: async (request, headers) => {
        try {
          const { skip, limit, name } = request.query;

          const query = name ? { name: { $regex: `.*${name}*.` } } : null;

          const result = await this.db.read(query, skip, limit);

          return result;
        } catch (error) {
          console.error('Error on read', error);
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      options: {
        tags: ['api'],
        description: 'Should register a hero',
        notes: 'Should register a hero with name and power',
        validate: {
          failAction,
          headers,
          payload: {
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(3).max(100),
          },
        },
      },
      handler: async (request, headers) => {
        try {
          const { name, power } = request.payload;

          const { _id } = await this.db.create({ name, power });
          return { message: 'Hero successfully registered', _id };
        } catch (error) {
          console.error('Error on read', error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: '/heroes/{id}',
      method: 'PATCH',
      options: {
        tags: ['api'],
        description: 'Should update a hero with id',
        notes: 'Can update a hero field',
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
          headers,
          payload: {
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(100),
          },
        },
      },

      handler: async (request) => {
        try {
          const { id } = request.params;

          const { payload } = request;

          const data = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, data);

          if (result.nModified !== 1) return Boom.preconditionFailed('ID not found in database');

          return {
            message: 'Hero successfully updated',
            result,
          };
        } catch (error) {
          console.error('Error on update', error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: '/heroes/{id}',
      method: 'DELETE',
      options: {
        tags: ['api'],
        description: 'Should delete a hero with id',
        notes: 'The id must be valid',
        validate: {
          failAction,
          headers,
          params: {
            id: Joi.string().required(),
          },
        },
      },

      handler: async (request) => {
        try {
          const { id } = request.params;

          const result = await this.db.delete(id);

          if (result.n !== 1) return Boom.preconditionFailed('ID not found in database');

          return {
            message: 'Hero successfully removed',
          };
        } catch (error) {
          console.error('Error on delete', error);
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoutes;
