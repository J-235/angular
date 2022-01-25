import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeLast, takeUntil } from 'rxjs/operators';
import { Config } from '../models/Config';
import { defaultEvaluation } from '../models/Evaluation';
import { ConfigService } from '../services/config.service';
import { BATCH_SIZE, EVALUATION_TABLE_CAPACITY } from '../utils/app.constants';
import { asyncData } from 'src/app/utils/async-observable-helpers';
import { StreamableTableDirective } from 'src/app/directives/streamable-table.directive';
import { DirectiveTestComponent } from './directive-test.component';

describe('DirectiveTestComponent', () => {

  const mockApiUrl = 'apiUrl';
  const baseUrl = 'evaluation/employee';
  const onDestroy$ = new Subject<void>();
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let configService: ConfigService;
  let fixture: ComponentFixture<DirectiveTestComponent>;
  let component: DirectiveTestComponent;
  let directiveDebugElement: DebugElement;
  let directive: StreamableTableDirective;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(asyncData({ apiUrl: mockApiUrl, environment: 'local' } as Config));
    configService = new ConfigService(httpClientSpy);

    TestBed
      .configureTestingModule({
        imports: [MatTableModule, HttpClientModule],
        declarations: [DirectiveTestComponent, StreamableTableDirective],
        providers: [
          { provide: ConfigService, useValue: configService },
        ],
      })
      .compileComponents();

    fixture = TestBed.createComponent(DirectiveTestComponent);
    component = fixture.componentInstance;
    directiveDebugElement = fixture.debugElement.query(By.directive(StreamableTableDirective));
    directive = directiveDebugElement.injector.get(StreamableTableDirective) as StreamableTableDirective;
  });

  it('should set all inputs of the directive', () => {

    component.urlSortExtension = "test";
    component.triggerTableReload = true;

    const setUrlInnerExtensionSpy = spyOnProperty(directive, 'setUrlInnerExtension', 'set');
    const setUrlSortExtensionSpy = spyOnProperty(directive, 'setUrlSortExtension', 'set');
    const reloadTableSpy = spyOn(directive, 'reloadTable');

    // bind directive to component
    fixture.detectChanges();

    expect(directive.elementService).toBe(component.evaluationService);
    expect(directive.tableCapacity).toBe(EVALUATION_TABLE_CAPACITY);
    expect(setUrlInnerExtensionSpy).toHaveBeenCalledWith(`/${component.employeeId}`);
    expect(setUrlSortExtensionSpy).toHaveBeenCalledWith('test');
    expect(reloadTableSpy).toHaveBeenCalled();
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('assets/config/config.json');

  });

  it('should trigger the output of the directive', () => {

    const evaluations = [
      { ...defaultEvaluation },
      { ...defaultEvaluation },
      { ...defaultEvaluation },
    ];

    spyOn(component, 'updateDataSource');

    // bind directive to component
    fixture.detectChanges();

    directive.data.emit(evaluations);

    expect(component.updateDataSource).toHaveBeenCalledOnceWith(evaluations);
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('assets/config/config.json');

  });

  it('should publish to the observable of the component', () => {

    const evaluations = [
      { ...defaultEvaluation },
      { ...defaultEvaluation },
      { ...defaultEvaluation },
    ];

    component.dataSource$
      .pipe(takeLast(1))
      .subscribe(data => expect(data).toEqual(evaluations));

    // bind directive to component
    fixture.detectChanges();

    directive.data.emit(evaluations);

    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('assets/config/config.json');

  });

  it('should stream data into the dataSource of the table (integration test)', waitForAsync(() => {

    const evaluations = [
      { ...defaultEvaluation },
      { ...defaultEvaluation },
      { ...defaultEvaluation },
    ];

    const mockServerResponse = { content: evaluations };

    let mockTableDataSource = [];

    component.dataSource$
      .pipe(takeUntil(onDestroy$))
      .subscribe(data => mockTableDataSource = data);

    httpClientSpy.get.and.returnValue(asyncData(mockServerResponse));

    // bind directive to component
    fixture.detectChanges();
    fixture.whenStable().then(() => {

      expect(httpClientSpy.get).toHaveBeenCalledTimes(6);
      expect(httpClientSpy.get).toHaveBeenCalledWith('assets/config/config.json');
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${mockApiUrl}/${baseUrl}/${component.employeeId}?page=0&size=${BATCH_SIZE}`);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${mockApiUrl}/${baseUrl}/${component.employeeId}?page=1&size=${BATCH_SIZE}`);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${mockApiUrl}/${baseUrl}/${component.employeeId}?page=2&size=${BATCH_SIZE}`);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${mockApiUrl}/${baseUrl}/${component.employeeId}?page=3&size=${BATCH_SIZE}`);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${mockApiUrl}/${baseUrl}/${component.employeeId}?page=4&size=${BATCH_SIZE}`);
      expect(mockTableDataSource).toHaveSize(EVALUATION_TABLE_CAPACITY * BATCH_SIZE);

    });
  }));

  afterAll(() => {
    onDestroy$.next();
  });
});
