const cheerio = require('cheerio')
const axios = require('axios')


class InfoAcao {

    constructor( nomeAcao , _keyAlphaVantage ,_linkStatusInvest,_linkYahooFinance,_linkAlphaVantage,_linkAlphaVantageTimeSeries ){
        this.nomeAcao = nomeAcao
        this._linkAlphaVantage = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@none.SAO&apikey=@keyAlpha"
        this._linkYahooFinance = "https://query1.finance.yahoo.com/v8/finance/chart/none.SA?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance"
        this._linkStatusInvest = "https://statusinvest.com.br/acoes/@none"
        this._linkAlphaVantageTimeSeries = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@none.SAO&outputsize=full&apikey=@keyAlpha"
        this._keyAlphaVantage = _keyAlphaVantage
    };

    async getStaticInfo(){
        try {
            return axios.get(this._linkStatusInvest.replace('@none',this.nomeAcao)).then( response => {
            let $ = cheerio.load(response.data)
            let empresa = $("h1.lh-4").attr("title");
            let setor = $("div.pr-md-2").find("strong.value").first().text();
            let subsetor = $("div.pl-md-2").find("strong.value").eq(1).text();
            return [String(empresa), String(setor) , String(subsetor)]})
        }
        catch {
            return 'Not Found'
        }
    }

    async getPrice(){
        try {
            return axios.get(this._linkYahooFinance.replace('none',this.nomeAcao)).then( response => {
                return response.data['chart']['result'][0]['meta']['regularMarketPrice']
            })
        }
        catch{
            return 'Not Found'
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
            return 'Not Found'
        }

    }

    async getTimeSeriesJSON(){
        try {
            return axios.get(this._linkAlphaVantageTimeSeries.replace('@none',this.nomeAcao).replace('@keyAlpha',this._keyAlphaVantage)).then( response => {
                return response.data['Time Series (Daily)']
            })
        }
        catch {
            return 'Not Found'
        }
    }

}

async function teste_GetStaticInfo( nomeAcao ) {  
    const acao = new InfoAcao(nomeAcao) ; 
    const info = await acao.getStaticInfo() ; 
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

//teste_GetTimeSerieJSON('prio3')

module.exports = InfoAcao
