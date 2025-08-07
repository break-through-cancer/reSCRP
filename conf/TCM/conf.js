//--------------------------------------------------------------//
// filename : conf.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: configuration for database login
//--------------------------------------------------------------//

module.exports = {
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'tcm',
        port: process.env.DB_PORT,
        connectionLimit: process.env.DB_CONN_LIMIT
    },
};
