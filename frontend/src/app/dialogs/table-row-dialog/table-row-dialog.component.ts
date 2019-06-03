import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
	selector: 'app-table-row-dialog',
	templateUrl: './table-row-dialog.component.html',
	styleUrls: ['./table-row-dialog.component.scss']
})
export class TableRowDialogComponent implements OnInit {
	DialogType = DialogType;
	type: DialogType;
	columns;
	rowData;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TableRowDialogComponent>) {
		this.type = data.type;
		if(this.type == DialogType.EDIT) {
			this.rowData = [data.rowData];
			this.columns = Object.keys(data.rowData);
		} else {
			this.columns = data.rowData;
			this.rowData = [{}];
			this.columns.forEach(column => this.rowData[0][column] = '');
		}
		this.columns.splice(0, 1);
	}

	ngOnInit() {
	}

}

export enum DialogType {
	INSERT, EDIT
}
