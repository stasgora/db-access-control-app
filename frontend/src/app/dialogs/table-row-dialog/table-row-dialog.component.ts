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
	rowData;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
		this.type = data.type;
		this.rowData = data.rowData;
		console.log(this.rowData);
	}

	ngOnInit() {
	}

}

export enum DialogType {
	INSERT, EDIT
}
