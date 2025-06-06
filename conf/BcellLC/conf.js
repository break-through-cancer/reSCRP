//--------------------------------------------------------------//
// filename : conf.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: configuration for database login
//--------------------------------------------------------------//

module.exports = {
  mysql: {
    host: process.env.DB_HOST_BCM,
    user: process.env.DB_USER_BCM,
    password: process.env.DB_PASSWORD_BCM,
    database: process.env.DB_DATABASE_BCM,
    connectionLimit: process.env.DB_CONN_LIMIT
  },
};
