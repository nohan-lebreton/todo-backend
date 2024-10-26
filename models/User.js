const pool = require('../config/db');

const User = {
    async createUser(username, email, hashedPassword) {
        const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    async findUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }
};

module.exports = User;
