import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatIconModule,
	MatInputModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatToolbarModule,
	MatListModule,
	MatDialogModule, MatTabsModule, MatTableModule, MatSelectModule
} from "@angular/material";
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ConsoleLoggerService } from "./services/console-logger.service";
import { LoggerService } from "./services/logger.service";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutDialogComponent } from './dialogs/logout-dialog/logout-dialog.component';
import { TableRowDialogComponent } from './dialogs/table-row-dialog/table-row-dialog.component';
import { UserListDialogComponent } from './dialogs/user-list-dialog/user-list-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginScreenComponent,
		DashboardComponent,
		LogoutDialogComponent,
		TableRowDialogComponent,
		UserListDialogComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatCardModule,
		MatInputModule,
		MatIconModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		MatSnackBarModule,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		MatDialogModule,
		MatTabsModule,
		MatTableModule,
		MatSelectModule
	],
	providers: [
		{ provide: LoggerService, useClass: ConsoleLoggerService }
	],
	bootstrap: [AppComponent],
	entryComponents: [
		LogoutDialogComponent,
		TableRowDialogComponent,
		UserListDialogComponent
	]
})
export class AppModule {
}
