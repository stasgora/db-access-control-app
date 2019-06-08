import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {MatDialog, MatSidenav, MatTabChangeEvent, MatTabGroup, MatTableDataSource} from "@angular/material";
import {TableRowDialogComponent} from "../dialogs/table-row-dialog/table-row-dialog.component";
import {DashboardService} from "../services/dashboard.service";
import {UserListDialogComponent} from "../dialogs/user-list-dialog/user-list-dialog.component";
import {MenuItem} from "../menu-item";
import {StringUtils} from "../string-utils";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	mode = new FormControl('side');
	autoRedirect: boolean = false;

	StringUtils = StringUtils;
	MenuItem = MenuItem;
	menuItems = [
		{icon: 'add_circle', type: MenuItem.ADD},
		{icon: 'edit', type: MenuItem.EDIT},
		{icon: 'remove_circle', type: MenuItem.REMOVE},
		{icon: 'https', type: MenuItem.GRANT_PERMISSIONS},
		{icon: 'fast_forward', type: MenuItem.TRANSFER_OWNERSHIP},
		{icon: 'forward', type: MenuItem.TRANSFER_PERMISSIONS},
	];
	tabs = ['Aquarium', 'Fish', 'Workers'];
	ADMIN_NAME = "admin@admin.com";
	selectedTab = this.tabs[0];
	tableDataPromise = {};
	tableData = {};
	columns = {};
	selectedRowID = {};
	@ViewChild('tabGroup') tabGroup: MatTabGroup;
	@ViewChild('drawer') drawer: MatSidenav;

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
				if(perms.toString().includes("R")){
					this.selectedTab = tab;
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
			case MenuItem.GRANT_PERMISSIONS:
				this.displayUserDialog(item);
				break;
			case MenuItem.REMOVE:
				this.tableData[this.selectedTab].splice(this.selectedRowID[this.selectedTab], 1);
				console.log(this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]].ID);
				this.dashboard.deleteTableData(this.selectedTab, (this.tableData[this.selectedTab][this.selectedRowID[this.selectedTab]].ID).toString());
				this.selectedRowID[this.selectedTab] = null;
				this.refreshTableData();
				break;
			case MenuItem.TRANSFER_OWNERSHIP:
				this.displayUserDialog(item);
				break;
			case MenuItem.TRANSFER_PERMISSIONS:
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
			let data =  {type: item, users: users};
			if(item === MenuItem.TRANSFER_PERMISSIONS) {
				data['tables'] = this.tabs;
			}
			this.dialog.open(UserListDialogComponent, { data: data }).afterClosed().subscribe(val => {
				if(val !== undefined) {
					if (item == MenuItem.GRANT_PERMISSIONS) {
						this.dashboard.grantUserPermission(this.selectedTab, JSON.stringify(val));
					} else if (item == MenuItem.TRANSFER_OWNERSHIP) {
						this.dashboard.transferOwnership(this.selectedTab, JSON.stringify(val));
						this.dashboard.grantFullPermissions(this.selectedTab, JSON.stringify(val));
					}else if(item == MenuItem.TRANSFER_PERMISSIONS) {
						// If table owner is transfering permissions, then also transfers his ownership
						let transferTables = [val.Aquarium, val.Fish, val.Workers];
						let counter = 0;
						transferTables.forEach( tab => {
							this.dashboard.getTableOwner(this.tabs[counter]).then(resp => {
								if (this.getLoggedUser() === resp[0].Owner) {
									if(tab === true) {
										this.dashboard.transferOwnership(this.selectedTab, JSON.stringify(val));
										this.dashboard.grantFullPermissions(this.selectedTab, JSON.stringify(val));
									}else{
										console.log("Transfering to ADMIN");
										this.dashboard.transferOwnership(this.selectedTab, "{ \"user\": \""+ this.ADMIN_NAME +"\"}");
									}
								}
							});
							counter += 1;
						});
						// Permission transfer following ownership transfer
						counter = 0;
						transferTables.forEach( tab => {
							if(tab === true) {
								this.dashboard.transferPermissions(this.tabs[counter], JSON.stringify(val), this.getLoggedUser());
							}
							counter += 1;
						});
						// After transfering permissions user loses all permissions
						this.dashboard.revokeAllPermissions(this.getLoggedUser());
					}
					this.checkMenuItemsForTable();
				}
			});
		});
	}

	checkMenuItemsForTable(){
		this.menuItems = [
			{icon: 'add_circle', type: MenuItem.ADD},
			{icon: 'edit', type: MenuItem.EDIT},
			{icon: 'remove_circle', type: MenuItem.REMOVE},
			{icon: 'https', type: MenuItem.GRANT_PERMISSIONS},
			{icon: 'fast_forward', type: MenuItem.TRANSFER_OWNERSHIP},
			{icon: 'forward', type: MenuItem.TRANSFER_PERMISSIONS},
		];
		this.dashboard.getUserPermission(this.selectedTab, this.getLoggedUser()).then( resp => {
			var perms = resp.permissions;
			console.log(perms);
			console.log(this.selectedTab);
			console.log(this.getLoggedUser());
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
		this.dashboard.getTableOwner(this.selectedTab).then( resp => {
			console.log(this.getLoggedUser());
			console.log(resp[0].Owner);
			if(this.getLoggedUser() !== resp[0].Owner){
				this.menuItems.forEach( item=> {
					if (item.type === MenuItem.GRANT_PERMISSIONS) {
						let index = this.menuItems.indexOf(item);
						if (index !== -1) this.menuItems.splice(index, 1);
					}
				});
				this.menuItems.forEach( item=> {
					if (item.type === MenuItem.TRANSFER_OWNERSHIP) {
						let index = this.menuItems.indexOf(item);
						if (index !== -1) this.menuItems.splice(index, 1);
					}
				});
			}
		});
	}

	refreshTableData() {
		(this.tableDataPromise[this.selectedTab] as Promise<any>).then(
			table => (table as MatTableDataSource<any>).data = this.tableData[this.selectedTab]
		);
	}

	tabChanged(event: MatTabChangeEvent) {
		console.log("test");
		this.selectedTab = this.tabs[event.index];
		this.checkMenuItemsForTable();
	}

	toggleSidebar() {
		this.drawer.toggle();
		setTimeout(() => {
			this.tabGroup.realignInkBar();
		}, 300);
	}
}
