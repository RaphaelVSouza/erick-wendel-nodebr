const { deepStrictEqual, ok } = require('assert');

const database = require('./database');

const DEFAULT_ITEM = {id: 1, nome: 'Flash', poder: 'Speed'};
const DEFAULT_NEW_ITEM = {id: 2, nome: 'Batman', poder: 'Money'};

describe('Suite de manipulação de Herois', () => {
  before(async () => {
    await database.create(DEFAULT_NEW_ITEM)
  });

  it('deve pesquisar um herói usando arquivos', async() => {
    const expected = DEFAULT_ITEM;
    const [ result ] = await database.index(expected.id);
    deepStrictEqual(result, expected);
  })


  it('deve cadastrar um herói usando arquivos', async() => {
    const expected = DEFAULT_NEW_ITEM;
    const result = await database.create(DEFAULT_NEW_ITEM);
    const [ actual ] = await database.index(expected.id)
    deepStrictEqual(actual, expected);
  })
})
