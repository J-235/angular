import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from "./config.service";
export abstract class RestService<T> {

  constructor(
    protected configService: ConfigService,
    protected baseUrl: string,
    ) {}

  retrieveAll(): Observable<T[]> {
    return this.configService
      .get<Object>(this.buildRelativeUrl())
      .pipe(
        map(object => object['content'])
      );
  }

  retrieveOne(id: number): Observable<T> {
    return this.configService.get<T>(this.buildRelativeUrl(id));
  }

  create(object: T): Observable<HttpResponse<T>> {
    return this.configService.post<T>(this.buildRelativeUrl(), object);
  }

  update(object: T, id: number): Observable<HttpResponse<T>> {
    return this.configService.put<T>(this.buildRelativeUrl(id), object);
  }

  delete(id: number): Observable<HttpResponse<null>> {
    return this.configService.delete(this.buildRelativeUrl(id));
  }

  private buildRelativeUrl(id?: number) {
    if (id !== null && id !== undefined) return `${this.baseUrl}/${id}`;
    else return `${this.baseUrl}`;
  }
}