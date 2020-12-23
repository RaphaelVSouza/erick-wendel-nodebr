//docker ps
//docker exec -t {{id}} /
//mongo -u user -p mypass --authenticationDatabase dbname

// databases
show dbs

// mudando contexto para uma database
use dbname

// mostrar coleções
show collections

db.dbname.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNasc: '1998-01-01'
})

db.dbname.find()
db.dbname.find().pretty()

for(let i=0; i<= 100; i++) {
  db.dbname.insert({
    nome: `Clone-${i}`,
    poder: 'Velocidade',
    dataNasc: '1998-01-01'
  })
}

db.dbname.count()
db.dbname.findOne()
db.dbname.find().linty(10).sort({ nome: -1 })
db.dbname.find({}, { poder: 1, _id: 0})

// Create

db.dbname.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNasc: '1998-01-01'
})

// Read

db.dbname.find()

// Update

db.dbname.update({ _id: 'myid'},
{ nome: 'Mulher maravilha' })// Perde dados

db.dbname.update({ _id: 'myid'},
{$set: {nome: 'Mulher maravilha' } })// Não perde

// Delete

db.dbname.remove({_id: 'myid'})

