require("@babel/polyfill");

import mariadb from 'mariadb';
import fs from 'fs';

let db;

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
		try {
			const rows = await db.query('SELECT user FROM users WHERE user = ' + user)
		} catch (err) {
			console.error("Error while executing query: " + err);
		}
	}
};