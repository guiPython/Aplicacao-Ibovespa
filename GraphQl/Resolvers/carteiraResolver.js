const CarteiraController = require("../../Controllers/carteiraController")
const AcaoController = require("../../Controllers/acaoController")

const resolver = {

    Query:{
        Carteira: async (_,__,{validate}) => {
            const { id } = validate()

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
                let info = [] ;
                for (let i = 0; i < registros.length ; i++) {
                    let acao = await new AcaoController(_,__,registros[i].idAcao).getAcaoByPk()
                    info.push({
                        qtd: registros[i].qtd,
                        nome: acao.nome,
                        empresa: acao.empresa,
                        setor: acao.setor,
                        subsetor: acao.subsetor,
                        valorMedio: registros[i].valorMedio,
                        preco: acao.preco,
                        historico: registros[i].historico,
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