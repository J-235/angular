import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';

interface Todo {
  id: number,
  description: string,
  deadline: string
}

const defaultTodo = {
  id: 0,
  description: '',
  deadline: ''
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  columnsCurrent = ['description', 'deadline'];
  private currentTodoCache: Todo[] = [];
  private currentTodoDataSource: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  public currentTodoDataSource$: Observable<Todo[]> = this.currentTodoDataSource.asObservable();

  columnsBacklog = ['description', 'deadline'];
  private todoBacklogCache: Todo[] = [];
  private todoBacklogDataSource: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  public todoBacklogDataSource$: Observable<Todo[]> = this.todoBacklogDataSource.asObservable();

  // @ViewChild(MatTable) currentTodoTable: MatTable<Todo>;
  @ViewChildren(MatTable) allTables: QueryList<MatTable<Todo>>;

  droppedElements: number[] = [];

  ngOnInit() {
    this.currentTodoCache.push(
      { ...defaultTodo, description: 'T1'}, 
      { ...defaultTodo, description: 'T2'}, 
      { ...defaultTodo, description: 'T3'}, 
    );
    this.currentTodoDataSource.next(this.currentTodoCache);
    this.todoBacklogCache.push(
      { ...defaultTodo, description: 'T4'}, 
      { ...defaultTodo, description: 'T5'}, 
      { ...defaultTodo, description: 'T6', deadline: '11.11.1111'}, 
    );
    this.todoBacklogDataSource.next(this.todoBacklogCache);
  }

  onDrop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.currentTodoCache, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        this.todoBacklogCache,
        this.currentTodoCache,
        event.previousIndex,
        event.currentIndex,
      );
      event.item.disabled = true;
    }

    // this.currentTodoTable.renderRows();
    for(let table of this.allTables) {
      table.renderRows();
    }
    
    console.log('current', this.currentTodoCache)
    console.log('backlog', this.todoBacklogCache)
  }

  // disable(row: Todo): boolean {
  //   if(row.deadline) return true;

  // }
}
