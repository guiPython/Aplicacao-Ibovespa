const jwt = require('jsonwebtoken')

module.exports = {
    createToken( id , keyAlphaVantage){
        return jwt.sign({ id , keyAlphaVantage } , 'teste' , { expiresIn:'1d' })
    },

    verifyToken( token ){
        return jwt.verify(token,'teste')
    }

}