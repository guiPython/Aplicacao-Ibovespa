const CarteiraDataBase = require('../Model/carteira')
const AcaoController = require('../Controllers/acaoController')
require('../DataBase/index')

class CarteiraController {
    constructor(idUsuario,idAcao,qtd,valor,operacao,_item){
        this.idUsuario = idUsuario
        this.idAcao = idAcao
        this.qtd = qtd
        this.valor = valor
        this.operacao = operacao
        this._item = _item
    }

    async getCarteira(){
        return await CarteiraDataBase.findAll({where:{idUsuario:this.idUsuario}})
    }

    async getItem(){
        const item = await CarteiraDataBase.findOne({where:{idUsuario:this.idUsuario,idAcao:this.idAcao}})
        if (item == null ) return null
        return item
    }
    
    async insertItem(dataCompra){
        var date = new Date() ; var month = date.getMonth()+1
        date = `${date.getFullYear()}-${ month >= 10 ? month : "0" + month }-${date.getDate()}`
        var acao = new AcaoController(null,null,this.idAcao) ; acao = await acao.getAcaoByPk()

        var [diaCompra,mesCompra,anoCompra,] = dataCompra.split("/")
        var historico = [] ; var data_compra = Date.parse(`${anoCompra}-${mesCompra}-${diaCompra}`)
        var i = 0 ; var data = Date.parse(date) ; var valorMercado = 0

        while ( data_compra <= data ){
            try{
                valorMercado = acao.timeSeries[`${new Date(data_compra).toISOString().split("T")[0]}`]["4. close"]
            }
            catch{
                valorMercado = historico[i-1]["dados"].valorMercado
            }
                
                historico.push({
                    data:`${new Date(data_compra).toISOString().split("T")[0]}`,
                    dados:{
                        nome : acao.nome,
                        qtd: this.qtd,
                        valorCarteira : this.valor,
                        valorMercado : valorMercado
                    }
                })
                data_compra += 24 * 60 * 60 * 1000 ; i++
        }

        
        await CarteiraDataBase.create({
            idUsuario: this.idUsuario,
            idAcao: this.idAcao,

            qtd: this.qtd,
            valorMedio: this.valor,
            historico
        })
    }

    async updateItem(historico){
        const oldItem = this._item
        var qtd , valor = 0
        if ( this.operacao == "venda" ){
            if ( this.qtd != oldItem.qtd){ valor = oldItem.valorMedio }
            var qtd =  oldItem.qtd - this.qtd
        }
        if (this.operacao == "compra" ){
            var qtd =  oldItem.qtd + this.qtd
            var valor  =  (oldItem.valorMedio * oldItem.qtd + this.qtd * this.valor)/(this.qtd + oldItem.qtd)
        }

        await CarteiraDataBase.update(
            {
                qtd:qtd,
                valorMedio: valor,
                historico: historico
            },
            {
                where:{  
                    idUsuario: this.idUsuario,
                    idAcao: this.idAcao,
                }
            }
        )
        
    }

    async updateHistory(){

        let registro_carteira = await CarteiraDataBase.findOne({where:{idUsuario: this.idUsuario, idAcao: this.idAcao}})
        let dateAt = Date.parse(new Date(Date.now()).toISOString().split("T")[0] + " 18:00:00")
        let updatedAt = Date.parse(registro_carteira.updatedAt)
        let valorMercado = null
        let registro_acao = await new AcaoController(null,null,this.idAcao).getAcaoByPk()
        let historico = registro_carteira.historico
        var i = 0
        if (  updatedAt <= dateAt ){
            let lastDateAt = Date.parse(historico[historico.length - 1].data)
            while ( lastDateAt < dateAt) {
            try{
                valorMercado = registro_acao.timeSeries[`${new Date(lastDateAt).toISOString().split("T")[0]}`]["4. close"] 
            }
            catch{
                valorMercado = historico[i-1]["dados"].valorMercado
            }
                historico.push(
                    {
                        data:new Date(lastDateAt).toISOString().split("T")[0],
                        dados:{
                            qtd: historico[i].dados.qtd,
                            valorMercado:valorMercado,
                            valorCarteira: historico[i].dados.valorCarteira
                        }
                    })
                lastDateAt += 24 * 60 * 60 * 1000 ; i++
            }

            await CarteiraDataBase.update(
            {
                historico: historico
            },
            {
                where:{
                    idUsuario: this.idUsuario,
                    idAcao: this.idAcao
                }
            })

            return historico
        }  
        else{
            return registro_carteira.historico
        }
    }

    async deleteItem(){
        await CarteiraDataBase.destroy({where:{idUsuario:this.idUsuario,idAcao:this.idAcao}})
    }
}


module.exports = CarteiraController