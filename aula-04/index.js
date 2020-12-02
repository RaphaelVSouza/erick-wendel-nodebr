/*
  0- Obter um usuário
  1- Obter o número de telefone de um usuário a partir de seu Id
  2- Obter o endereço do usuário pelo Id
*/

function getUser() {
  return new Promise((resolve, reject) =>{
    setTimeout(() => {


      return resolve({
        id: 1,
        name: 'Aladin',
        birthDate: new Date()
      })
    }, 1000);

  })

}

function getPhone(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
       number: '(21)91234-1234'
      })
    }, 2000);
  });
};

function getAdress(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        street: 'Rua Qualquer da Silva',
        number: 0
      })
    }, 2000);

  });
};


async function main() {

  try {
    console.time('medida-promise')
    const user = await getUser();
    //const phone = await getPhone(user.id);
    //const adress = await getAdress(user.id);

    const result = await Promise.all([
      getPhone(user.id),
      getAdress(user.id)
    ]);

    const phone = result[0];
    const adress = result[1];

    console.log(`
    Nome: ${user.name},
    Telefone: ${phone.number},
    Endereço: ${adress.street}, nº ${adress.number}
    `)
    console.timeEnd('medida-promise')
  }
  catch (error) {
    console.error('deu ruim', error)
  }
}

main();
