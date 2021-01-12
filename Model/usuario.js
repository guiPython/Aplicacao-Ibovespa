const { Model , DataTypes } = require('sequelize')

class Usuario  extends Model {

    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            keyAlphaVantage: DataTypes.STRING,
            saldo: DataTypes.FLOAT,
        },
            {
            sequelize,
            tableName: "Usuarios",
        })
    }

    static associate(models){
        this.hasMany(models.Carteira,{ foreignKey:"id" })
        this.hasMany(models.Operacao,{foreignKey:"id"})
    }
}

module.exports = Usuario