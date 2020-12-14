const Sequelize = require ('sequelize')
const dbConfig  = require ('../DataBase/Config/config')

const Acao = require('../Model/acao')
const Usuario = require('../Model/usuario')
const Compra = require('../Model/compra')
const Venda = require('../Model/venda')

const connection = new Sequelize(dbConfig)
console.log(`Banco de dados local : ${dbConfig.storage}`)

Venda.init(connection)
Compra.init(connection)
Acao.init(connection)
Usuario.init(connection)

Usuario.associate(connection.models)
Acao.associate(connection.models)
Venda.associate(connection.models)
Compra.associate(connection.models)

module.exports = connection