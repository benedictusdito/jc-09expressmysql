const mysql = require("mysql");
const conn = mysql.createConnection({
  user: "benedictusdito",
  password: "kebonjeruk21",
  host: "db4free.net",
  database: "bendatabase",
  port: 3306
});

module.exports = conn;
