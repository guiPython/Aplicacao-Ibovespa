const OperacaoDataBase = require("../Model/operacao")
const CarteiraController = require("./carteiraController")
const AcaoController = require('../Controllers/acaoController')
require("../DataBase/index")

class OperacaoController {

    constructor(idUsuario , idAcao , qtd , valor , tipo , data ){
        this.idUsuario = idUsuario
        this.idAcao = idAcao
        this.qtd = qtd
        this.valor = valor
        this.tipo = tipo
        this.data = data
    }

    async getOperacoes(){
        if (this.tipo == 'compras'){
            return await OperacaoDataBase.findAll({where:{idUsuario:this.idUsuario,tipo:"compra"}})
        }
        if (this.tipo == "vendas"){
            return await OperacaoDataBase.findAll({where:{idUsuario:this.idUsuario,tipo:"venda"}})
        }
        else{
            return await OperacaoDataBase.findAll({where:{idUsuario:this.idUsuario}})
        }
    }

    async addOpercao(){
        var data = this.data ; const [ dia,mes,ano ] = data.split("/")
        var date = `${ano}-${mes}-${dia}`
        if (this.tipo == "compras"){
            await OperacaoDataBase.create({idUsuario:this.idUsuario,idAcao:this.idAcao,qtd:this.qtd,valor:this.valor,tipo:"compra",data:date})
            return "Operacao cadastrada com Sucesso"
        }
        if (this.tipo == "vendas"){
            await OperacaoDataBase.create({idUsuario:this.idUsuario,idAcao:this.idAcao,qtd:this.qtd,valor:this.valor,tipo:"venda",data:date})
            return "Operacao cadastrada com Sucesso"
        }
        else { throw new Error("Operacao nao Identificada") }
        
    }

    async updateHistoricoItem(){
        const registro_carteira = await new CarteiraController(this.idUsuario,this.idAcao).getItem()
        const registro_acao = await new AcaoController(null,null,this.idAcao).getAcaoByPk()
        const timeSeries = registro_acao.timeSeries


        // Conversoes de Datas
        var [diaCompra,mesCompra,anoCompra] = this.data.split("/")
        var data_compra = Date.parse(`${anoCompra}-${mesCompra}-${diaCompra}`) ; var data_venda = data_compra
        var data = Date.parse(date) ; var date = new Date()

        var historico = registro_carteira.historico; var i = 0 ; var valorMercado = 0
        var keys = Object.keys(registro_carteira.historico).map( i => registro_carteira.historico[i]["data"])
        if ( this.tipo == "compras" ){
            var val = 0 ; var registrosAnteriores = []
            if ( data_compra < Date.parse(keys[0])){
                while ( data_compra < Date.parse(keys[0]) ){
                    let data = new Date(data_compra).toISOString().split("T")[0]
                    try{ val = timeSeries[`${data}`][`4. close`]}
                    catch{ 
                        try{val = timeSeries[`${new Date(data_compra - 24 * 60 * 60 * 1000).toISOString().split("T")[0]}`][`4. close`]} 
                        catch{
                            try{val = timeSeries[`${new Date(data_compra - 48 * 60 * 60 * 1000 ).toISOString().split("T")[0]}`][`4. close`]}
                            catch{ 
                                try{ val = registrosAnteriores[i-1]["dados"].valorMercado}
                                catch{throw new Error("Insira uma data valida")}
                            }
                        }
                    }
                    registrosAnteriores.push({
                        data:`${data}`,
                        dados:{nome:registro_acao.nome , qtd: this.qtd ,valorCarteira: this.valor,valorMercado: val }
                    })
                    data_compra += 24 * 60 * 60 * 1000 ; i++                                                    
                }
                registrosAnteriores = registrosAnteriores.reverse()
                registrosAnteriores.forEach(element => historico.unshift(element))
            }
            keys.forEach( dataHistorico => {
                if ( Date.parse(dataHistorico) >= data_compra ){
                    let registro = historico[i]["dados"]
                    registro.valorMercado = (registro.valorMercado) 
                    registro.valorCarteira = (registro.valorCarteira  + this.valor) / 2
                    historico[i]["dados"].qtd += this.qtd 
                    historico[i]["dados"].valorMercado = registro.valorMercado
                    historico[i]["dados"].valorCarteira = registro.valorCarteira}
                i++
                });

            while ( data_compra <= data ){
            try{
                valorMercado = registro_acao.timeSeries[`${new Date(data_compra).toISOString().split("T")[0]}`]["4. close"] 
            }
            catch{
                valorMercado = historico[i-1]["dados"].valorMercado
            }
                
                historico.push({
                    data:`${new Date(data_compra).toISOString().split("T")[0]}`,
                    dados:{
                        nome : acao.nome,
                        qtd: this.qtd + registro_carteira.qtd ,
                        valorCarteira : (this.valor + ( historico[i][`${new Date(data_compra).toISOString().split("T")[0]}`].valorCarteira )),
                        valorMercado : valorMercado
                    }
                })
                data_compra += 24 * 60 * 60 * 1000 ; i++
            }
        }
            

        if ( this.tipo == "vendas" ){
            if ( data_venda < Date.parse(keys[0]) || data_venda > Date.parse(keys[keys.length-1])){ throw new Error ("Insira uma data valida")}
            else{
                keys.forEach(dataHistorico => {
                    if ( data_venda <= Date.parse(dataHistorico)){
                        let registro = historico[i]["dados"]
                        let qtd = registro.qtd - this.qtd
                        historico[i]["dados"].qtd = qtd
                    }
                    data_venda + 24 *60 *60 *1000 ; i++
                })
            }

            while ( data_venda <= data ){
            try{
                valorMercado = registro_acao.timeSeries[`${new Date(data_compra).toISOString().split("T")[0]}`]["4. close"] 
            }
            catch{
                valorMercado = historico[i-1]["dados"].valorMercado
            }
                
                historico.push({
                    data:`${new Date(data_compra).toISOString().split("T")[0]}`,
                    dados:{
                        nome : acao.nome,
                        qtd: registro_carteira.qtd - this.qtd,
                        valorCarteira : (this.valor + ( historico[i][`${new Date(data_compra).toISOString().split("T")[0]}`].valorCarteira )),
                        valorMercado : valorMercado
                    }
                })
                data_compra += 24 * 60 * 60 * 1000 ; i++
            }
        }
        return historico

    }
}

module.exports = OperacaoController