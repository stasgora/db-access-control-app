import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor() {
	}

	public login(userLogin: string, password: string) {
		console.log(userLogin, password)
	}
}
