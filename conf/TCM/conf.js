//--------------------------------------------------------------//
// filename : conf.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: configuration for database login
//--------------------------------------------------------------//

module.exports = {
    mysql: {
        host: process.env.DB_HOST_TCM,
        user: process.env.DB_USER_TCM,
        password: process.env.DB_PASSWORD_TCM,
        database: process.env.DB_DATABASE_TCM,
        connectionLimit: process.env.DB_CONN_LIMIT
    },
};
