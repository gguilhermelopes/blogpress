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

usersController.get("/login", (req, res) => {
  res.render("admin/users/login");
});

usersController.post("/authenticate", (req, res) => {
  const { email, password } = req.body;

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user) {
      const correct = bcryptjs.compareSync(password, user.password);
      if (correct) {
        const { id, email } = user;
        req.session.user = {
          id,
          email,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

usersController.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

export default usersController;
