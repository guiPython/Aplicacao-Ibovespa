const { gql } = require("apollo-server")

module.exports = gql`

    type Operation {
        tipo: String,
        qtd: Int,
        nome: String,
        empresa: String,
        setor: String,
        subsetor: String,
        valor: Float,
        preco: Float,
        createdAt: String,
    }

    type Query {
        vendas: [Operation]
        compras: [Operation]
    }

    type Mutation {
        addVenda ( nomeAcao: String! , qtd: Int! , valor: Float! , data: String!) : Mensagem
        addCompra ( nomeAcao: String! , qtd: Int! , valor: Float! , saldo: Boolean! , data: String!) : Mensagem
    }

`