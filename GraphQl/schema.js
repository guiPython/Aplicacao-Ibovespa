const { makeExecutableSchema , mergeTypeDefs , mergeResolvers } = require('graphql-tools')

const AcaoType = require('./Schemas/acaoSchema')
const AcaoResolver = require('./Resolvers/acaoResolver')

const UsuarioType = require('./Schemas/usuarioSchema')
const UsuarioResolver = require('./Resolvers/usuarioResolver')

const CompraType = require('./Schemas/compraSchema')
const CompraResolver = require('./Resolvers/compraResolver')

const typeDefs = mergeTypeDefs([AcaoType,UsuarioType,CompraType,])
const resolvers = mergeResolvers([AcaoResolver,UsuarioResolver,CompraResolver,])


const schema = makeExecutableSchema({typeDefs , resolvers})


module.exports = { schema , resolvers , typeDefs }
