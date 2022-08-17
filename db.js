require('dotenv').config();
const mysql = require('mysql')


class Database {
  constructor (config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }
}


// let db = new Database({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: 'parking',
//   charset: 'utf8mb4',
//   insecureAuth: true
// });

let db = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  insecureAuth: true
});
module.exports = db;