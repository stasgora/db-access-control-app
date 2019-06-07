import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { MatDialog, MatTabChangeEvent, MatTableDataSource } from "@angular/material";
import { TableRowDialogComponent } from "../dialogs/table-row-dialog/table-row-dialog.component";
import { DashboardService } from "../services/dashboard.service";
import { UserDialogType, UserListDialogComponent } from "../dialogs/user-list-dialog/user-list-dialog.component";

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
		{icon: 'https', type: MenuItem.PERMISSIONS},
		{icon: 'forward', type: MenuItem.OWNERSHIP},
	];
	tabs = ['Aquarium', 'Fish', 'Workers'];
	selectedTab = this.tabs[0];
	tableDataPromise = {};
	tableData = {};
	columns = {};
	selectedRowID = {};

	constructor(private router: Router, private dashboard: DashboardService, public dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef) {
		/*let navRoute = this.router.getCurrentNavigation();
		if (navRoute == null || navRoute.extras.state == null || !navRoute.extras.state.hasOwnProperty('user')) {
			this.autoRedirect = true;
			this.router.navigateByUrl('/login');
			return
		}*/

		this.tabs.forEach(tab =>{
			this.dashboard.getUserPermission(tab, this.getLoggedUser()).then( resp => {
				var perms = resp.permissions;
				if(perms.toString().includes("r")){
					var index = this.tabs.indexOf(tab);
					if(index !== -1)this.tabs.splice(index, 1);
				}
			});
		});

		this.tabs.forEach(tab => {
			this.tableDataPromise[tab] = this.dashboard.getTableContent(tab).then(res => {
				if(res.length > 0) {
					this.columns[tab] = Object.keys(res[0]);
					this.columns[tab].splice(0, 1);
				}
				this.tableData[tab] = res;
				return new MatTableDataSource(res);
			});
		});

		this.checkMenuItemsForTable();
	}

	getLoggedUser(): string {
		return localStorage.getItem('user')
	}

	rowSelected(event: any, row: any) {
		this.selectedRowID[this.selectedTab] = this.tableData[this.selectedTab].indexOf(row);
	}

	menuItemClicked(item: MenuItem) {
		if((item == MenuItem.EDIT || item == MenuItem.REMOVE) && this.selectedRowID[this.selectedTab] == null) {
			return;
		}
		switch (item) {
			case MenuItem.ADD:
				this.displayTableRowDialog(item, this.columns[this.selectedTab]);
				break;
			case MenuItem.EDIT:
				this.displayTableRowDialog(item, this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]]);
				break;
			case MenuItem.PERMISSIONS:
				this.displayUserDialog(item);
				break;
			case MenuItem.REMOVE:
				this.tableData[this.selectedTab].splice(this.selectedRowID[this.selectedTab], 1);
				console.log(this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]].ID);
				this.dashboard.deleteTableData(this.selectedTab, (this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]].ID).toString());
				this.selectedRowID[this.selectedTab] = null;
				this.refreshTableData();
				break;
			case MenuItem.OWNERSHIP:
				this.displayUserDialog(item);
				break;
		}
	}

	displayTableRowDialog(item: MenuItem, data) {
		this.dialog.open(TableRowDialogComponent, { data: {type: item, rowData: data} }).afterClosed().subscribe(row => {
			if(item == MenuItem.ADD) {
				this.tableData[this.selectedTab].push(row);
				let tableData = JSON.stringify(row);
				this.dashboard.insertIntoTable(this.selectedTab, tableData);
			} else if(row != null) {
				this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]] = row;
				let tableData = JSON.stringify(row);
				this.dashboard.updateTable(this.selectedTab, tableData);
			}
			this.refreshTableData();
		});
	}

	displayUserDialog(item: MenuItem) {
		this.dashboard.getAllUsers().then(users => {
			users = users.map(user => user.login);
			let index = users.indexOf(localStorage.getItem("user"));
			if (index !== -1) users.splice(index, 1);

			let type: UserDialogType = item == MenuItem.OWNERSHIP ? UserDialogType.CHOOSE : UserDialogType.PERMISSIONS;
			this.dialog.open(UserListDialogComponent, { data: {type: type, users: users} }).afterClosed().subscribe(val => {
				console.log(val);
			});
		});
	}

	checkMenuItemsForTable(){
		this.menuItems = [
			{icon: 'add_circle', type: MenuItem.ADD},
			{icon: 'edit', type: MenuItem.EDIT},
			{icon: 'remove_circle', type: MenuItem.REMOVE},
			{icon: 'https', type: MenuItem.PERMISSIONS},
			{icon: 'forward', type: MenuItem.OWNERSHIP},
		];
		this.dashboard.getUserPermission(this.selectedTab, this.getLoggedUser()).then( resp => {
			var perms = resp.permissions;
			this.menuItems.forEach( item=> {
				if (item.type === MenuItem.ADD) {
					if (perms.toString().includes("w")) {
						let index = this.menuItems.indexOf(item);
						if (index !== -1) this.menuItems.splice(index, 1);
					}
				}
			});
			this.menuItems.forEach( item=> {
				if (item.type === MenuItem.EDIT) {
					if (perms.toString().includes("u")) {
						let index = this.menuItems.indexOf(item);
						if (index !== -1) this.menuItems.splice(index, 1);
					}
				}
			});
			this.menuItems.forEach( item=> {
				if (item.type === MenuItem.REMOVE) {
					if (perms.toString().includes("d")) {
						let index = this.menuItems.indexOf(item);
						if (index !== -1) this.menuItems.splice(index, 1);
					}
				}
			});
		});
	}

	refreshTableData() {
		(this.tableDataPromise[this.selectedTab] as Promise<any>).then(
			table => (table as MatTableDataSource<any>).data = this.tableData[this.selectedTab]
		);
	}

	formatMenuEntryText(item: MenuItem): string {
		let name = MenuItem[item].toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	}

	tabChanged(event: MatTabChangeEvent) {
		this.selectedTab = this.tabs[event.index];
		this.checkMenuItemsForTable();
	}
}

export enum MenuItem {
	ADD, EDIT, REMOVE, PERMISSIONS, OWNERSHIP
}
