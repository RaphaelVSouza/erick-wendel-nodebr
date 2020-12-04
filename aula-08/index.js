const Commander = require('commander');
const { parse } = require('path');
const Database = require('./database');
const Hero = require('./hero');

async function main(params) {
  Commander.version('v1')
    .option('-n, --nome [value]', 'Nome do herói')
    .option('-p, --poder [value]', 'Poder do herói')
    .option('-i, --id [value]', 'Id do herói')

    .option('-c, --cadastrar', 'Cadastrar um herói')
    .option('-l, --listar', 'Listar um herói')
    .option('-a, --atualizar [value]', 'Atualiza um herói')
    .option('-d, --deletar', 'Remove um herói pelo id')
    .parse(process.argv);

  try {
    console.log('Commander', Commander.atualizar);
    const hero = new Hero(Commander);
    if (Commander.cadastrar) {
      delete hero.id;

      const result = await Database.create(hero);
      if (!result) {
        console.error('Herói não foi cadastrado');
      }

      console.log('Herói cadastrado com sucesso');
    }
    if (Commander.listar) {
      const result = await Database.index();
      console.log(result);
      return;
    }

    if (Commander.atualizar) {

      const idForUpdate = parseInt(Commander.atualizar);
      delete hero.id;

      const result = await Database.update(idForUpdate, heroForUpdate);

      if (!result) {
        console.error('Não foi possivel atualizar o herói');
        return;
      }
      console.log('Herói atualizado com sucesso');
      return;
    }

    if (Commander.deletar) {
      const result = await Database.delete(hero.id);
      if (!result) {
        console.error('Não foi possível remover o herói');
      }
      console.log('Herói removido com sucesso.');
    }
  } catch (error) {
    console.error('Deu ruim', error);
  }
}

main();
