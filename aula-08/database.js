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

  async writeFileAsync(data) {
    const file = this.NOME_ARQUIVO;
    await writeFile(file, JSON.stringify(data));
    return true;
  }

  async create(hero) {
    const data = await this.readFileAsync();
    const id = hero.id <= 2 ? hero.id : Date.now();
    const heroWithId = {
      id,
      ...hero
    };

    const finalData = [...data, heroWithId];

    const result = await this.writeFileAsync(finalData);

    return result;


  }

  async delete(id) {
    if(!id) {
     return await this.writeFileAsync([]);
    }
    const data = await this.index();
    const index = data.findIndex(item => item.id === parseInt(id))
    if(index === -1) {
      throw Error('O herói informado não existe!')
    }

    data.splice( index, 1 );
    return await this.writeFileAsync(data);

  }

  async update(id, updates) {
    const dados = await this.readFileAsync();
    const index = dados.findIndex(item => item.id === parseInt(id));
    if(index === -1) {
      throw Error('O herói informado não existe.')
    }

    const atual = dados[index];
    const objetoAtualizar = {
      ...atual,
      ...updates
    }

    dados.splice(index, 1)
    return await this.writeFileAsync([
      ...dados,
      objetoAtualizar
    ]);

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
