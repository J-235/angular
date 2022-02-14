import { Component } from '@angular/core';

interface NameDeadline {
  name: string,
  deadline: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  columnsToDisplay = ['name', 'deadline'];


  dataSource: NameDeadline[] = [
    { name: 'test', deadline: new Date()},
    { name: 'test', deadline: new Date()},
    { name: 'test', deadline: new Date()},
  ];
}
