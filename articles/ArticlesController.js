import express from "express";
import Category from "../categories/Category.js";
import Article from "../articles/Article.js";
import slugify from "slugify";
import adminAuth from "../middlewares/adminAuth.js";

const articlesController = express.Router();

articlesController.get("/admin/articles", adminAuth, (req, res) => {
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

articlesController.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories });
  });
});

articlesController.post("/articles/save", adminAuth, (req, res) => {
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

articlesController.post("/articles/delete", adminAuth, (req, res) => {
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

articlesController.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
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

articlesController.post("/articles/update", adminAuth, (req, res) => {
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

articlesController.get("/articles/page/:pageNumber", (req, res) => {
  const { pageNumber } = req.params;
  let offset = 0;
  if (isNaN(pageNumber) || pageNumber == 1) {
    offset = 0;
  } else {
    offset = (+pageNumber - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "DESC"]],
  }).then((articles) => {
    let next = true;
    if (offset + 4 >= articles.count) {
      next = false;
    }
    const result = {
      next,
      articles,
      pageNumber: +pageNumber,
    };
    Category.findAll().then((categories) => {
      res.render("articlesPage", { result, categories });
    });
  });
});

export default articlesController;
