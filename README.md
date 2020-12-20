# Api_IBovespa

Api construida com Apollo-Server , GraphQL , Sequelize e JsonWebToken . Ela persiste dados de uma carteira de determinado usuario, permite consultas para usuarios cadastrados e com tokens validos.

Toda a parte Web de obtencao de dados utiliza os seguintes dominios/ApI:
https://statusinvest.com.br/
https://query1.finance.yahoo.com/v8/finance/chart/none.SA?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@none.SAO&apikey=@keyAlpha
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@none.SAO&outputsize=full&apikey=@keyAlpha

Para utilizar o app e necessario a criacao de uma conta no servico alphaVantage, uma vez com a chave do servico podera fazer uma conta na Api_Ibovespa.

Este app e destinado para pessoas que gostam e acompanham o mercado financeiro, as informacoes obtidas nao sao em tempo real , portanto o app serve de base para a criacao de um servico parecido.

Meus agradecimentos, facam bom uso :)


