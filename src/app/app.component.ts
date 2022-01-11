import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  message1 = '';
  message2 = '';

  ngOnInit() {
    this.f1().then(result => this.message1 = result);
    this.f2();
  }

  private async f1(): Promise<string> {
    return 'f1 done';
  }

  private async f2(): Promise<void> {
    let result = await this.delay(3000);
    this.message2 = `f2 done after waiting ${result} seconds`;
  }

  private delay(ms: number): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms / 1000)
      }, ms);
    });
  }
}
