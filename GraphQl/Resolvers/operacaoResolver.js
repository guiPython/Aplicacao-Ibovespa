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
        addVenda: async (_, { nomeAcao , qtd , valor } , {validate}) => {
            const { id } = validate()
            const acao = await new AcaoController(nomeAcao).getAcaoByName()
            const venda = new OperacaoController(id,acao.id,qtd,valor,"vendas")
            const registro = new CarteiraController(id,acao.id,qtd,valor,"venda")
            const usuario = new UsuarioController(id)
            const item = await registro.getItem()
            var valorMedio = item.valorMedio
            console.log(valorMedio)

            if(item != null){
                if(item.qtd == qtd){
                    try{
                        await venda.addOpercao()
                        await usuario.updateSaldo((valor - valorMedio)*qtd)
                        await registro.deleteItem()
                        return { mensagem: "Venda efetuada com Sucesso"}
                    }
                    catch{
                        throw new Error("Venda nao efetuada")
                    }
                }
                if(item.qtd > qtd){
                    let newItem  =  new CarteiraController(id,acao.id,qtd,valor,"venda",item)
                    try{
                        await newItem.updateItem()
                        await venda.addOpercao()
                        await usuario.updateSaldo((valor - valorMedio) * qtd)
                        return { mensagem: "Venda efetuada com Sucesso"}
                    }
                    catch{
                        throw new Error("Venda nao efetuada")
                    }
                }
                else{
                    return {mensagem : "Venda nao efetuada"}
                }
            }
            else{
                return {mensagem : "Venda nao efetuada"}
            }
            
        },

        addCompra: async (_, { nomeAcao , qtd , valor , saldo } , {validate}) => {
            const { id , keyAlphaVantage } = validate()
            const registro_acao = new AcaoController(nomeAcao,keyAlphaVantage)
            var acao = await registro_acao.getAcaoByName()
            if ( acao == null ){
                await registro_acao.insertAcao()
            }
            acao = await registro_acao.getAcaoByName()
            const compra = new OperacaoController(id,acao.id,qtd,valor,"compras")
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
                await newItem.updateItem()
                await compra.addOpercao()
            }
            else{
                if ( saldo ){
                    if ( itemUsuario.saldo - ( valor * qtd) < 0 ){
                        return{mensagem: "Saldo Insuficiente"}
                    }
                    await usuario.updateSaldo(-(valor * qtd))
                }
                await registro_carteira.insertItem()
                await compra.addOpercao()
            }
            
            return { mensagem: "Compra efetuada com Sucesso"}
        }
    }

}


module.exports = resolver