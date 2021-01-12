# Api_IBovespa Complete

Api construida com Apollo-Server , GraphQL , Sequelize e JsonWebToken . A aplicacao pode ser utilizada para consulta de acoes.

Toda a parte Web de obtencao de dados utiliza os seguintes dominios/ApI:

https://statusinvest.com.br/
https://query1.finance.yahoo.com/v8/finance/chart/none.SA?region=US&lang=en-US&includePrePost=false&interval=2m&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@none.SAO&apikey=@keyAlpha
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@none.SAO&outputsize=full&apikey=@keyAlpha

Para utilizar o app e necessario a criacao de uma conta no servico alphaVantage, uma vez com a chave do servico podera fazer uma conta na Api_Ibovespa.

Este app e destinado para pessoas que gostam e acompanham o mercado financeiro, as informacoes obtidas nao sao em tempo real , portanto o app serve de base para a criacao de um servico parecido.

Quando for rodar o projeto de forma local os seguintes comandos devem ser executados:

    npm init -> Intalara todas as dependencias do projeto.
    
    npx sequelize db:migrate -> Cria o Banco de Dados Sqlite.
    
    nodemon -> Roda o projeto em localhost:4000.

Se todos os comandos foram executados com sucesso podera abrir a aplicacao e interagir pelo GraphQlPlayground , abaixo tenho algumas querys e mutations prontas:

A primeira Mutation necessaria e a signUp , ela fara seu cadastro no banco de dados:

    mutation{ 
      signUp ( email: "digite aqui seu email hshshs" , senha: "..." , nome: "..." , keyAlphaVantage: "...") 
      {
        keyApi,
        status 
      }
    }

Como podemos observar esta mutation nos retorna uma KeyApi , nosso jwt com algumas informacoes para validacao nas requisicoes.

Se quiser obter os dados de uma acao em espefico podera fazer de duas formas:

    {acao( nome: "prio3" ) { nome , empresa , setor , subsetor , preco , max , min , open , close }}

      OU 
  
    {acoes( nomes: "prio3") { nome , empresa , setor , subsetor , preco , max , min , open , close }}

E no local HttpHeaders devemos digitar o seguinte:

    {
      "authorization":"Insira aqui sua keyApi"
    }

Esta ultima instrucao serve para validar sua requisicao. Repare que as querys e mutations funcionam como funcoes onde passamos parametros e recebemos os dados , sendo assim podemos personaliza-las:

Os parametros sao todos obrigatorios , porem os dados que voce quer receber sao personalizaveis:

  Exemplos:
  
    {acao(nome:"petr4"){nome,empresa,setor,subsetor,preco}} -> Retorna o nome , empresa , setor , subsetor e preco do papel petr4.
    
    {acoes(nomes: "petr4,prio3,itub4"){nome,empresa,preco}} -> Retorna nome , empresa e preco dos papeis , petr4 , prio3 e itub4
    


Meus agradecimentos, facam bom uso :)


