const service = require('./service');

Array.prototype.meuMap = function (callback) {
  const novoArrayMapeado = [];
  for(let i = 0; i <= this.length -1; i++) {
    const resultado = callback(this[i], i);
    novoArrayMapeado.push(resultado)
  }
  return novoArrayMapeado;
}

async function main() {
try {
  const results = await service.getPeople('a');

  /*
  const names = []
  console.time('foreach')
  results.results.forEach(item => {
    names.push(item.name);
  });
  console.timeEnd('foreach')
*/

//const names = results.results.map(item => item.name)

const names = results.results.meuMap(item => item.name)
  console.log('names', names)
}
catch(error) {
  console.error('Deu ruim', error)
}
}

main()
