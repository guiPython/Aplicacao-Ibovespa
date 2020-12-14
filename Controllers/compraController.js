const CompraDataBase = require('../Model/compra');
const AcaoController = require('../Controllers/acaoController');
const Usuario = require('../Model/usuario');
const Acao = require('../Model/acao');
require('../DataBase/index')

class CompraController {

    constructor( idUsuario , nomeAcao , qtdCompra , valorCompra ){
        this.idUsuario = idUsuario;
        this.nomeAcao = nomeAcao;
        this.qtdCompra = qtdCompra;
        this.valorCompra = valorCompra
    }

    async addCompra(){
        console.log(this.nomeAcao)
        const idAcao = await new AcaoController(this.nomeAcao).getAcao()
        await CompraDataBase.create({
            idUsuario:this.idUsuario,
            idAcao:idAcao.id,
            qtdCompra:this.qtdCompra,
            valorCompra:this.valorCompra
            }
        )
        return true
    }

    async getCompras(){
        return CompraDataBase.findAll({where:{idUsuario:this.idUsuario}})
    }
}

module.exports = CompraController