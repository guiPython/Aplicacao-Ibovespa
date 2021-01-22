const AcaoDataBase = require('../Model/acao')
const InfoAcao = require('../Web/InfoAcao')
require('../DataBase/index')

class AcaoController {

   constructor(_nomeAcao, keyAlphaVantage, _idAcao) {
      this._nomeAcao = _nomeAcao
      this.keyAlphaVantage = keyAlphaVantage
      this._idAcao = _idAcao
   }

   async deleteAcao() {
      try {
         await AcaoDataBase.destroy({ where: { nome: this._nomeAcao } })
         return `A acao ${this._nomeAcao} foi deletada do banco de dados`
      }
      catch (e) {
         return "NOT FOUND"
      }
   }

   async insertAcao() {
      try {
         const acao = new InfoAcao(this._nomeAcao, this.keyAlphaVantage)
         var [empresa, setor, subsetor] = await acao.getStaticInfo()
         var preco = await acao.getPrice()
         var [open, max, min, close, varPercent] = await acao.getDinamicInfo()
         var timeSeries = await acao.getTimeSeriesJSON()
         var dateJson = new Date()
         await AcaoDataBase.create({ nome: this._nomeAcao, empresa, setor, subsetor, preco, max, min, open, close, timeSeries, dateJson })
         return true
      }
      catch (e) {
         console.log(e)
         return "NOT FOUND"
      }
   }

   async getAcoes() {
      try {
         return await AcaoDataBase.findAll()
      }
      catch {
         return "NOT FOUND"
      }
   }

   async getAcaoByPk() {
      try {
         return await AcaoDataBase.findByPk(this._idAcao)
      }
      catch (e) {
         console.log(e)
         return "NOT FOUND"
      }
   }

   async getAcaoByName() {
      try {
         return await AcaoDataBase.findOne({ where: { nome: this._nomeAcao } })
      }
      catch (e) {
         console.log(e)
         return "NOT FOUND"
      }
   }

   async updateJson(data) {
      try {
         if (Date.parse(Object.keys(data.timeSeries)[0]) + 2 * 86400000 < Date.now()) {
            const acao = new InfoAcao(this._nomeAcao, this.keyAlphaVantage)
            const timeSeries = await acao.getTimeSeriesJSON()
            const dateJson = Date.now()
            await AcaoDataBase.update({ timeSeries, dateJson }, { where: { nome: this._nomeAcao } })
         }
      }
      catch (e) {
         console.log(e)
      }
   }

   async updatePrice(data) {
      // Atualizar so no periodo em que a bolsa esta aberta
      try {
         if (Date.parse(data.updatedAt) + 5 * 60000 < Date.now()) {
            const acao = new InfoAcao(this._nomeAcao, this.keyAlphaVantage)
            const preco = await acao.getPrice()
            await AcaoDataBase.update({ preco }, { where: { nome: this._nomeAcao } })
         }
      }
      catch (e) {
         console.log(e)
      }
   }

   async updateInfo(data) {
      try {
         const date = new Date()
         const dateAtt = Date.parse(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} 18:00:00`)
         if (Date.now() >= dateAtt && Date.parse(data.updatedAt) <= dateAtt) {
            const acao = new InfoAcao(this._nomeAcao, this.keyAlphaVantage)
            const [open, max, min, close, percent] = await acao.getDinamicInfo()
            await AcaoDataBase.update({ open, max, min, close }, { where: { nome: this._nomeAcao } })
         }
      }
      catch (e) {
         console.log(e)
      }
   }

   async updateAcao() {
      var data = await AcaoDataBase.findOne({ where: { nome: this._nomeAcao } })
      try {
         await this.updatePrice(data)
         await this.updateInfo(data)
         await this.updateJson(data)
      }
      catch (e) {
         console.log(e)
      }
   }

}

module.exports = AcaoController