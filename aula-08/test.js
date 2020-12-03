const { deepStrictEqual, ok } = require('assert');

const database = require('./database');

const DEFAULT_INDEX_ITEM = {id: 1, nome: 'Flash', poder: 'Speed'};

describe('Suite de manipulação de Herois', () => {
  it('deve pesquisar um herói usando arquivos', async() => {
    const expected = DEFAULT_INDEX_ITEM;
    const [ result ] = await database.index(expected.id);
    deepStrictEqual(result, expected);
  })
})
