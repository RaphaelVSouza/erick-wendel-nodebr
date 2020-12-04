const { deepStrictEqual, ok } = require('assert');

const database = require('./database');

const DEFAULT_CREATE_ITEM = {
  id: 1,
  nome: 'Flash',
  poder: 'Speed',
};
const DEFAULT_UPDATE_ITEM = {
  id: 2,
  nome: 'Lanterna Verde',
  poder: 'Energia do anel',
};

describe('Suite de manipulação de Herois', () => {
  before(async () => {
    await database.create(DEFAULT_CREATE_ITEM);
    await database.create(DEFAULT_UPDATE_ITEM);
  });



  it('deve pesquisar um herói usando arquivos', async () => {
    const expected = DEFAULT_CREATE_ITEM;
    const [result] = await database.index(expected.id);
    deepStrictEqual(result, expected);
  });

  it('deve cadastrar um herói usando arquivos', async () => {
    const expected = DEFAULT_CREATE_ITEM;
    await database.create(DEFAULT_CREATE_ITEM);
    const [actual] = await database.index(expected.id);
    deepStrictEqual(actual, expected);
  });

  it('deve atualizar um heroi pelo id', async () => {
    const expected = {
      ...DEFAULT_UPDATE_ITEM,
      nome: 'Batman',
      poder: 'Dinheiro',
    };
    console.log('expected', expected)
    await database.update(DEFAULT_UPDATE_ITEM.id, {
      nome: expected.nome,
      poder: expected.poder,
    });

    const [result] = await database.index(DEFAULT_UPDATE_ITEM.id);
    console.log('result', result)
    deepStrictEqual(result, expected);
  });

  it('deve remover um heroi por id', async () => {
    const expected = true;
    const result = await database.delete(DEFAULT_UPDATE_ITEM.id);
    deepStrictEqual(result, expected);
  });

  after(async() => {
    await database.delete();
  })

});
