require("@babel/polyfill");

import mariadb from 'mariadb';
import fs from 'fs';

let db;

const USER_EXISTS_QUERY = 'SELECT login FROM users WHERE login = ?';
const USER_LOGIN_QUERY = USER_EXISTS_QUERY + ' AND password = ?';
const CREATE_USER_QUERY = 'INSERT INTO users VALUES (?, ?)';

module.exports = {
	async connectToMariaDB() {
		const dbConfig = JSON.parse(fs.readFileSync('db-config.json', 'utf8'));
		const dbPool = mariadb.createPool(dbConfig);
		try {
			db = await dbPool.getConnection();
			console.log("Connected to mariadb");
		} catch (err) {
			console.error("Connection to mariadb failed due to error: " + err);
		}
	},
	async doesUserExist(user) {
		return (await executeQuery(USER_EXISTS_QUERY, [user])).length === 1;
	},
	createUser(user, hash) {
		return executeQuery(CREATE_USER_QUERY, [user, hash]);
	},
	async checkUserLogin(user, hash) {
		return (await executeQuery(USER_LOGIN_QUERY, [user, hash])).length === 1;
	}
};

function executeQuery(query, params) {
	try {
		return db.query(query, params);
	} catch (err) {
		console.error("Error while executing query: " + err);
		throw err;
	}
}