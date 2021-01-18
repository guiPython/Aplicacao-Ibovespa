# Aplicação Ibovespa

Aplicação servidor construida com Apollo-Server , GraphQL , Sequelize e JsonWebToken . 

A aplicacao pode ser utilizada para consulta de acoes e suas series historias , acompanhamento de carteiras vendas e compras de usuarios cadastrados.

Toda a parte Web de obtencao de dados utiliza os seguintes dominios/ApI:

    https://statusinvest.com.br/acoes/
    https://statusinvest.com.br/bdrs/
    https://query1.finance.yahoo.com/v8/finance/chart/none.SA
    https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=@.SAO&apikey=@key
    https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=@.SAO&outputsize=full&apikey=@key

Para utilizar o app e necessario a criação de uma conta no servico alphaVantage, uma vez com a chave do servico podera fazer uma conta na Api_Ibovespa.

    Para criação de uma chave basta acessar o link abaixo e seguir os passos do cadastro:
    
        https://www.alphavantage.co/support/#api-key

Este app e destinado para pessoas que gostam e acompanham o mercado financeiro, as informações obtidas não são em tempo real, portanto o app serve de base para a criação de um servico parecido.

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

Como podemos observar esta mutation nos retorna uma KeyApi , nosso jwt com algumas informações para validação nas requisições.

Se quiser obter os dados de uma ação em espefico podera fazer de duas formas:

    {acao( nome: "prio3" ) { nome , empresa , setor , subsetor , preco , max , min , open , close }}

      OU 
  
    {acoes( nomes: "prio3") { nome , empresa , setor , subsetor , preco , max , min , open , close }}

E no local HttpHeaders devemos digitar o seguinte:

    {
      "authorization":"Insira aqui sua keyApi"
    }

Esta ultima instrução serve para validar sua requisição. Repare que as querys e mutations funcionam como funções onde passamos parametros e recebemos os dados , sendo assim podemos personaliza-las:

Os parametros são todos obrigatorios , porem os dados que você recebe são personalizaveis:

 Exemplos:
  
    I) {acao(nome:"petr4"){nome,empresa,setor,subsetor,preco}}
    
    II) {acoes(nomes:"petr4,prio3,itub4"){nome,empresa,preco}}
    
Até agora vimos mutations e querys para o consumo mais basico de dados , como dito anteriormente um usuario pode criar , manipular e consumir sua carteira,
existem mutations para compras , vendas e atualização de saldo juntamente com uma query da carteira que vou apresentar abaixo:

   Exemplos:

     I)   mutation{addCompra(nome:"prio3",qtd:20,valor:45.36,saldo:false,data:"20/12/2020"){mensagem}}
      
     II)  mutation(addCompra(nome:"prio3",qtd:20,valor:45.36,saldo:true,data:"20/12/2020"){mensagem}}
    
     III) mutation{addVenda(nome:"prio3",qtd:20,valor:50.36,data:"21/12/2020"){mensagem}}
      
     IV)  mutation{updateSaldo(){mensagem}}

Meus agradecimentos, facam bom uso :)


