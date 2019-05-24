import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material";
import { LogoutDialogComponent, LogoutDialogResult } from "../dialogs/logout-dialog/logout-dialog.component";

@Injectable({
	providedIn: 'root'
})
export class LogoutGuardService implements CanDeactivate<DashboardComponent> {

	constructor(public dialog: MatDialog) {
	}

	canDeactivate(component: DashboardComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot):
		Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (component.autoRedirect) {
			return true;
		}
		return this.dialog.open(LogoutDialogComponent).afterClosed().toPromise().then(res => {
			return res === LogoutDialogResult.YES;
		});
	}
}
