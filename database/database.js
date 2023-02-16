import Sequelize from "sequelize";

const connection = new Sequelize("blogpress", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
});

export default connection;
