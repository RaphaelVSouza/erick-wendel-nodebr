const axios = require('axios');

const URL = 'https://swapi.dev/api/people';

async function getCharacter(nome) {
  const url = `${URL}/?search=${nome}&format=json`;
  const response = await axios.get(url);
  return response.data.results.map(mapCharacters);
}

function mapCharacters (item) {
  return {
    nome: item.name,
    altura: item.height
  }
}
module.exports = { getCharacter};
