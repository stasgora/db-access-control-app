import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	serverUri = 'http://localhost:4000/api';

	constructor(private http: HttpClient) {
	}

	public login(userLogin: string, password: string) {
		this.http.post(this.serverUri + '/login', {login: userLogin, password: password}).subscribe((res) => {
			console.log(res);
		});
	}
}
