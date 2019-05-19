import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoggerService } from "./logger.service";

@Injectable({
	providedIn: 'root'
})
export class HttpClientService {

	serverUri = 'http://localhost:4000/api';

	constructor(private http: HttpClient, private logger: LoggerService) {
	}

	public post(path: string, body: any): Promise<object> {
		return this.http.post(this.serverUri + path, body).toPromise().then(res => {
			if (res.hasOwnProperty('error')) {
				this.logger.warn('Request internal error ' + res['error'].code + ': ' + res['error'].message);
			}
			return res;
		}).catch(err => {
			this.logger.error('Request error ' + err);
			return err;
		});
	}
}
