const { makeExecutableSchema , mergeTypeDefs , mergeResolvers } = require('graphql-tools')

const AcaoType = require('./Schemas/acaoSchema')
const AcaoResolver = require('./Resolvers/acaoResolver')

const UsuarioType = require('./Schemas/usuarioSchema')
const UsuarioResolver = require('./Resolvers/usuarioResolver')

const OperacaoType = require('./Schemas/operacaoSchema')
const OperacaoResolver = require('./Resolvers/operacaoResolver')

const CarteiraType = require('./Schemas/carteiraSchema')
const CarteiraResolver = require('./Resolvers/carteiraResolver')

const MensagemType = require('./Schemas/mensagemSchema')

const typeDefs = mergeTypeDefs([AcaoType,UsuarioType,CarteiraType,OperacaoType,MensagemType])
const resolvers = mergeResolvers([AcaoResolver,UsuarioResolver,OperacaoResolver,CarteiraResolver])


const schema = makeExecutableSchema({typeDefs , resolvers})


module.exports = { schema , resolvers , typeDefs }
