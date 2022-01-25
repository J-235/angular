import { Injectable } from '@angular/core';
import { StreamingService } from './streaming.service';
import { ConfigService } from './config.service';
import { Evaluation } from '../models/Evaluation';

const BASE_URL = 'evaluation/employee';

@Injectable()
export class EvaluationService extends StreamingService<Evaluation>{


  constructor(
    configService: ConfigService,

    ) {
      super(configService, BASE_URL);
  }
}