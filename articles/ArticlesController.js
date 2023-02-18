import express from "express";
const articlesController = express.Router();

articlesController.get("/articles", (req, res) => {
  res.send("Rota de Artigos");
});

export default articlesController;
