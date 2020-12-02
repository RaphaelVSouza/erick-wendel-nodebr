/*
  0- Obter um usuário
  1- Obter o número de telefone de um usuário a partir de seu Id
  2- Obter o endereço do usuário pelo Id
*/

function getUser(callback) {
  setTimeout(() => {
    return callback(null, {
      id: 1,
      name: 'Aladin',
      birthDate: new Date()
    })
  }, 1000);
}

function getPhone(userId, callback) {
  setTimeout(() => {
    return callback(null, {
      phone: '(21)91234-1234'
    })
  }, 2000);
}

function getAdress(userId, callback) {
  setTimeout(() => {
    return callback(null, {
      street: 'Rua Qualquer da Silva',
      number: 0
    })
  }, 2000)
}


getUser((error, user) => {
  if(error) {
    console.log('Error', error)
    return;
  }

  getPhone(user.id, (error, phone) => {
    if(error) {
      console.log('Error', error)
      return;
    }

    getAdress(user.id, (error, adress) => {
      console.log({user, phone, adress})
    })

  })
});
