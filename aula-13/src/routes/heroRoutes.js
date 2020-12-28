const BaseRoute = require('./base/baseRoute');
const Boom = require('boom');

const Joi = require('joi');

const failAction =
  (request, headers, error) => {
    throw error;
  };

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
        },
      },
      handler: async (request, headers) => {
        try {
          let { skip, limit, name } = request.query;

          const query =
           name
          ?
          { name: { $regex: `.*${name}*.` } }
          : null;

          const result = await this.db.read(
            query,
            skip,
            limit
          );

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
        validate: {
          failAction,
          payload: {
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(3).max(100),
          },
        }
      },
      handler: async (request, headers) => {
        try {
          const { name, power } = request.payload;

          const { _id } = await this.db.create({ name, power });
         return { message: 'Hero successfully registered', _id }
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
        validate: {
          failAction,
          params: {
            id: Joi.string().required(),
          },
          payload: {
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(100),
          }
        }
      },

      handler: async (request) => {
        try {
          const {
            id
          } = request.params;

          const { payload } = request;

          const data = JSON.parse(JSON.stringify(payload));

          const result = await this.db.update(id, data);

          if(result.nModified !== 1) return Boom.preconditionFailed('ID not found in database');

          return {
            message: 'Hero successfully updated', result
          }
        } catch (error) {
          console.error('Error on update', error)
          return Boom.internal()
        }
      }
    }
  }

  delete() {
    return {
      path: '/heroes/{id}',
      method: 'DELETE',
      handler: async (request) => {
        try {
          const { id } = request.params;

          const result = await this.db.delete(id);

          if(result.n !== 1) return Boom.preconditionFailed('ID not found in database');

          return {
            message: 'Hero successfully removed'
          }
        } catch (error) {
          console.error('Error on delete', error)
          return Boom.internal()
        }
      }
    }
  }
}

module.exports = HeroRoutes;
