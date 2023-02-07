import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { ITodo } from 'src/app/models/todo.interface';
import { TodosService } from 'src/app/services/todos.service';
import { SubscriptionsComponent } from '../subscriptions.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent extends SubscriptionsComponent implements OnInit {
  todos: ITodo[] = [];

  constructor(
    private readonly todoService: TodosService,
    private readonly router: Router,
  ) { super(); }

  ngOnInit(): void {
    this.subscriptions['todos'] = this.todoService.$todos.subscribe(data => {
      this.todos = data;
    });
  }

  goToEditTodo(id?: string): void {
    if (id) {
      this.router.navigate([`/details/${id}`]);
    }
  }

  deleteTodo(id?: string): void {
    if (id) {
      this.subscriptions['delete'] = this.todoService.deleteTodo(id).pipe(
        switchMap(() => this.todoService.getTodos())
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
}
