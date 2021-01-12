const Sequelize = require ('sequelize')
const dbConfig  = require ('../DataBase/Config/config')

const Acao = require('../Model/acao')
const Usuario = require('../Model/usuario')
const Carteira = require('../Model/carteira')
const Operacao = require('../Model/operacao')


const connection = new Sequelize(dbConfig)
console.log(`Banco de dados local : ${dbConfig.storage}`)

Acao.init(connection)
Usuario.init(connection)
Carteira.init(connection)
Operacao.init(connection)

Usuario.associate(connection.models)
Acao.associate(connection.models)
Carteira.associate(connection.models)
Operacao.associate(connection.models)

module.exports = connection