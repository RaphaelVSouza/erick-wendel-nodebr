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


getUser().then((user) => {
  return getPhone(user.id)
  .then((phone) => {
    user.phone = phone.number
    return user;
  });
})
.then((user)=> {
  return getAdress(user.id)
  .then(adress => {

    user.adress = adress
    return `
    Nome: ${user.name},
    Nascimento: ${user.birthDate},
    Telefone: ${user.phone},
    Endereço: ${user.adress.street}, nº ${user.adress.number}
    `
  })
})
.then(user => console.log(user))
.catch((error) => console.error(error))

