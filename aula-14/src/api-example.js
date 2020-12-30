const Hapi = require('@hapi/hapi');
const Mongodb = require('./database/strategies/mongodb/mongodb');
const Hero = require('./database/strategies/mongodb/schemas/heroes');
const Context = require('./database/strategies/base/contextStrategy');

const app = new Hapi.Server({
  port: 3001,
});

async function main() {
  const connection = Mongodb.connect();
  const context = new Context(new Mongodb(connection, Hero));

  app.route([
    {
      path: '/heroes',
      method: 'GET',
      handler: (req, res) => context.read(),
    },
  ]);

  await app.start();
  console.log(`Server running on port ${app.info.port}`);
}

main();
