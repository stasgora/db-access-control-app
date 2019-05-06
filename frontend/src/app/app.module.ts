import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule } from "@angular/material";
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
	declarations: [
		AppComponent,
		LoginScreenComponent
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
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
