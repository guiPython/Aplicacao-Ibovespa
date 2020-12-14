const {gql} = require('apollo-server')

module.exports = gql`
    type Compra {
        idAcao: Int,
        qtdCompra: Int,
        valorCompra: Float,
    }

    type Query {
        compras: [Compra]
    }

    type Mutation {
        addCompra ( nomeAcao: String! , qtdCompra: Int! , valorCompra: Float! ) : [ Compra ]
    }
`