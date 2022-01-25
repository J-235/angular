import { Subject } from 'rxjs';
import { Directive, AfterViewInit, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { StreamingService } from 'src/app/services/streaming.service';

const SINGLE_BATCH = 1;

@Directive({
  selector: '[testStreamableTable]'
})
export class StreamableTableDirective implements AfterViewInit, OnDestroy {

  dataCache: any[] = [];
  onDestroy$ = new Subject<void>();
  tableContainer: HTMLElement =  null;
  elementService: StreamingService<any> = null;
  tableCapacity: number = null;

  @Output() data = new EventEmitter<any[]>();

  @Input() set setElementService(service: StreamingService<any>) {
    this.elementService = service;
  };
  @Input() set setUrlInnerExtension(value: string) {
    if (this.elementService) this.elementService.setUrlInnerExtension(value);
  };
  @Input() set setUrlSortExtension(value: string) {
    if (this.elementService) this.elementService.setUrlSortExtension(value);
  };
  @Input() set triggerInitStream(trigger: boolean) {
    if (trigger) this.initStream();
  }
  @Input() set triggerTableReload(trigger: boolean) {
    if (trigger) this.reloadTable();
  };
  @Input() set setTableCapacity(value: number) {
    this.tableCapacity = value;
  };

  constructor(
    protected elementRef: ElementRef,
  ) {
    const table = this.elementRef.nativeElement as HTMLElement;
    this.tableContainer = table.parentElement;
  }

  ngAfterViewInit() {
    this.registerTableScrollEvent();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  initStream() {
    this.elementService.resetStream();
    this.elementService.stream$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(batch => {
        this.dataCache = [...this.dataCache, ...batch];
        this.data.emit(this.dataCache);
      });
    this.elementService.streamBatches(this.tableCapacity);
  }

  registerTableScrollEvent() {
    this.tableContainer.addEventListener('scroll', event => this.onScroll());
  }

  onScroll() {
    // table content changes >> reloadTable(n) >> empty table >> no scrollbar
    // >> scrollTop = 0 and scrollHeight = clientHeight >> triggers unwanted streaming >> case is excluded
    if (this.tableContainer.scrollTop !== 0 &&
      this.tableContainer.scrollTop === this.tableContainer.scrollHeight - this.tableContainer.clientHeight) {
      this.elementService.streamBatches(SINGLE_BATCH);
    }
  }

  reloadTable() {
    this.dataCache = [];
    this.elementService.resetStream();
    this.elementService.streamBatches(this.tableCapacity);
  }
}