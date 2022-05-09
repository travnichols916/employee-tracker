//Import mysql12
const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'optionaLoZ3R',
      database: 'challenger_db'
    },
    console.log(`Connected to the Employee Database.`)
  );

  module.exports = db;