import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { HttpClientService } from "./http-client.service";

@Injectable({
	providedIn: 'root'
})
export class DashboardService {

	constructor(private httpClient: HttpClientService) {
	}

	getAllUsers() {
		return this.httpClient.get('/users/get');
	}

	getTableOwner(table: string){
		return this.httpClient.get('/table/owner', new HttpHeaders({'table': table}));
	}

	getTableContent(table: string): Promise<any> {
		return this.httpClient.get('/table/get', new HttpHeaders({'table': table}));
	}

	getUserPermission(table: string, user: string){
		return this.httpClient.get('/users/perm',  new HttpHeaders({'table': table, 'user': user}));
	}

	insertIntoTable(table: string, row: string){
		return this.httpClient.get('/table/insert',  new HttpHeaders({'table': table, 'row': row}));
	}
	updateTable(table: string, row: string){
		return this.httpClient.get('/table/update',  new HttpHeaders({'table': table, 'row': row }));
	}
	deleteTableData(table: string, row: string){
		return this.httpClient.get('/table/delete',  new HttpHeaders({'table': table, 'row': row }));
	}

	grantFullPermissions(table: string, user: string){
		return this.httpClient.get('/table/grantFull', new HttpHeaders({'table': table, 'user': user}));
	}

	grantUserPermission(table: string, row: string){
		return this.httpClient.get('/table/grant',  new HttpHeaders({'table': table, 'row': row }));
	}

	transferOwnership(table: string, user: string){
		return this.httpClient.get('/table/transferOwnership',  new HttpHeaders({'table': table, 'user': user }));
	}

	transferPermissions(table: string, user: string, loggedUser: string){
		return this.httpClient.get('/table/transferPermissions', new HttpHeaders({'table': table, 'user': user, 'loggedUser': loggedUser}));
	}
	revokeAllPermissions(user: string){
		return this.httpClient.get('/users/revoke', new HttpHeaders({'user': user}));
	}
	moveOwnedToAdmin(user: string){
		return this.httpClient.get('/users/moveToAdmin', new HttpHeaders({'user': user}));
	}
}
