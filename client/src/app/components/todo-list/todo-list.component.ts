import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';

import { ITodo } from 'src/app/models/todo.interface';
import { TodosService } from 'src/app/services/todos.service';
import { SortableKeys, SortDirection } from 'src/app/models/sorting.model';
import { SubscriptionsComponent } from '../subscriptions.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent extends SubscriptionsComponent implements OnInit {
  todos: ITodo[] = [];
  activeSorting = SortableKeys.DUE_DATE;
  activeSortDirection = SortDirection.DESC;

  SortableKeys = SortableKeys;
  SortDirection = SortDirection;

  constructor(
    private readonly todoService: TodosService,
  ) { super(); }

  ngOnInit(): void {
    this.subscriptions['todos'] = this.todoService.$todos.subscribe(data => {
      this.todos = data;
    });
  }

  deleteTodo(id?: string): void {
    if (id) {
      this.subscriptions['delete'] = this.todoService.deleteTodo(id).pipe(
        switchMap(() => this.todoService.getTodos()),
      )
      .subscribe(todos => {
        this.todos = todos;
      });
    }
  }

  markAsDone(id?: string): void {
    if (id) {
      const todo = this.todos.find(todo => todo._id === id);
      if (todo) {
        this.subscriptions['update'] = this.todoService.updateTodo(id, {
          isDone: true,
        }).pipe(
          switchMap(() => this.todoService.getTodos())
        )
        .subscribe(todos => {
          this.todos = todos;
        });
      }
    }
  }

  setSorting(query: SortableKeys): void {
    if (this.activeSorting !== query) {
      this.activeSorting = query;
      this.activeSortDirection = SortDirection.DESC;
    } else {
      this.activeSortDirection = this.activeSortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    }
    this.todoService.setSortParams({
      sort: this.activeSorting,
      direction: this.activeSortDirection,
    });
    this.subscriptions['sorting'] = this.todoService.getTodos().subscribe();
  }
}
