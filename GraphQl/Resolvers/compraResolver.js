const CompraController = require('../../Controllers/compraController')
const AcaoController = require('../../Controllers/acaoController')

const resolver = {
    Query:{
        compras : async (_,__,{ validate }) => {
            const { id } = validate()
            const compras = new CompraController(id)
            return await compras.getCompras()
        }
    },

    Mutation:{
        addCompra: async (_, { nomeAcao , qtdCompra , valorCompra } , {validate}) => {
            const { id } = validate()
            const compra = new CompraController(id,nomeAcao,qtdCompra,valorCompra)
            await compra.addCompra()
            return await compra.getCompras()
        }
    }
}

module.exports = resolver