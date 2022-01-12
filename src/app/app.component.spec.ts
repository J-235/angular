import { HttpClient } from "@angular/common/http";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { defer } from "rxjs/internal/observable/defer";
import { switchMap } from "rxjs/operators";
import { AppComponent, Group, Member } from "./app.component";

/**
 * Create async observable that emits-once and completes
 * after a JS engine turn
 */
function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
}

describe('AppComponent Unit Tests', () => {
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(() => {

        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

        TestBed
            .configureTestingModule({
                imports: [],
                declarations: [AppComponent],
                providers: [
                    { provide: HttpClient, useValue: httpClientSpy },
                ],
            })
            .compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    it('should chain the observables returned from methods getGroups and getMembers'
    + 'in a way that the second async function call waits to get the result'
    + 'from the first async function call; pipe with ngrx switchMap does this job well, '
    + 'mergeMap would work too', fakeAsync(() => {

        //https://stackoverflow.com/questions/49596641/is-it-a-good-practice-using-observable-with-async-await

        const mockGroups: Group[] = [
            { groupId: 1243414, value: [] },
            { groupId: 4554534, value: [] },
            { groupId: 7745774, value: [] },
        ];

        const mockMembers: Member[] = [
            { memberId: 1, name: 'Test1' },
            { memberId: 2, name: 'Test2' },
            { memberId: 3, name: 'Test3' },
        ];

        const mockUrl = '';

        httpClientSpy.get.and.returnValue(asyncData(mockGroups));
        httpClientSpy.get.and.returnValue(asyncData(mockMembers));

        let result = '';

        component.getGroups(mockUrl).pipe(
            switchMap(groups => component.getMembers(mockUrl, groups[0].groupId)))
            .subscribe(members => result = members[0].name);

        tick();

        expect(result).toBe('Test1');
    }));
})