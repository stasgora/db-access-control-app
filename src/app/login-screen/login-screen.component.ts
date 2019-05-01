import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-login-screen',
	templateUrl: './login-screen.component.html',
	styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
	private hide: boolean = true;
	private password: string;

	constructor() {
	}

	ngOnInit() {
	}

}
