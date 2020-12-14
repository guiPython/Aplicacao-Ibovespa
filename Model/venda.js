const { DataTypes , Model } = require('sequelize')

class Venda extends Model {

    static init(sequelize){

        super.init({
            qtdVenda: DataTypes.INTEGER,
            valorVenda: DataTypes.FLOAT,
        },
        {
            sequelize,
            tableName: "Vendas",
        })
    }

    static associate(models){
        this.belongsTo(models.Usuario,{foreignKey:"idUsuario"})
        this.belongsTo(models.Acao,{foreignKey:"idAcao"})
    }
}


module.exports = Venda