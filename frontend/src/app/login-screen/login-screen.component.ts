import { Component, OnInit } from '@angular/core';
import { LoginService } from "../services/login.service";
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
	selector: 'app-login-screen',
	templateUrl: './login-screen.component.html',
	styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {
	Mode = Mode;
	private mode: Mode = Mode.SIGNIN;
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

	constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
	}

	ngOnInit() {
	}

	submit() {
		if(this.mode === Mode.SIGNUP) {
			this.loginService.signup(this.formControl.get('email').value, this.formControl.get('password').value).then(res => {
				this.handleSubmitResponse(res, 409, 'usernameTaken', ErrorDisplayType.FORM);
			});
		} else {
			this.loginService.login(this.formControl.get('email').value, this.formControl.get('password').value).then(res => {
				this.handleSubmitResponse(res, 401, 'Invalid credentials', ErrorDisplayType.TOAST);
			});
		}
	}

	handleSubmitResponse(res: object, errorCodeCheck: number, error: string, errorDisplayType: ErrorDisplayType) {
		if (res != null && res.hasOwnProperty('error') && res['error'].code === errorCodeCheck) {
			errorDisplayType === ErrorDisplayType.FORM ?
				this.formControl.controls['email'].setErrors({[error]: true}):
				this.snackBar.open(error, 'OK', {duration: 4000});
			return;
		} else {
			this.router.navigateByUrl('/dashboard', {state: {'user': this.formControl.get('email').value}});
		}
	}

	switchMode() {
		this.mode = -this.mode;
		this.formControl.reset();
	}
}

enum Mode {
	SIGNIN = 1, SIGNUP = -1
}

enum ErrorDisplayType {
	FORM, TOAST
}

export class EmailErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}
