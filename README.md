# Aplicação Ibovespa

Aplicação servidor construida com Apollo-Server , GraphQL , Sequelize e JsonWebToken . 

A aplicacao pode ser utilizada para consulta de acoes e suas series historias , acompanhamento de carteiras vendas e compras de usuarios cadastrados.

Toda a parte Web de obtencao de dados utiliza os seguintes dominios/ApI:

    https://statusinvest.com.br/acoes/
    https://statusinvest.com.br/bdrs/
    https://query1.finance.yahoo.com/v8/finance/chart/none.SA
    https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@none.SAO&apikey=@keyAlpha
    https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@none.SAO&outputsize=full&apikey=@keyAlpha

Para utilizar o app e necessario a criacao de uma conta no servico alphaVantage, uma vez com a chave do servico podera fazer uma conta na Api_Ibovespa.

    Para criação de uma chave basta acessar o link abaixo e seguir os passos do cadastro:
    
        https://www.alphavantage.co/support/#api-key

Este app e destinado para pessoas que gostam e acompanham o mercado financeiro, as informacoes obtidas nao sao em tempo real , portanto o app serve de base para a criacao de um servico parecido.

Quando for rodar o projeto de forma local os seguintes comandos devem ser executados:

    npm i -> Intala todas as dependencias do projeto.
    
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

Esta ultima instrucao serve para validar sua requisição. Repare que as querys e mutations funcionam como funcoes onde passamos parametros e recebemos os dados , sendo assim podemos personaliza-las:

Os parametros são todos obrigatorios , porem os dados que voce quer receber são personalizaveis:

 Exemplos:
  
    {acao(nome:"petr4"){nome,empresa,setor,subsetor,preco}} > Retorna o nome, empresa, setor, subsetor e preco do papel petr4
    
    {acoes(nomes:"petr4,prio3,itub4"){nome,empresa,preco}} > Retorna nome, empresa e preco dos papeis , petr4 , prio3 e itub4
    
Até agora vimos mutations e querys para o consumo mais basico de dados , como dito anteriormente um usuario pode criar , manipular e consumir sua carteira,
existem mutations para compras , vendas e atualização de saldo juntamente com uma query da carteira que vou apresentar abaixo:

   Exemplos:

     mutation{addCompra(nome:"prio3",qtd:20,valor:45.36,saldo:false,data:"20/12/2020"){mensagem}}
      
     mutation(addCompra(nome:"prio3",qtd:20,valor:45.36,saldo:true,data:"20/12/2020"){mensagem}}
    
     mutation{addVenda(nome:){mensagem}}
      
     mutation{updateSaldo(){mensagem}}

Meus agradecimentos, facam bom uso :)


