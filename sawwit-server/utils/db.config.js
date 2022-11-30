const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "sawwit-db_server",
    port: 3306,
    user: "root",
    password: "password",
    database: "mydb",
  },
});

module.exports = knex;
