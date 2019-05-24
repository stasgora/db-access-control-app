import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-logout-dialog',
	templateUrl: './logout-dialog.component.html',
	styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent implements OnInit {

	LogoutDialogResult = LogoutDialogResult;

	constructor() {
	}

	ngOnInit() {
	}

}

export enum LogoutDialogResult {
	YES, CANCEL
}
