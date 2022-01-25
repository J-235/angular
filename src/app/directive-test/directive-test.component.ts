import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from 'src/app/models/Evaluation';
import { ConfigService } from 'src/app/services/config.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EVALUATION_TABLE_CAPACITY } from 'src/app/utils/app.constants';

@Component({
  selector: 'app-directive-test',
  templateUrl: './directive-test.component.html',
  styleUrls: ['./directive-test.component.css'],
})
export class DirectiveTestComponent implements OnInit {

  columnsToDisplay = ['name', 'deadline'];
  dataSource$ = new BehaviorSubject<Evaluation[]>([]);
  employeeId = 'xyz123';

  // inputs for StreamableTableDirective
  evaluationService: EvaluationService = null;
  urlSortExtension: string = '';
  urlInnerExtension: string = '';
  tableCapacity: number = EVALUATION_TABLE_CAPACITY;
  triggerInitStream: boolean = false;
  triggerTableReload: boolean = false;

  constructor(
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.initStreamableTableDirective();
  }

  // both methods below are required for the use of StreamableTableDirective
  updateDataSource(dataSource: Evaluation[]) {
    this.dataSource$.next(dataSource);
  }
  // order of statements in function is important
  private initStreamableTableDirective() {
    this.evaluationService = new EvaluationService(this.configService);
    this.urlInnerExtension = '/' + this.employeeId;
    this.triggerInitStream = true;
  }
}
