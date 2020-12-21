const AcaoController = require('../../Controllers/acaoController')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
// TODO sleep nos requests do resolver acoes

const resolvers = {
    Query:{
        acao: async (_, {nome} , { validate } ) => {

            const { keyAlphaVantage } = validate()
            const acao = new AcaoController(nome,keyAlphaVantage) ; 
            if ( await acao.getAcaoByName() == null ){
                await acao.insertAcao()
            }
            else {
                await acao.updateAcao()
            }
            return await acao.getAcaoByName() 
        },

        acoes: async (_,{ nomes },{validate}) => { 

            const nomeAcoes = nomes.split(",")
            const { keyAlphaVantage } = validate()
            var acao = new AcaoController( null ,keyAlphaVantage)

            async function loop(nomeAcoes) {
                for (let i = 0; i < nomeAcoes.length ; i++) {
                    await new Promise(resolve => setTimeout(resolve, 10000));
                    acao = new AcaoController(nomeAcoes[i],keyAlphaVantage)
                    if ( await acao.getAcaoByName() == null ){
                        await acao.insertAcao()
                    }
                    else{
                        await acao.updateAcao()
                    }
                }
            }

            return await loop(nomeAcoes).then( async () => { return await acao.getAcoes() })

        },

    },
    JSON:GraphQLJSON,
    JSONObject:GraphQLJSONObject,
}

module.exports = resolvers