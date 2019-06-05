require("@babel/polyfill");

import express from 'express';
import dbService from './db-service.js';

const router = express.Router();
const crypto = require('crypto');
var loggedUser;

router.get('/', (req, res) => res.send('Express server API'));
router.post('/users/add', async (req, res, next) => {
	try {
		const hash = crypto.createHash('sha512');
		if(await dbService.doesUserExist(req.body.login)) {
			return res.send(getErrorResponse(409, "User already exists"));
		}
		await dbService.createUser(req.body.login, hash.update(req.body.password).digest('hex'));
		await dbService.createBasicUserPermissions(req.body.login);
		res.status(201).send(getSuccessResponse("User created and basic permissions granted"));
	} catch (err) {
		next(err);
	}
});
router.post('/users/check', async (req, res, next) => {
	try {
		loggedUser = req.body.login;
		const hash = crypto.createHash('sha512');
		if(!await dbService.checkUserLogin(req.body.login, hash.update(req.body.password).digest('hex'))) {
			return res.send(getErrorResponse(401, "Authentication failed"));
		}
		res.status(200).send(getSuccessResponse("authorized"));
	} catch (err) {
		next(err);
	}
});
router.get('/users/get', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.getAllUsers());
	} catch (err) {
		next(err);
	}
});
router.get('/users/perm', async(req, res, next) => {
	try{
		var perm = await dbService.getPermisionsForUser(req.get('table'), loggedUser);
		res.status(200).send(perm[0].Permission);
	}catch(err){
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