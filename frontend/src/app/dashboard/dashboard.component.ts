import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { HttpClientService } from "../services/http-client.service";
import { HttpHeaders } from "@angular/common/http";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	mode = new FormControl('side');
	autoRedirect: boolean = false;
	menuItems = [
		{icon: 'add_circle', text: 'Add'},
		{icon: 'edit', text: 'Edit'},
		{icon: 'remove_circle', text: 'Remove'}
	];
	tabs = ['Aquarium', 'Fish', 'Workers'];

	constructor(private router: Router, private httpClient: HttpClientService) {
		/*let navRoute = this.router.getCurrentNavigation();
		if (navRoute == null || navRoute.extras.state == null || !navRoute.extras.state.hasOwnProperty('user')) {
			this.autoRedirect = true;
			this.router.navigateByUrl('/login');
			return
		}*/
		httpClient.get('/table/get', new HttpHeaders({'table': 'Aquarium'})).then(res => {
			console.log(res);
		});
	}
}
