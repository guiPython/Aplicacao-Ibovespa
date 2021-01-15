const AcaoController = require('../../Controllers/acaoController')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');

const resolvers = {
    Mutation:{
        acao: async (_, {nome} , { validate } ) => {

            const { keyAlphaVantage } = validate()
            const acao = new AcaoController(nome,keyAlphaVantage) ;
            if ( await acao.getAcaoByName() ){
                await acao.updateAcao()
            }
            else{
                await acao.insertAcao()
            }
            return await acao.getAcaoByName() 
        },

        acoes: async (_,{nomes},{validate}) => { 
            const { keyAlphaVantage } = validate()
            var acao = new AcaoController( null ,keyAlphaVantage)

            async function loop(nomeAcoes,listaAcoes) {
                var listaAcoes = []
                for (let i = 0; i < nomeAcoes.length ; i++) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    acao = new AcaoController(nomeAcoes[i],keyAlphaVantage)
                    if ( await acao.getAcaoByName() ){
                        await acao.updateAcao()
                    }
                    else{
                        await acao.insertAcao()
                    }
                    listaAcoes.push(acao.getAcaoByName())
                }
                return listaAcoes
            }

            if ( nomes == null ){
                let info = await acao.getAcoes()
                let nomeAcoes = info.map(i => i.nome)
                return await loop(nomeAcoes)
            }

            else{
                let nomeAcoes = nomes.split(",")
                return await loop(nomeAcoes)
            }

        },

    },
    JSON:GraphQLJSON,
    JSONObject:GraphQLJSONObject,
}

module.exports = resolvers