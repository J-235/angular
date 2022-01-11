import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
interface Member {
  memberId: number,
  value: string
}
interface Group {
  groupId: number,
  value: Member[]
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  $observable1: Observable<string> = new Observable(subscriber => {
    subscriber.next('Hello');
    setTimeout(() => {
      subscriber.next('World!');
      subscriber.complete();
    }, 2000);
  });

  $observable2: Observable<Group[]> = new Observable(subscriber => {
    const data = [
      { groupId: 1, value: [
        { memberId: 1, value: 'first'},
        { memberId: 2, value: 'second'},
        { memberId: 3, value: 'third'},
      ] },
      { groupId: 2, value: [
        { memberId: 1, value: 'first'},
        { memberId: 2, value: 'second'},
        { memberId: 3, value: 'third'},
      ] },
      { groupId: 3, value: [
        { memberId: 1, value: 'first'},
        { memberId: 2, value: 'second'},
        { memberId: 3, value: 'third'},
      ] },
    ];
    setTimeout(() => {
      subscriber.next(data);
    }, 2000);
  });

  $observable3: Observable<Member> = new Observable(subscriber => {
    const data = [
      { : 1, value: 'first' };
    setTimeout(() => {
      subscriber.next(data)
    }, 2000);
  });


  searchGroup() {
    return this.$observable2;
  }

  ngOnInit(): void {

    const result = this.$observable2.pipe(
      switchMap(apiResponse => )
    )


  }
}
