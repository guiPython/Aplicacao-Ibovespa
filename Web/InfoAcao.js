const cheerio = require('cheerio')
const axios = require('axios')


class InfoAcao {

    constructor( nomeAcao , _keyAlphaVantage ,_linkStatusInvestAcoes,_linkStatusInvestBDRs,_linkYahooFinance,_linkAlphaVantage,_linkAlphaVantageTimeSeries ){
        this.nomeAcao = nomeAcao
        this._linkAlphaVantage = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@none.SAO&apikey=@keyAlpha"
        this._linkYahooFinance = "https://query1.finance.yahoo.com/v8/finance/chart/none.SA?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance"
        this._linkStatusInvestAcoes = "https://statusinvest.com.br/acoes/@none"
        this._linkStatusInvestBDRs = "https://statusinvest.com.br/bdrs/@none"
        this._linkAlphaVantageTimeSeries = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@none.SAO&outputsize=full&apikey=@keyAlpha"
        this._keyAlphaVantage = _keyAlphaVantage
    };

    async verifyTick(){
        let cTick = this.nomeAcao.length
        if ( cTick == 5 ) return "Acoes"
        if ( cTick == 6 ) {
            let numTick = this.nomeAcao.slice(-2)
            if( ["34","35"].includes(numTick) ) return "BDRs"
            else if (["11","12"].includes(numTick)) return "Acoes"
            else { throw new Error("Insira um codigo valido") }
        }
        
    }

    async getStaticInfo(){
        try {
            let tick = await this.verifyTick()
            if ( tick == "BDRs"){ var url = this._linkStatusInvestBDRs.replace('@none',this.nomeAcao) }
            if ( tick == "Acoes"){ var url = this._linkStatusInvestAcoes.replace("@none",this.nomeAcao)}
            return axios.get(url).then( response => {
            let $ = cheerio.load(response.data)
            let empresa = $("h1.lh-4").attr("title");
            let setor = $("div.pr-md-2").find("strong.value").first().text();
            let subsetor = $("div.pl-md-2").find("strong.value").eq(1).text();
            return [String(empresa), String(setor) , String(subsetor)]})
        }
        catch {
            throw new Error("Not Found")
        }
    }

    async getPrice(){
        try {
            return axios.get(this._linkYahooFinance.replace('none',this.nomeAcao)).then( response => {
                return response.data['chart']['result'][0]['meta']['regularMarketPrice']
            })
        }
        catch{
            throw new Error("Not Found")
        }
    }

    async getDinamicInfo(){
        try {
            return axios.get(this._linkAlphaVantage.replace('@none',this.nomeAcao).replace('@keyAlpha',this._keyAlphaVantage)).then( response => {
                let dados  = response.data['Global Quote']
                let open = dados['02. open']
                let high = dados['03. high']
                let low = dados['04. low']
                let close = dados['08. previous close']
                let varPercent = dados['10. change percent']
                return [open , high , low , close , varPercent ]
            })
        }
        catch {
            throw new Error("Not Found")
        }

    }

    async getTimeSeriesJSON(){
        try {
            return axios.get(this._linkAlphaVantageTimeSeries.replace('@none',this.nomeAcao).replace('@keyAlpha',this._keyAlphaVantage)).then( response => {
                return response.data['Time Series (Daily)']
            })
        }
        catch {
            throw new Error("Not Found")
        }
    }

}

async function teste_GetStaticInfo( nomeAcao ) {  
    const acao = new InfoAcao(nomeAcao) ; 
    const info = await acao.getStaticInfo() ; 
    console.log()
    console.log(`Empresa: ${info[0]}\nSetor: ${info[1]}\nSubSetor: ${info[2]}`) 
}

async function teste_GetPrice( nomeAcao ) {       
    const acao = new InfoAcao(nomeAcao) ; 
    const price = await acao.getPrice();
    console.log(`A Acao ${nomeAcao.toUpperCase()} tem o valor de R$${price}`)

}

async function teste_GetDinamicInfo ( nomeAcao ) {
    const acao = new InfoAcao(nomeAcao) ; 
    const info = await acao.getDinamicInfo();
    var desc = ['open' , 'high' , 'low' , 'close' , 'varPercent' ]
    for ( var i = 0 ; i< desc.length; i++) {
        console.log(`${desc[i].toUpperCase()}: ${info[i]}`)
    };
}

async function teste_GetTimeSerieJSON( nomeAcao ){
    const acao = new InfoAcao(nomeAcao) ; 
    const info = await acao.getTimeSeriesJSON();
    console.log(info)
}
//["prio3","petr4","aapl34","meli34"].forEach(x => {teste_GetStaticInfo(x)})


module.exports = InfoAcao
