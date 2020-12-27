const BaseRoute = require('./base/baseRoute');

class HeroRoutes extends BaseRoute{
  constructor(db) {
    super();
    this.db = db;
  }

  read() {
    return {
      path: '/heroes',
      method: 'GET',
      handler: async (request, headers) => {
        try {
          let { skip, limit, name } = request.query;

          let query = null;

          name ? query = { name } : query;

          const result = await this.db.read(query, parseInt(skip), parseInt(limit));
          return result;
        } catch (error) {
          console.error('Error on read', error)
          return "Internal server error"
        }
      }
    }
  }

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      handler: (request, headers) => {
        try {
          const { name, power } = request.payload;

          return this.db.create({ name, power });

        } catch (error) {
          console.error('Error on read', error)
          return "Internal server error"
        }
      }
    }
  }

}

module.exports = HeroRoutes;
