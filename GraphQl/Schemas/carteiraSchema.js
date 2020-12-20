const { gql } = require("apollo-server")

module.exports = gql `

    type Carteira {
        qtd: Int,
        nome: String,
        empresa: String,
        setor: String,
        subsetor: String,
        valorMedio: Float,
        preco: Float,
        max: Float,
        min: Float,
        open: Float,
        close: Float,
        updatedAt: String,
    }

    type Query {
        Carteira: [Carteira]
    }

`