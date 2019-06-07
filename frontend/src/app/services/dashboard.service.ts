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

	getTableContent(table: string): Promise<any> {
		return this.httpClient.get('/table/get', new HttpHeaders({'table': table}));
	}

	getUserPermission(table: string){
		return this.httpClient.get('/users/perm',  new HttpHeaders({'table': table}));
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
}
