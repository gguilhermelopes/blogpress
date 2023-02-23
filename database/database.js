import Sequelize from "sequelize";

const connection = new Sequelize("blogpress", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00",
});

export default connection;
