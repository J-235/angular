import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

export interface Member {
  memberId: number,
  name: string
}
export interface Group {
  groupId: number,
  value: Member[]
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private httpClient: HttpClient,
  ) { }

  $observable1: Observable<string> = new Observable(subscriber => {
    subscriber.next('Hello');
    setTimeout(() => {
      subscriber.next('World!');
      subscriber.complete();
    }, 2000);
  });

  getGroups(url: string): Observable<Group[]> {
    return this.httpClient.get<Group[]>(url);
  }

  getMembers(url: string, id: number) {
    return this.httpClient.get<Member[]>(`${url}/${id}`);
  }
}
