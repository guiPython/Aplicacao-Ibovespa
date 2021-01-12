const OperacaoDataBase = require("../Model/operacao")
require("../DataBase/index")

class OperacaoController {

    constructor(idUsuario , idAcao , qtd , valor , tipo ){
        this.idUsuario = idUsuario
        this.idAcao = idAcao
        this.qtd = qtd
        this.valor = valor
        this.tipo = tipo
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
        if (this.tipo == "compras"){
            await OperacaoDataBase.create({idUsuario:this.idUsuario,idAcao:this.idAcao,qtd:this.qtd,valor:this.valor,tipo:"compra"})
            return "Operacao cadastrada com Sucesso"
        }
        if (this.tipo == "vendas"){
            await OperacaoDataBase.create({idUsuario:this.idUsuario,idAcao:this.idAcao,qtd:this.qtd,valor:this.valor,tipo:"venda"})
            return "Operacao cadastrada com Sucesso"
        }
        else { throw new Error("Operacao nao Identificada") }
        
    }

}

module.exports = OperacaoController