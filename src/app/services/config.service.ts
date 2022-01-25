import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Config } from 'src/app/models/Config';

//TODO: assets/config should not be included in Dockerfile but be provided from docker host as a volume
@Injectable({
  providedIn: "root"
})
export class ConfigService {

  config$: Observable<Config>;
  apiUrl$: Observable<string>;
  environment$: Observable<string>;
  keycloakApiUrl$: Observable<string>;
  keycloakRealm$: Observable<string>;
  keycloakClientId$: Observable<string>;

  constructor(
    protected httpClient: HttpClient
  ) {
    this.config$ = this.httpClient
      .get<Config>('assets/config/config.json')
      .pipe(
        shareReplay()
      );
    this.apiUrl$ = this.config$.pipe(
      map(config => config.apiUrl)
    );
    this.environment$ = this.config$.pipe(
      map(config => config.environment)
    );
    this.keycloakApiUrl$ = this.config$.pipe(
      map(config => config.keycloakApiUrl)
    );
    this.keycloakRealm$ = this.config$.pipe(
      map(config => config.keycloakRealm)
    );
    this.keycloakClientId$ = this.config$.pipe(
      map(config => config.keycloakClientId)
    );
  }

  get<T>(path: string): Observable<T> {
    return this.apiUrl$
      .pipe(
        switchMap(apiUrl => this.httpClient.get<T>(`${apiUrl}/${path}`))
      );
  }

  post<T>(path: string, object: T): Observable<HttpResponse<T>> {
    return this.apiUrl$
      .pipe(
        switchMap(apiUrl => this.httpClient.post<HttpResponse<T>>(`${apiUrl}/${path}`, object))
      );
  }

  put<T>(path: string, object: T): Observable<HttpResponse<T>> {
    return this.apiUrl$
      .pipe(
        switchMap(apiUrl => this.httpClient.put<HttpResponse<T>>(`${apiUrl}/${path}`, object))
      );
  }

  delete(path: string): Observable<HttpResponse<null>> {
    return this.apiUrl$
      .pipe(
        switchMap(apiUrl => this.httpClient.delete<HttpResponse<null>>(`${apiUrl}/${path}`))
      );
  }
}