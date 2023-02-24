import express from "express";
import Category from "../categories/Category.js";
import Article from "../articles/Article.js";
import slugify from "slugify";

const articlesController = express.Router();

articlesController.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [
      {
        model: Category,
      },
    ],
  }).then((articles) => {
    res.render("admin/articles/index", { articles });
  });
});

articlesController.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

articlesController.post("/articles/save", (req, res) => {
  const { title, body, category } = req.body;

  Article.create({
    title,
    slug: slugify(title).toLowerCase(),
    body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

articlesController.post("/articles/delete", (req, res) => {
  const { id } = req.body;
  if (id && !isNaN(id)) {
    Article.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/articles");
  }
});

articlesController.get("/admin/articles/edit/:id", (req, res) => {
  const { id } = req.params;
  Article.findByPk(id)
    .then((article) => {
      if (article) {
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", { categories, article });
        });
      } else {
        res.redirect("/admin/articles");
      }
    })
    .catch((error) => {
      res.redirect("/admin/articles");
    });
});

articlesController.post("/articles/update", (req, res) => {
  const { id, title, body, category } = req.body;

  Article.update(
    {
      title,
      body,
      categoryId: category,
      slug: slugify(title).toLowerCase(),
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/admin/articles");
    })
    .catch((error) => {
      res.redirect("/admin/articles/edit/:id");
    });
});

export default articlesController;
