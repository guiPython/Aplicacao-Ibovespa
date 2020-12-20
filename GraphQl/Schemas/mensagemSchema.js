const { gql } = require('apollo-server')

module.exports = gql `

    type Mensagem {
        mensagem: String
    }

`