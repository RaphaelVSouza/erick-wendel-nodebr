const {
  readFile,
  writeFile
} = require('fs/promises')

const readFileAsync = readFile;
const writeFileAsync = writeFile;
class Database {
  constructor() {
    this.NOME_ARQUIVO = 'heroes.json';
  }

  async readFile() {
    const file = await readFileAsync(this.NOME_ARQUIVO, 'utf-8');

    return JSON.parse(file.toString());
  }

  async writeFile(data) {
    const file = this.NOME_ARQUIVO;
    await writeFileAsync(file, JSON.stringify(data));
    return true;
  }

  async create(hero) {
    const data = await this.readFile();
    const id = hero.id <= 2 ? hero.id : Date.now();
    const heroWithId = {
      id,
      ...hero
    };

    const finalData = [...data, heroWithId];

    const result = await this.writeFile(finalData);

    return result;


  }

  async delete(id) {
    if(!id) {
     return await this.writeFile([]);
    }
    const data = await this.index();
    const index = data.findIndex(item => item.id === parseInt(id))
    if(index === -1) {
      throw Error('O herói informado não existe!')
    }

    data.splice( index, 1 );
    return await this.writeFile(data);

  }

  async update(id, updates) {
    // Lê o JSON
    const data = await this.readFile();
    console.log('data', data)
    // Verifica se o Id passado existe
    const index = data.findIndex(item => item.id === parseInt(id));
    if(index === -1) {
      throw Error('O herói informado não existe.')
    }

    const current = data[index];
    console.log('current', current)
   data.splice(index, 1);


     //workaround para remover valores undefined do objeto
     const updatedObject = JSON.parse(JSON.stringify(updates));

     const updatedData = Object.assign({}, current, updatedObject);


     return await this.writeFile([...data, updatedData]);

  }

  async index(id) {
    const data = await this.readFile();
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
