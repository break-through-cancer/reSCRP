//--------------------------------------------------------------//
// filename : conf.js
// Date : 2021-11-29
// contributor : Yanshuo Chu
// function: configuration for database login
//--------------------------------------------------------------//

module.exports = {
    mysql: {
        host: process.env.DB_HOST_GASTRICTME,
        user: process.env.DB_USER_GASTRICTME,
        password: process.env.DB_PASSWORD_GASTRICTME,
        database: process.env.DB_DATABASE_GASTRICTME,
        connectionLimit: process.env.DB_CONN_LIMIT
    },
};
