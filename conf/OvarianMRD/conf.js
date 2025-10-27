module.exports = {
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_OVMRD,
        port: process.env.DB_PORT,
        connectionLimit: process.env.DB_CONN_LIMIT
    },
};
