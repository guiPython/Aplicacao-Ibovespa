const CarteiraDataBase = require('../Model/carteira')
require('../DataBase/index')

//TODO nomeAcao substituir por idAcao e ultilizar o AcaoController somente no Resolver

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

    async insertItem(){
        await CarteiraDataBase.create({
            idUsuario: this.idUsuario,
            idAcao: this.idAcao,
            qtd: this.qtd,
            valorMedio: this.valor
        })
    }

    async updateItem(){
        const oldItem = this._item
        if ( this.operacao == "venda" ){
            var qtd =  oldItem.qtd - this.qtd
        }
        if (this.operacao == "compra" ){
            var qtd =  oldItem.qtd + this.qtd
            var valor  =  (oldItem.valorMedio * oldItem.qtd + this.qtd * this.valor)/(this.qtd + oldItem.qtd)
        }

        await CarteiraDataBase.update(
            {
                qtd:qtd,
                valorMedio: valor
            },
            {
                where:{  
                    idUsuario: this.idUsuario,
                    idAcao: this.idAcao,
                }
            }
        )
        
    }

    async deleteItem(){
        await CarteiraDataBase.destroy({where:{idUsuario:this.idUsuario,idAcao:this.idAcao}})
    }
}


module.exports = CarteiraController