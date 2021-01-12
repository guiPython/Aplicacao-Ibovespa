const {gql} = require('apollo-server')

module.exports = gql`

    scalar JSON
    scalar JSONObject

    type Acao {
        id: ID
        nome: String
        empresa: String
        setor: String
        subsetor: String
        preco: Float
        max: Float
        min: Float
        open: Float
        close: Float
        timeSeries: JSONObject
        updatedAt: String
        dateJson: String

    }
    type Query {
        acao( nome: String! ): Acao
        acoes: [Acao]
    }
    type Mutation {
        createAcao(nome: String!): Acao
        deleteAcao(nome: String!): Acao
    }
`

