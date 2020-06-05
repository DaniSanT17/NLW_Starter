const express = require('express');
const app = express();

const db = require("./database/db");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const nunjucks = require('nunjucks');
nunjucks.configure("src/views", {
  express: app,
  noCache: true,
});

app.get("/", (req, res) => {
  return res.render("index.html")
})

app.get("/create-point", (req, res) => {
  return res.render("create-point.html")
})

app.post("/savepoint", (req, res) => {
  const { image, name, address, address2, state, city, items } = req.body;
  const query = `
      INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city, 
        items
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
     
  `;

  const values = [
    image,
    name,
    address,
    address2,
    state,
    city,
    items
  ]

  function afterInsertData(err) {
    if (err) {
      console.log(err)
      return res.send("Erro no cadastro!")
    }

    console.log("Cadastrado com sucesso")
    console.log(this)
    return res.render('create-point.html', {saved: true})
  }

  db.run(query, values, afterInsertData);

})

app.get("/search", (req, res) => {

  const search = req.query.search;

  if(search == ""){

    return res.render("search-results.html", {places: [],})
  }


  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }

    return res.render("search-results.html", { places: rows })
  })
})

app.listen(3333);