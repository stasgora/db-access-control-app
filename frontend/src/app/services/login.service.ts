import { Injectable } from '@angular/core';
import { HttpClientService } from "./http-client.service";

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(private httpClient: HttpClientService) {
	}

	public login(username: string, password: string): Promise<object> {
		return this.httpClient.post('/users/check', {login: username, password: password});
	}

	public signup(username: string, password: string): Promise<object> {
		return this.httpClient.post('/users/add', {login: username, password: password});
	}

}
