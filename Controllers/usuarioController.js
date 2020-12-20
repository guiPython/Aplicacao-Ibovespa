const UsuarioDataBase = require('../Model/usuario')
const bcrypt = require('bcrypt')
require('../DataBase/index')

class UsuarioController {
    constructor(id,_email,_senha,_nome,_keyAlphaVantage){
        this.id = id
        this._email = _email
        this._senha = _senha
        this._nome = _nome
        this._keyAlphaVantage = _keyAlphaVantage
    }


    async getUsuario(){
        try{
            if ( this.id == " "){
                return await UsuarioDataBase.findOne({where:{email:this._email}})
            }
            else{
                return await UsuarioDataBase.findByPk(this.id)
            }
            
        }
        catch{
            throw new Error ('O usuario nao existe')
        }
    }
    
    async insertUsuario(){
        try{
            const senha =  await bcrypt.hash(this._senha,10)
            await UsuarioDataBase.create({email:this._email,nome:this._nome,senha,keyAlphaVantage:this._keyAlphaVantage})
        }
        catch(e){
            throw new Error('Nao foi possivel cadastrar o Usuario')
        }
    }

    async changePassword(){

        try{
            const senha = await bcrypt.hash(this._senha,10)
            await UsuarioDataBase.update({senha},{where:{email: this._email}})
        }
        catch{
            throw new Error('O email inserido nao foi registrado')
        }
    }

    async updateSaldo(valor){
        try{
            const usuario = await UsuarioDataBase.findByPk(this.id)
            const total = valor + usuario.saldo
            await UsuarioDataBase.update({saldo: total },{where:{id:this.id}})
        }
        catch{
            throw new Error("Falha ao atualizar Saldo");
        }
    }

    async deleteUsuario(){
        try{
            await UsuarioDataBase.destroy({where: {id: this.id}})
        }
        catch{
            throw new Error('Nao foi possivel deletar o usuario')
        }
    }
}

module.exports = UsuarioController