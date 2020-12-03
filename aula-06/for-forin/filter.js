const { getPeople } = require('./service');

Array.prototype.meuFilter = function (callback) {
  const lista = [];
  for(index in this) {

    const item = this[index];
    const result = callback(item, index, this);

    if(!result) continue;
    lista.push(item)
  }
  return lista;
}

async function main() {
try {
const {
   results
  } = await getPeople('a');


  /*
  const familiaLars = results
  .filter((item) => {
    const result = item.name
    .toLowerCase()
    .indexOf('lars') !== -1;
    return result;
  })
  */


const familiaLars = results.meuFilter(function
  (item, index, lista) {
 console.log(`index ${index}`, lista.length)
 return item.name.toLowerCase().indexOf('lars') !== -1
})

  const names = familiaLars.map(pessoa => pessoa.name)

  console.log(names);
}
catch(error) {
console.error('Deu ruim', error)
}
}

main();
