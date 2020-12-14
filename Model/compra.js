const {DataTypes , Model } = require("sequelize")

class Compra extends Model{

    static init(sequelize){

        super.init({
            qtdCompra: DataTypes.INTEGER,
            valorCompra: DataTypes.FLOAT,
        },
        {
            sequelize,
            tableName:"Compras"
        })
    }

    static associate(models){
        this.belongsTo(models.Usuario,{foreignKey:"idUsuario"})
        this.belongsTo(models.Acao,{foreignKey:"idAcao"})
    }
}

module.exports = Compra