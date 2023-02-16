const express = require("express");
const app = express();
const port = 8080;
const connection = require("./database/database");

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados!");
  })
  .catch((error) => {
    console.log(error);
  });

// View engine
app.set("view engine", "ejs");

// Static
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}!`);
});
