import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TableRowDialogComponent } from "../table-row-dialog/table-row-dialog.component";

@Component({
	selector: 'app-user-list-dialog',
	templateUrl: './user-list-dialog.component.html',
	styleUrls: ['./user-list-dialog.component.scss']
})
export class UserListDialogComponent implements OnInit {
	users: [{login: string}];
	selectedUser: string;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TableRowDialogComponent>) {
		this.users = data;
	}

	ngOnInit() {
	}

}
