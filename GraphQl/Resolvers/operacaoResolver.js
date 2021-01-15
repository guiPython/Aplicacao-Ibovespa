const AcaoController = require('../../Controllers/acaoController')
const OperacaoController = require('../../Controllers/operacaoController')
const UsuarioController = require('../../Controllers/usuarioController')
const CarteiraController = require('../../Controllers/carteiraController')

const resolver = {

    Query:{
        compras: async (_,__,{ validate }) => {

            const { id } = validate()
            const compras = new OperacaoController(id,_,__,_,"compras")

            var registros = await compras.getOperacoes()

            registros = registros.map(i => new Object({
                idAcao: i.idAcao,
                qtd: i.qtd,
                valor: i.valor,
                createdAt: i.createdAt
            }))

            async function loop(registros) {
                let info = []
                for (let i = 0; i < registros.length ; i++) {
                    let acao = await new AcaoController(_,__,registros[i].idAcao).getAcaoByPk()
                    info.push({
                        qtd: registros[i].qtd,
                        nome: acao.nome,
                        empresa: acao.empresa,
                        setor: acao.setor,
                        subsetor: acao.subsetor,
                        valor: registros[i].valor,
                        preco: acao.preco,
                        createdAt: registros[i].createdAt,
                    })
                }
                return info
            }
            
            return await loop(registros)

        },

        vendas: async (_,__,{ validate }) => {
            const { id } = validate()
            const vendas = new OperacaoController(id,_,__,_,"vendas")
            var registros =  await vendas.getOperacoes()

            registros = registros.map(i => new Object({
                idAcao: i.idAcao,
                qtd: i.qtd,
                valor: i.valor,
                createdAt: i.createdAt
            }))

            async function loop(registros) {
                let info = []
                for (let i = 0; i < registros.length ; i++) {
                    let acao = await new AcaoController(_,__,registros[i].idAcao).getAcaoByPk()
                    info.push({
                        qtd: registros[i].qtd,
                        nome: acao.nome,
                        empresa: acao.empresa,
                        setor: acao.setor,
                        subsetor: acao.subsetor,
                        valor: registros[i].valor,
                        preco: acao.preco,
                        createdAt: registros[i].createdAt,
                    })
                }
                return info
            }
            
            return await loop(registros)
        }
    },

    Mutation:{
        addVenda: async (_, { nomeAcao , qtd , valor , data } , {validate}) => {
            const { id } = validate()
            const acao = await new AcaoController(nomeAcao).getAcaoByName()
            const venda = new OperacaoController(id,acao.id,qtd,valor,"vendas",data)
            const registro = new CarteiraController(id,acao.id,qtd,valor,"venda")
            const usuario = new UsuarioController(id)
            const item = await registro.getItem()
            var valorMedio = item.valorMedio
            
            var total = 0

            if ( valorMedio > valor) total = ( valorMedio  )
            else if (valorMedio == valor) total = valorMedio

            if ( item != null){
                let newItem = new CarteiraController(id,acao.id,qtd,valor,"venda",item)
                try{
                    await venda.addOpercao()
                    await usuario.updateSaldo(total*qtd)
                    let historico = await venda.updateHistoricoItem()
                    await newItem.updateItem(historico)
                    return { mensagem: "Venda efetuada com Sucesso"}
                }
                catch{
                    throw new Error("Venda nao efetuada")
                }
            }
        },


        addCompra: async (_, { nomeAcao , qtd , valor , saldo , data } , {validate}) => {
            const { id , keyAlphaVantage } = validate()

            if ( data > Date.now()) throw new Error("Data de compra invalida")

            const registro_acao = new AcaoController(nomeAcao,keyAlphaVantage)
            var acao = await registro_acao.getAcaoByName()
            if ( acao == null ){
                await registro_acao.insertAcao()
            }
            await registro_acao.updateAcao()
            acao = await registro_acao.getAcaoByName()
            const compra = new OperacaoController(id,acao.id,qtd,valor,"compras",data)
            const registro_carteira = new CarteiraController(id,acao.id,qtd,valor,"compra")
            const usuario = new UsuarioController(id)
            const itemCarteira = await registro_carteira.getItem()
            const itemUsuario = await usuario.getUsuario()

            if( itemCarteira != null ){
                let newItem = new CarteiraController(id,acao.id,qtd,valor,"compra",itemCarteira)
                if( saldo ){
                    if ( itemUsuario.saldo - ( valor * qtd) < 0 ){
                        return {mensagem:"Saldo Insuficiente"}
                    }
                    else{
                        await usuario.updateSaldo(-(valor * qtd))
                    }
                }
                let historico = await compra.updateHistoricoItem()
                await newItem.updateItem(historico)
                await compra.addOpercao()
            }
            else{
                if ( saldo ){
                    if ( itemUsuario.saldo - ( valor * qtd) < 0 ){
                        return{mensagem: "Saldo Insuficiente"}
                    }
                    await usuario.updateSaldo(-(valor * qtd))
                }
                await registro_carteira.insertItem(data)
                await compra.addOpercao()
            }
            
            return { mensagem: "Compra efetuada com Sucesso"}
        }
    }

}


module.exports = resolver