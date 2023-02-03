import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';

import { ITodo } from './models/todo.interface';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: {
    [key: string]: Subscription,
  } = {};
  todos: ITodo[] = [];

  constructor(
    private readonly todoService: TodosService,
  ) {}

  ngOnInit(): void {
    this.todoService.getTodos().pipe(
      take(1)
    ).subscribe();

    this.subscriptions['todos'] = this.todoService.$todos.subscribe(data => {
      this.todos = data;
    });
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions).forEach(key => {
      if (this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe();
      }
    })
  }

  setupInitialData(): void {
    this.subscriptions['initData'] = this.todoService.setupInitialData().subscribe();
  }
}
