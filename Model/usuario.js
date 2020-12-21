const { Model , DataTypes } = require('sequelize')

class Usuario  extends Model {

    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            keyAlphaVantage: DataTypes.STRING,
        },
            {
            sequelize,
            tableName: "Usuarios",
        })
    }
}

module.exports = Usuario