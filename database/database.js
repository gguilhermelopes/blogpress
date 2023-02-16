const Sequelize = require("sequelize");

const connection = new Sequelize("blogpress", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
