const Sequelize = require ('sequelize')
const dbConfig  = require ('../DataBase/Config/config')

const Acao = require('../Model/acao')
const Usuario = require('../Model/usuario')



const connection = new Sequelize(dbConfig)
console.log(`Banco de dados local : ${dbConfig.storage}`)

Acao.init(connection)
Usuario.init(connection)

module.exports = connection