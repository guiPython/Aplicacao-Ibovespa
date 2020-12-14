const {gql} = require('apollo-server')
module.exports = gql`

    type Usuario {
        keyAPi: String
        status: String
    }

    type Query {
        signIn( email: String! , senha: String!) : Usuario
    }

    type Mutation {
        signUp( email: String! , senha: String! , nome: String! , keyAlphaVantage: String! ): Usuario
        deleteUsuario( email: String! , senha: String! ): Usuario
        updateUsuario( email: String! , newSenha: String! ): Usuario
    }

`