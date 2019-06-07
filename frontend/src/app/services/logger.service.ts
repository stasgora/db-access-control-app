import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export abstract class LoggerService {
	abstract info(message: any);

	abstract warn(message: any);

	abstract error(message: any, arg: any);
}
