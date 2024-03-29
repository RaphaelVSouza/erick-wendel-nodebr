const assert = require('assert');

const nock = require('nock');

const {
  getCharacter
 } = require('./service');

describe('Star Wars Tests', function () {
  this.beforeAll(() => {
    const response =
      {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'R2-D2',
            height: '96',
            mass: '32',
            hair_color: 'n/a',
            skin_color: 'white, blue',
            eye_color: 'red',
            birth_year: '33BBY',
            gender: 'n/a',
            homeworld: 'http://swapi.dev/api/planets/8/',
            vehicles: [],
            starships: [],
            created: '2014-12-10T15:11:50.376000Z',
            edited: '2014-12-20T21:17:50.311000Z',
            url: 'http://swapi.dev/api/people/3/'
          }
        ]
      }

      nock('https://swapi.dev')
      .persist()
      .get('/api/people/?search=r2-d2&format=json')
      .reply(200, response)
    });

  it('Deve buscar o R2D2 com o formato correto', async () => {
    const expected = [ { nome: 'R2-D2', altura: '96' } ];
    const nomeBase = 'r2-d2';

    const result = await getCharacter(nomeBase);


    assert.deepStrictEqual(result, expected);
  })
});
