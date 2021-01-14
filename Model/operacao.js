const { DataTypes , Model } = require("sequelize")

class Operacao extends Model {
    static init(sequelize){
        super.init(

        {
            tipo: DataTypes.STRING,
            qtd:  DataTypes.INTEGER,
            valor: DataTypes.FLOAT,
            data: DataTypes.DATE
        },

        {
            sequelize,
            tableName: "Operacoes"
        }
        )
    }

    static associate(models){
        this.belongsTo(models.Usuario,{foreignKey:"idUsuario"})
        this.belongsTo(models.Acao,{foreignKey:"idAcao"})
    }
}

module.exports = Operacao