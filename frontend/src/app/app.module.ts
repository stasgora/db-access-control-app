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
	MatDialogModule, MatTabsModule, MatTableModule
} from "@angular/material";
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ConsoleLoggerService } from "./services/console-logger.service";
import { LoggerService } from "./services/logger.service";
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginScreenComponent,
		DashboardComponent,
		LogoutDialogComponent
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
		MatTableModule
	],
	providers: [
		{ provide: LoggerService, useClass: ConsoleLoggerService }
	],
	bootstrap: [AppComponent],
	entryComponents: [LogoutDialogComponent]
})
export class AppModule {
}
