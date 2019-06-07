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

	error(message: any, arg = null) {
		if (this.debugMode) {
			return console.error(message, arg);
		}
	}

	warn(message: any) {
		if (this.debugMode) {
			return console.warn(message);
		}
	}
}
