// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbEnegix'

  
});

module.exports = db;


// db.js
// const mysql = require('mysql2/promise');

// const db = mysql.createPool({
//   // host: 'localhost',
//   // user: 'root',
//   // password: '',
//   // database: 'dbEnegix'

//   host: '185.27.134.175',
//   user: 'if0_39475678',
//   password: 'OWxmEIee5nFl',
//   database: 'if0_39475678_dbenegix'
// });

// module.exports = db;