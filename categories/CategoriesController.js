import express from "express";
import Category from "./Category.js";
import slugify from "slugify";

const categoriesController = express.Router();

categoriesController.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

categoriesController.post("/categories/save", (req, res) => {
  const { title } = req.body;
  if (title) {
    Category.create({
      title,
      slug: slugify(title).toLowerCase(),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

categoriesController.get("/admin/categories", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/categories/index", { categories });
  });
});

categoriesController.post("/categories/delete", (req, res) => {
  const { id } = req.body;
  if (id && !isNaN(id)) {
    Category.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/admin/categories");
  }
});

categoriesController.get("/admin/categories/edit/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) res.redirect("/admin/categories");
  Category.findByPk(id)
    .then((category) => {
      if (category) {
        res.render("admin/categories/edit", { category });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((error) => {
      res.redirect("/admin/categories");
    });
});

export default categoriesController;
