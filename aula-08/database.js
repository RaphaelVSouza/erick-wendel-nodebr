const {
  readFile,
  writeFile
} = require('fs/promises')

class Database {
  constructor() {
    this.NOME_ARQUIVO = 'heroes.json';
  }

  async readFileAsync() {
    const file = await readFile(this.NOME_ARQUIVO, 'utf-8');
    return JSON.parse(file.toString());
  }

  async writeFileAsync() {

  }

  async index(id) {
    const data = await this.readFileAsync();
    const filterData = data.filter(item => {
     if(!!id) {
      return item.id === id;
     }
     return true;

    })
    return filterData

  }
}

module.exports = new Database();
