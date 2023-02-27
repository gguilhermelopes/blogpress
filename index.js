import express from "express";
import connection from "./database/database.js";
import Article from "./articles/Article.js";
import Category from "./categories/Category.js";
import articlesController from "./articles/articlesController.js";
import categoriesController from "./categories/CategoriesController.js";

const app = express();
const port = 8080;

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

// Receber arquivos json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rotas
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
  const category = null;
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles, categories, category });
    });
  });
});

app.get("/:slug", (req, res) => {
  const { slug } = req.params;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article) {
        Category.findAll().then((categories) => {
          res.render("article", { article, categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  const { slug } = req.params;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [
      {
        model: Article,
      },
    ],
  })
    .then((category) => {
      if (category) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories,
            category,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((error) => {
      res.redirect("/");
    });
});

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}!`);
});
