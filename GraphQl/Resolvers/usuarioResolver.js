const bcrypt = require('bcrypt')
const UsuarioController = require('../../Controllers/usuarioController')
const { createToken } = require('../../Service/auth')
var status = "Ativo"

const resolvers = {

    Query: {
        signIn: async (_,{ email , senha }) => {

            const usuario  = new UsuarioController(" ",email,senha)
            const dados =  await usuario.getUsuario()

            if (dados == null){
                throw new Error('Email/Senha Invalidos')
            }

            const hash = dados.senha

            if ( ! await bcrypt.compare(senha,hash) ){
                throw new Error('Email/Senha Invalidos')
            }

            const keyAPi = createToken(dados.id,dados.keyAlphaVantage)

            return { keyAPi , status  , nome: dados.nome , saldo: dados.saldo}
        }
    },

    Mutation: {
        signUp: async (_,{email,senha,nome,keyAlphaVantage}) => {

            const usuario  = new UsuarioController(" ",email,senha,nome,keyAlphaVantage)
            var dados = await usuario.getUsuario()
            if ( dados != null ){
                throw new Error('O usuario ja foi cadastrado')
            }
            await usuario.insertUsuario()
            dados = await usuario.getUsuario()
            const keyAPi = createToken( dados.id , dados.keyAlphaVantage )
            return { keyAPi , status , }
            

        },

        deleteUsuario: async (_,{email,senha},{validate}) => {
            
            const { id } = validate()
            const usuario  = new UsuarioController(id)
            

            const dados = await usuario.getUsuario()
            console.log(dados.id)
            if (email != dados.email){
                throw new Error('Email/Senha Invalidos')
            }

            const hash =  dados.senha
            if ( ! await bcrypt.compare(senha,hash) ){
                throw new Error('Email/Senha Invalidos')
            }

            await usuario.deleteUsuario()

            return { status: "Inativo "}
        },

        updatePassword: async (_,{email,newSenha}) => {
            const usuario  = new UsuarioController(" ",email,newSenha)
            const dados = await usuario.getUsuario()
            if (email != dados.email){
                throw new Error('Email Invalido')
            }
            await usuario.updateUsuario()
            const keyAPi = createToken(dados.id);
            return {keyAPi , status}
        },

        updateSaldo: async(_,{ valor },{validate}) => {
            const { id } = validate()
            const usuario = new UsuarioController(id)
            try{
                await usuario.updateSaldo(valor)
                return { mensagem: "Saldo atualizado com Sucesso "}
            }
            catch{
                throw new Error("Falha ao atualizar o saldo")
            }
        }
    }

}

module.exports = resolvers