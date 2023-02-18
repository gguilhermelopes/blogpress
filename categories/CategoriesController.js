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
      res.redirect("/");
    });
  } else {
    res.redirect("/admin/categories/new");
  }
});

export default categoriesController;
