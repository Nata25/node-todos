import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, switchMap, take } from 'rxjs';

import { ITodo } from './models/todo.interface';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  todos: ITodo[] = [];
  subscription!: Subscription;


  constructor(
    private readonly router: Router,
    private readonly todoService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todoService.$todos.subscribe(data => {
      this.todos = data;
    })

    this.todoService.getTodos().pipe(
      take(1)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  
  unsubscribe(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  setupInitialData(): void {
    this.unsubscribe();
    this.subscription = this.todoService.setupInitialData().subscribe(todos => {
      this.todos = todos;
    });
  }

  goToEditTodo(id: string | number): void {
    this.router.navigate([`/details/${id}`]);
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
