require("@babel/polyfill");

const mariadb = require('mariadb');
const fs = require('fs');
const router = require('./router.js');

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const dbConfig = JSON.parse(fs.readFileSync('db-config.json', 'utf8'));
const dbPool = mariadb.createPool(dbConfig);

connectToMariaDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

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