import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { HttpClientService } from "../services/http-client.service";
import { HttpHeaders } from "@angular/common/http";
import { MatDialog, MatTabChangeEvent } from "@angular/material";
import { TableRowDialogComponent } from "../dialogs/table-row-dialog/table-row-dialog.component";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	mode = new FormControl('side');
	autoRedirect: boolean = false;

	MenuItem = MenuItem;
	menuItems = [
		{icon: 'add_circle', type: MenuItem.ADD},
		{icon: 'edit', type: MenuItem.EDIT},
		{icon: 'remove_circle', type: MenuItem.REMOVE},
		{icon: 'https', type: MenuItem.PERMISIONS},
		{icon: 'forward', type: MenuItem.OWNERSHIP},
	];
	tabs = ['Aquarium', 'Fish', 'Workers'];
	selectedTab = this.tabs[0];
	tableData = {};
	columns = {};
	selectedRowID = {};

	constructor(private router: Router, private httpClient: HttpClientService, public dialog: MatDialog) {
		/*let navRoute = this.router.getCurrentNavigation();
		if (navRoute == null || navRoute.extras.state == null || !navRoute.extras.state.hasOwnProperty('user')) {
			this.autoRedirect = true;
			this.router.navigateByUrl('/login');
			return
		}*/
		this.tabs.forEach(tab => {
			this.tableData[tab] = httpClient.get('/table/get', new HttpHeaders({'table': tab})).then(res => {
				if(res.length > 0) {
					this.columns[tab] = Object.keys(res[0]);
				}
				return res;
			});
		});
	}

	rowSelected(event: any, row: any) {
		this.selectedRowID[this.selectedTab] = row.ID;
	}

	menuItemClicked(item: MenuItem) {
		switch (item) {
			case MenuItem.ADD:
				if(this.selectedRowID[this.selectedTab] == null) {
					break;
				}
				this.dialog.open(TableRowDialogComponent, {
					data: {type: item, rowData: this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]]}
				});
				break;
		}
	}

	formatMenuEntryText(item: MenuItem): string {
		let name = MenuItem[item].toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	tabChanged(event: MatTabChangeEvent) {
		this.selectedTab = this.tabs[event.index];
	}
}

export enum MenuItem {
	ADD, EDIT, REMOVE, PERMISIONS, OWNERSHIP
}
