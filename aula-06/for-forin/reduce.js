const { getPeople } = require('./service');

Array.prototype.myReduce = function(callback, initialValue) {
  let finalValue = typeof initialValue !== undefined ? initialValue : this[0];
  for(let index = 0; index <= this.length -1; index ++) {
    finalValue = callback(finalValue, this[index])
  }

  return finalValue
}

async function main() {
  try {
    const { results } = await getPeople('a');
    const height = results.map(item => parseInt(item.height))

  //  const total = altura.reduce(( previous, next )=> {
  //    return previous + next;
  //  })

  const minhaLista = [
    ['Erick', 'Wendel'],
    ['NodeBR', 'Nerdzão']
  ]

  const total = minhaLista.myReduce((previous, next) => {
    return previous.concat(next);
  }, []).join(', ')

    console.log('total', total)
  }
  catch(error) {
    console.error('Deu ruim', error)
  }
}

main()
