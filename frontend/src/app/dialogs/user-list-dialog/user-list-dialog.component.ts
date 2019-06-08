import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TableRowDialogComponent } from "../table-row-dialog/table-row-dialog.component";
import { MenuItem } from "../../menu-item";
import { StringUtils } from "../../string-utils";

@Component({
	selector: 'app-user-list-dialog',
	templateUrl: './user-list-dialog.component.html',
	styleUrls: ['./user-list-dialog.component.scss']
})
export class UserListDialogComponent implements OnInit {
	users: [{login: string}];
	selectedUser: string;

	dialogType: MenuItem;
	StringUtils = StringUtils;
	MenuItem = MenuItem;

	transferItems: PermissionItem[] = [
		new PermissionItem('R', 'Read'),
		new PermissionItem('W', 'Write'),
		new PermissionItem('U', 'Update'),
		new PermissionItem('D', 'Delete')
	];

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TableRowDialogComponent>) {
		this.users = data.users;
		this.dialogType = data.type;
		if(this.dialogType === MenuItem.TRANSFER_PERMISSIONS) {
			this.transferItems = data.tables.map(table => new PermissionItem(table, table));
		}
	}

	closeDialog() {
		if(this.selectedUser == undefined) {
			return;
		}
		let response = {'user': this.selectedUser};

		if(this.dialogType != MenuItem.TRANSFER_OWNERSHIP) {
			this.transferItems.forEach(item => response[item.itemCode] = item.granted);
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
