import express from "express";
const categoriesController = express.Router();

categoriesController.get("/", (req, res) => {
  res.send("Rota de Categorias");
});

export default categoriesController;
