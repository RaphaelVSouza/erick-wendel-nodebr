const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'development';
ok(env === 'production' || env === 'development', 'Invalid enviroment!');

const configPath = join(__dirname, '../config', `.env.${env}`);

config({
  path: configPath,
});

const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const HapiJwt = require('hapi-auth-jwt2');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const Mongodb = require('./database/strategies/mongodb/mongodb');
const Hero = require('./database/strategies/mongodb/schemas/heroes');
const Context = require('./database/strategies/base/contextStrategy');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoute = require('./routes/authRoutes');
const AuthRoutes = require('./routes/authRoutes');
const Postgres = require('./database/strategies/postgres/postgres');
const UserSchema = require('./database/strategies/postgres/model/User');

const { JWT_SECRET } = process.env;

const app = new Hapi.Server({
  port: process.env.PORT,
});

function mapRoutes(instance, methods) {
  return methods.map((methods) => instance[methods]());
}

async function main() {
  const connection = Mongodb.connect();
  const context = new Context(new Mongodb(connection, Hero));

  const connectionPostgres = await Postgres.connect();

  const User = await Postgres.defineModel(connectionPostgres, UserSchema);

  const contextPostgres = new Context(new Postgres(connectionPostgres, User));

  const swaggerOptions = {
    info: {
      title: 'API Heroes - #NodeBR',
      version: 'v1.0',
    },
  };

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.validator(Joi);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    //  options: {
    //    expiresIn: 20
    //  }
    validate: async (data, request) => {
      const [result] = await contextPostgres.read({
        username: data.username.toLowerCase(),
      });

      if (!result) {
        return {
          isValid: false,
        };
      }

      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoute.methods()),
  ]);

  await app.start();
  console.log(`Server running on port ${app.info.port}`);

  return app;
}

module.exports = main();
