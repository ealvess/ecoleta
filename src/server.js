const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//configruar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})


//configurar cominhos da aplicação
//pagina inicial
//req: requisição
//res: resposta
server.get("/", (req, res) => {
  return res.render("index.html", { title: "teste" })
})

server.get("/create-point", (req, res) => {

  //req.query: Query Strings da nossa url
  //console.log(req.query)

  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
  //req.body: o corpo do formulário
  //console.log(req.body)

  //inserir dados no banco de dados
  //inserir dados na tabela
  const query = `
  INSERT INTO places(
    image, 
    name, 
    address, 
    address2, 
    state, 
    city, 
    items
  ) VALUES (?,?,?,?,?,?,?);
`
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ]

  function afterInsertData(err) {
    if (err) {
      return console.log(err)
    }
    console.log("Cadastrado com sucesso")
    console.log(this)

    return res.render("create-point.html", {saved: true})
  }
  db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {
  const search = req.query.search

  if(search == ""){
    //pesquisa vazia
    //mostrar a pagina html com os dados do banco de dados
    return res.render("search-result.html",  {total:0})
  }


  //buscando dados no banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }
    const total = rows.length
    //mostrar a pagina html com os dados do banco de dados
    return res.render("search-result.html", { places: rows, total })
  })
})


//ligar servidor
server.listen(3000)