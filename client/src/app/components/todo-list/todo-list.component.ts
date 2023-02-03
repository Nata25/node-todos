import { Component, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';

import { ITodo } from 'src/app/models/todo.interface';
import { TodosService } from 'src/app/services/todos.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  subscription!: Subscription;
  todos: ITodo[] = [];

  constructor(
    private readonly todoService: TodosService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription = this.todoService.$todos.subscribe(data => {
      this.todos = data;
    });
  }

  goToEditTodo(id: string | number): void {
    this.router.navigate([`/details/${id}`]);
  }

  unsubscribe(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  deleteTodo(id: string | number): void {
    this.unsubscribe();
    this.subscription = this.todoService.deleteTodo(id).pipe(
      switchMap(() => this.todoService.getTodos())
    )
    .subscribe(todos => {
      this.todos = todos;
    });
  }

  markAsDone(id: string | number): void {
    this.unsubscribe();
    const todo = this.todos.find(todo => todo._id === id);
    if (todo) {
      this.subscription = this.todoService.updateTodo({
        ...todo,
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
