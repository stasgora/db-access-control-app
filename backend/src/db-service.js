require("@babel/polyfill");

import mariadb from 'mariadb';
import fs from 'fs';

let db;

const USER_EXISTS_QUERY = 'SELECT login FROM users WHERE login = ?';
const USER_LOGIN_QUERY = USER_EXISTS_QUERY + ' AND password = ?';
const SELECT_ALL_USERS_QUERY = 'SELECT login FROM users';
const CREATE_USER_QUERY = 'INSERT INTO users VALUES (?, ?)';

const INSERT_FISH_QUERY = 'INSERT INTO Fish(Species, Name, Size, Color, Tank_ID) VALUES (?, ?, ?, ?, ?)';
const INSERT_AQUARIUM_QUERY = 'INSERT INTO Aquarium(Size, Volume, Material, Assignee_ID) VALUES (?, ?, ?, ?)';
const INSERT_WORKER_QUERY = 'INSERT INTO Workers(Name, Surename, Age, Salary) VALUES (?, ?, ?, ?)';

const UPDATE_FISH_QUERY = 'UPDATE Fish SET Species=?, Name=?, Size=?, Color=?, Tank_ID=?';
const UPDATE_AQUARIUM_QUERY = 'UPDATE Aquarium SET Size=?, Volume=?, Material=?, Assignee_ID=?';
const UPDATE_WORKERS_QUERY = 'UPDATE Workers SET Name=?, Surename=?, Age=?, Salary=?';
const WHERE_ID_CLAUSE_QUERY = ' WHERE ID LIKE ?';

const DELETE_FROM_QUERY = 'DELETE FROM ';
const REVOKE_PERM_QUERY = 'Perm SET Permission=\"rwud\" WHERE user LIKE ?';

const TABLE_OWNER_QUERY = 'SELECT * FROM TableOwners WHERE TableName LIKE ?';
const PERMISSION_FOR_USER_QUERY = 'Perm SET Permission=? WHERE user LIKE ?';

const NEW_USER_PERMISSION_QUERY = 'Perm(User, Permission) VALUES (?, \'Rwud\')'; // rwud - Read/Write/Update/Delete, caps - can
const SELECT_TABLE_QUERY = 'SELECT * FROM';

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
	async insertIntoTableData(table, data){
		let values = JSON.parse(data);
		if(table === 'Fish')return (await executeQuery(INSERT_FISH_QUERY, [values.Species, values.Name, values.Size, values.Color, parseInt(values.Tank_ID,10)]));
		else if(table === 'Aquarium')return (await executeQuery(INSERT_AQUARIUM_QUERY, [values.Size, parseInt(values.Volume, 10), values.Material, parseInt(values.Assignee_ID, 10)]));
		else {
			return (await executeQuery(INSERT_WORKER_QUERY, [values.Name, values.Surename, parseInt(values.Age,10), parseInt(values.Salary,10)]));
		}
	},
	async updateTableData(table, data){
		let values = JSON.parse(data);
		console.log(data);
		if(table === 'Fish')return (await executeQuery(UPDATE_FISH_QUERY + WHERE_ID_CLAUSE_QUERY, [values.Species, values.Name, values.Size, values.Color, parseInt(values.Tank_ID,10), values.ID]));
		else if(table === 'Aquarium')return (await executeQuery(UPDATE_AQUARIUM_QUERY + WHERE_ID_CLAUSE_QUERY, [values.Size, parseInt(values.Volume, 10), values.Material, parseInt(values.Assignee_ID, 10), values.ID]));
		else {
			return (await executeQuery(UPDATE_WORKERS_QUERY + WHERE_ID_CLAUSE_QUERY, [values.Name, values.Surename, parseInt(values.Age,10), parseInt(values.Salary,10), values.ID]));
		}
	},
	async deleteTableData(table, data){
		console.log("DATA:",data);
		let values = JSON.parse(data);
		return (await executeQuery(DELETE_FROM_QUERY + table + WHERE_ID_CLAUSE_QUERY, [values.ID]));
	},
	async grantPermissionToUser(table, data){
		let values = JSON.parse(data);
		let perm = "";
		perm += (values.R === true) ? 'R' : 'r';
		perm += (values.W === true) ? 'W' : 'w';
		perm += (values.U === true) ? 'U' : 'u';
		perm += (values.D === true) ? 'D' : 'd';
		return (await executeQuery("UPDATE " + table + PERMISSION_FOR_USER_QUERY, [perm, values.user]));
	},
	async grantFullPermissionsToUser(table, user){
		let perm = "RWUD";
		return (await executeQuery("UPDATE " + table + PERMISSION_FOR_USER_QUERY, [perm, JSON.parse(user).user]));
	},
	async transferTableOwnership(table, user){
		let val = JSON.parse(user);
		return (await executeQuery("UPDATE TableOwners SET Owner=? WHERE TableName LIKE ?", [val.user, table]));
	},
	async transferTablePermissions(table, user, loggedUser){
		let val = JSON.parse(user);
		return (await executeQuery("UPDATE " + table + "Perm SET Permission=(SELECT Permission FROM "+ table + "Perm WHERE user LIKE ?) WHERE user LIKE ?", [loggedUser, val.user]));
	},
	async moveOwnershipToAdmin(user){
		return (await executeQuery("UPDATE TableOwners SET Owner=\"admin@admin.com\" WHERE Owner LIKE ?", [user]));
	},
	async revokePermissionsForUser(user){
		let tabs = ['Aquarium', 'Fish', 'Workers'];
		tabs.forEach( async tab=> {
			await executeQuery("UPDATE "+tab+REVOKE_PERM_QUERY, [user]);
		});
	},
	createUser(user, hash) {
		return executeQuery(CREATE_USER_QUERY, [user, hash]);
	},
	createBasicUserPermissions(user){
		var tables = ['Aquarium', 'Fish', 'Workers'];
		tables.forEach( table =>{
			executeQuery('INSERT INTO ' + table + NEW_USER_PERMISSION_QUERY, [user]);
		})
	},
	async checkUserLogin(user, hash) {
		return (await executeQuery(USER_LOGIN_QUERY, [user, hash])).length === 1;
	},
	async getPermisionsForUser(table, user){
		return executeQuery("SELECT * FROM "+ table + "Perm WHERE User LIKE" +"\""+user+"\"");
	},
	async getTableOwner(table){
		return (await executeQuery(TABLE_OWNER_QUERY, [table]));
	},
	async getTable(table) {
		return executeQuery(SELECT_TABLE_QUERY + ' `' + table + '`');
	},
	async getAllUsers() {
		return executeQuery(SELECT_ALL_USERS_QUERY);
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