const CarteiraController = require("../../Controllers/carteiraController")
const AcaoController = require("../../Controllers/acaoController")

const resolver = {

    Query: {
        Carteira: async (_, __, { validate }) => {
            const { id, keyAlphaVantage } = validate()

            const carteira = new CarteiraController(id)
            var registros = await carteira.getCarteira()

            registros = registros.map(i => new Object({
                idAcao: i.idAcao,
                qtd: i.qtd,
                valorMedio: i.valorMedio,
                historico: i.historico,
                updatedAt: i.updatedAt
            }))


            async function loop(registros) {
                let info = [];
                for (let i = 0; i < registros.length; i++) {
                    let registro_acao = new AcaoController(null, null, registros[i].idAcao)
                    let acao = await registro_acao.getAcaoByPk()
                    registro_acao._nomeAcao = acao.nome; registro_acao.keyAlphaVantage = keyAlphaVantage
                    await registro_acao.updateAcao()
                    acao = await registro_acao.getAcaoByName()
                    carteira.idAcao = registros[i].idAcao
                    let historico = await carteira.updateHistory()
                    info.push({
                        qtd: registros[i].qtd,
                        nome: acao.nome,
                        empresa: acao.empresa,
                        setor: acao.setor,
                        subsetor: acao.subsetor,
                        valorMedio: registros[i].valorMedio,
                        preco: acao.preco,
                        historico: historico,
                        min: acao.min,
                        max: acao.max,
                        open: acao.open,
                        close: acao.close,
                        updatedAt: registros[i].updatedAt,
                    })
                }
                return info
            }

            return await loop(registros)

        }
    }

}

module.exports = resolver