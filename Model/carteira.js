const { DataTypes , Model } = require('sequelize')

class Carteira extends Model{

    static init(sequelize){
        super.init(
            {
                qtd: DataTypes.INTEGER,
                valorMedio: DataTypes.FLOAT,
                historico: DataTypes.JSON
            },

            {
                sequelize,
                tableName:"Carteiras"
            }
        
        )
    }

    static associate (models){
        this.belongsTo(models.Usuario,{foreignKey:"idUsuario"})
        this.belongsTo(models.Acao,{foreignKey:"idAcao"})
    }
}

module.exports = Carteira