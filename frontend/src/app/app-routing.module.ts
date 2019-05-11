import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from "./login-screen/login-screen.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LogoutGuardService } from "./services/logout-guard.service";

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: LoginScreenComponent },
	{ path: 'dashboard', component: DashboardComponent, canDeactivate: [LogoutGuardService] },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
