const mariadb = require('mariadb');
const fs = require('fs');
require("@babel/polyfill");
import express from 'express';

const dbConfig = JSON.parse(fs.readFileSync('db-config.json', 'utf8'));
const dbPool = mariadb.createPool(dbConfig);

connectToMariaDB();

const app = express();
app.get('/', (req, res) => res.send('Express server'));
app.listen(4000, () => console.log(`Express server running on port 4000`));

async function connectToMariaDB() {
	let db;
	try {
		db = await dbPool.getConnection();
		console.log("Connected to mariadb");
	} catch (err) {
		console.error("Connection to mariadb failed due to error: " + err);
	} finally {
		db.end();
	}
}