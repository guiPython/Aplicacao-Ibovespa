const { ApolloServer } = require('apollo-server')
const { typeDefs ,  resolvers } = require('./GraphQl/schema')
const { verifyToken } = require('./Service/auth')

const server = new ApolloServer({ typeDefs, resolvers , context: ({req}) => {
    const token = req.headers.authorization || "" ; 
    return {
        validate(){
            try{
                const { id , keyAlphaVantage } = verifyToken(token)
                return { id , keyAlphaVantage}
            }
            catch{
                throw new Error("Voce nao esta autenticado")
            }
        }
    }
}})

server.listen().then(({ url }) => {
    console.log(`Servidor rodando em ${url}`);
});