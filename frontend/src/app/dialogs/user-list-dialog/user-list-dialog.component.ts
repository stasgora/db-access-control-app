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
	permissionsWindow: boolean = false;

	permissionItems: PermissionItem[] = [
		new PermissionItem('R', 'Read'),
		new PermissionItem('W', 'Write'),
		new PermissionItem('U', 'Update'),
		new PermissionItem('D', 'Delete')
	];

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TableRowDialogComponent>) {
		this.users = data.users;
		this.permissionsWindow = data.type == UserDialogType.PERMISSIONS;
	}

	closeDialog() {
		if(this.selectedUser == undefined) {
			return;
		}
		let response = {'user': this.selectedUser};
		if(this.permissionsWindow) {
			this.permissionItems.forEach(item => response[item.itemCode] = item.granted);
		}
		this.dialogRef.close(response);
	}

	ngOnInit() {
	}

}

export class PermissionItem {
	itemCode: string;
	itemLabel: string;
	granted: boolean;

	constructor(itemCode: string, itemLabel: string) {
		this.itemCode = itemCode;
		this.itemLabel = itemLabel;
		this.granted = false;
	}
}

export enum UserDialogType {
	CHOOSE, PERMISSIONS
}
