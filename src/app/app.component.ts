import { Component } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { concatMap, delay, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ngOnInit() {

    // Because concatMap does not subscribe to the next observable until the previous completes,
    // the value from the source delayed by 2000ms will be emitted first.

    // mergeMap subscribes immediately to all inner observables, the observable with the lesser delay (1000ms) will emit, 
    // followed by the observable which takes 2000ms to complete.

    const source = observableOf(2000, 1000);
    
    // output: With concatMap: Delayed by: 4010ms, With concatMap: Delayed by: 2010ms
    const concatMapExample = source
      .pipe(concatMap(val => observableOf(`Delayed by: ${val}ms`)
      .pipe(delay(val))))
      .subscribe(val => console.log(`With concatMap: ${val}`));
    
    // output: With mergeMap: Delayed by: 1000ms, With mergeMap: Delayed by: 2000ms
    const mergeMapExample = source
      .pipe(mergeMap(val => observableOf(`Delayed by: ${val}ms`)
      .pipe(delay(val))))
      .subscribe(val => console.log(`With mergeMap: ${val}`));

    // output: With concatMap: calculated delay: 4005ms, With concatMap: calculated delay: 2005ms
    const multipleConcatMapExample = source
      .pipe(concatMap(val => this.double(val)),
            concatMap(val => this.addOffset(val)),
            concatMap(val => this.substractOffset(val)),
            concatMap(val => observableOf(`calculated delay: ${val}ms`)))
      .subscribe(val => console.log(`With concatMap: ${val}`));
  }

  private double(val: number): Observable<number> {
    return observableOf(val * 2);
  }

  private addOffset(val: number): Observable<number> {
    return observableOf(val + 10);
  }

  private substractOffset(val: number): Observable<number> {
    return observableOf(val - 5);
  }
}
