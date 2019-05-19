require("@babel/polyfill");

import express from 'express';
import dbService from './db-service.js';

const router = express.Router();
const crypto = require('crypto');

router.get('/', (req, res) => res.send('Express server API'));
router.post('/signup', async (req, res, next) => {
	try {
		const hash = crypto.createHash('sha512');
		if(await dbService.doesUserExist(req.body.login)) {
			return res.send(getErrorResponse(409, "User already exists"));
		}
		await dbService.createUser(req.body.login, hash.update(req.body.password).digest('hex'));
		res.status(201).send(getSuccessResponse("created"));
	} catch (err) {
		next(err);
	}
});
router.post('/login', async (req, res, next) => {
	try {
		const hash = crypto.createHash('sha512');
		if(!await dbService.checkUserLogin(req.body.login, hash.update(req.body.password).digest('hex'))) {
			return res.send(getErrorResponse(401, "Authentication failed"));
		}
		res.status(200).send(getSuccessResponse("authorized"));
	} catch (err) {
		next(err);
	}
});
router.get('/table/get', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.getTable(req.get('table')));
	} catch (err) {
		next(err);
	}
});

function getSuccessResponse(message) {
	return { status: message }
}

function getErrorResponse(code, message) {
	return {
		error: {
			code: code,
			message: message
		}
	}
}

module.exports = router;