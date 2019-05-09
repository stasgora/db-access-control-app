import { Injectable } from '@angular/core';
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: 'root'
})

export class ConsoleLoggerService extends LoggerService {
	private debugMode: boolean = true;

	info(message: any) {
		if (this.debugMode) {
			return console.info(message);
		}
	}

	error(message: any) {
		if (this.debugMode) {
			return console.error(message);
		}
	}

	warn(message: any) {
		if (this.debugMode) {
			return console.warn(message);
		}
	}
}
