const { DataTypes , Model } = require ('sequelize')

class Acao extends Model{
    
    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            empresa: DataTypes.STRING,
            setor: DataTypes.STRING,
            subsetor: DataTypes.STRING,
            preco: DataTypes.FLOAT,
            max: DataTypes.FLOAT,
            min: DataTypes.FLOAT,
            open: DataTypes.FLOAT,
            close: DataTypes.FLOAT,
            timeSeries: DataTypes.JSON,
            dateJson: DataTypes.DATE,
        },
        {
            sequelize,
            tableName: "Acoes",
        })
    }

    static associate(models){
        this.hasMany(models.Carteira,{foreignKey:"idAcao"})
        this.hasMany(models.Operacao,{foreignKey:"idAcao"})
    }
}

module.exports = Acao