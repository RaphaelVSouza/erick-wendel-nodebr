const Hapi = require('@hapi/hapi');
const Mongodb = require('./database/strategies/mongodb/mongodb');
const Hero = require('./database/strategies/mongodb/schemas/heroes');
const Context = require('./database/strategies/base/contextStrategy');
const HeroRoute = require('./routes/heroRoutes');
const Joi = require('joi');

const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');

const app = new Hapi.Server({
  port: 3001
});

function mapRoutes(instance, methods) {
  return methods.map(methods => instance[methods]());
};

async function main() {
  const connection = Mongodb.connect();
  const context = new Context(new Mongodb(connection, Hero));

  const swaggerOptions = {

      info: {
        title: 'API Heroes - #NodeBR',
        version: 'v1.0',

    },
  }

 await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ])

  app.validator(Joi);

  app.route(
    mapRoutes(new HeroRoute(context), HeroRoute.methods())
  )

  await app.start()
  console.log(`Server running on port ${app.info.port}`)

  return app;
};

module.exports = main();
