import express from "express";
import User from "./User.js";
import bcryptjs from "bcryptjs";

const usersController = express.Router();

usersController.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users });
  });
});

usersController.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

usersController.post("/users/create", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user) {
      res.redirect("/admin/users/create");
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(password, salt);

      User.create({ email, password: hash })
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          res.redirect("/admin/users/create");
        });
    }
  });
});

export default usersController;
