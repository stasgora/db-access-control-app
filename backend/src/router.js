require("@babel/polyfill");

import express from 'express';
import dbService from './db-service.js';

const router = express.Router();
const crypto = require('crypto');
var loggedUser;// = "admin@admin.com";

router.get('/', (req, res) => res.send('Express server API'));
router.post('/users/add', async (req, res, next) => {
	try {
		const hash = crypto.createHash('sha512');
		if(await dbService.doesUserExist(req.body.login)) {
			return res.send(getErrorResponse(409, "User already exists"));
		}
		await dbService.createUser(req.body.login, hash.update(req.body.password).digest('hex'));
		await dbService.createBasicUserPermissions(req.body.login);
		loggedUser = req.body.login;
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

router.get('/table/insert', async (req, res, next) => {
	try {
		await dbService.insertIntoTableData(req.get('table'), req.get('row'));
		res.status(200).send(getSuccessResponse("inserted data"));
	} catch (err) {
		next(err);
	}
});

router.get('/table/update', async (req, res, next) => {
	try {
		await dbService.updateTableData(req.get('table'), req.get('row'));
		res.status(200).send(getSuccessResponse("updated data"));
	} catch (err) {
		next(err);
	}
});

router.get('/table/delete', async (req, res, next) => {
	try{
		await dbService.deleteTableData(req.get('table'), req.get('row'));
		res.status(200).send(getSuccessResponse("deleted data"));
	}catch(err){
		next(err);
	}
});

router.get('/table/grant', async (req, res, next) => {
	try{
		await dbService.grantPermissionToUser(req.get('table'), req.get('row'));
		res.status(200).send(getSuccessResponse("granted permissions"));
	}catch(err){
		next(err);
	}
});

router.get('/table/grantFull', async (req, res, next) => {
	try{
		await dbService.grantFullPermissionsToUser(req.get('table'), req.get('user'));
		res.status(200).send(getSuccessResponse("granted full permissions"));
	}catch(err){
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


router.get('/table/owner', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.getTableOwner(req.get('table')));
	} catch (err) {
		next(err);
	}
});

router.get('/table/transferOwnership', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.transferTableOwnership(req.get('table'), req.get('user')));
	} catch (err) {
		next(err);
	}
});

router.get('/table/transferPermissions', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.transferTablePermissions(req.get('table'), req.get('user'), req.get('loggedUser')));
	} catch (err) {
		next(err);
	}
});

router.get('/users/moveToAdmin', async (req, res, next) => {
	try {
		res.status(200).send(await dbService.moveOwnershipToAdmin(req.get('user')));
	} catch (err) {
		next(err);
	}
});

router.get('/users/perm', async(req, res, next) => {
	try{
		var perm = await dbService.getPermisionsForUser(req.get('table'), req.get('user'));
		res.status(200).send({'permissions': perm[0].Permission});
	}catch(err){
		next(err);
	}
});


router.get('/users/revoke', async(req, res, next) => {
	try{
		await dbService.revokePermissionsForUser(req.get('user'));
		res.status(200).send(" permissions revoked");
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