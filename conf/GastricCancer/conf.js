//--------------------------------------------------------------//
// filename : conf.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: configuration for database login
//--------------------------------------------------------------//

module.exports = {
    mysql: {
        host: process.env.DB_HOST_GASTRIC,
        user: process.env.DB_USER_GASTRIC,
        password: process.env.DB_PASSWORD_GASTRIC,
        database: process.env.DB_DATABASE_GASTRIC,
        connectionLimit: process.env.DB_CONN_LIMIT
    },
};
