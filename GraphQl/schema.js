const { makeExecutableSchema , mergeTypeDefs , mergeResolvers } = require('graphql-tools')

const AcaoType = require('./Schemas/acaoSchema')
const AcaoResolver = require('./Resolvers/acaoResolver')

const UsuarioType = require('./Schemas/usuarioSchema')
const UsuarioResolver = require('./Resolvers/usuarioResolver')

const MensagemType = require('./Schemas/mensagemSchema')

const typeDefs = mergeTypeDefs([AcaoType,UsuarioType,MensagemType])
const resolvers = mergeResolvers([AcaoResolver,UsuarioResolver])


const schema = makeExecutableSchema({typeDefs , resolvers})


module.exports = { schema , resolvers , typeDefs }
