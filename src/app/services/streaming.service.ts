import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import { ConfigService } from './config.service';
import { BATCH_SIZE } from 'src/app/utils/app.constants';

export abstract class StreamingService<T> extends RestService<T> {
  private batchNumber: number = 0;
  private urlInnerExtension: string = '';
  private urlSortExtension: string = '';
  private stream: Subject<T[]> = new Subject();
  public stream$: Observable<T[]> = this.stream.asObservable();

  constructor(
    protected configService: ConfigService,
    protected baseUrl: string,
  ) {
    super(configService, baseUrl);
  }

  streamBatches(n: number): void {
    this.retrieveBatch().subscribe((batch: T[]) => {
      this.stream.next(batch);
      this.batchNumber++;
      const batchesToStream = n - 1;
      if (batchesToStream > 0) this.streamBatches(batchesToStream);
    });
  }

  resetStream(): void {
    this.batchNumber = 0;
  }

  setUrlInnerExtension(extension: string): void {
    this.urlInnerExtension = extension;
  }

  setUrlSortExtension(extension: string): void {
    this.urlSortExtension = extension;
  }

  private retrieveBatch(): Observable<T[]> {
    return this.configService
      .get<Object>(this.buildBatchUrl())
      .pipe(
        map(object => object['content'])
      );
  }

  buildBatchUrl(): string {
    return `${this.baseUrl}${this.urlInnerExtension}?page=${this.batchNumber}&size=${BATCH_SIZE}${this.urlSortExtension}`;
  }
}