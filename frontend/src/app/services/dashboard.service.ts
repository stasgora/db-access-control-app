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
}
