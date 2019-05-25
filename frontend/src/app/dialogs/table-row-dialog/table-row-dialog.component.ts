import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material";

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

	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		this.type = data.type;
		if(this.type == DialogType.EDIT) {
			this.rowData = data.rowData;
			this.columns = Object.keys(this.rowData);
		} else {
			this.columns = data.rowData;
		}
		console.log(this.columns);
		console.log(this.rowData);
	}

	ngOnInit() {
	}

}

export enum DialogType {
	INSERT, EDIT
}
