import { Component, OnInit } from '@angular/core';
import { LoginService } from "../services/login.service";
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

@Component({
	selector: 'app-login-screen',
	templateUrl: './login-screen.component.html',
	styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
	private passwordHidden: boolean = true;

	formControl = this.formBuilder.group({
		"email": ['', [Validators.required, Validators.maxLength(32),
			Validators.pattern(''/*'(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-' +
			']+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*' +
			'[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[' +
			'01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'*/)]],
		"password": ['', [Validators.required, Validators.minLength(8),
			Validators.pattern(''/*'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*].{3,}'*/)]]
	});
	matcher = new EmailErrorStateMatcher();

	constructor(private loginService: LoginService, private formBuilder: FormBuilder) {
	}

	ngOnInit() {
	}
}

export class EmailErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
