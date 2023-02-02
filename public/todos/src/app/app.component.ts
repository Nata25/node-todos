import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';

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

  // to quickly save data for new todo
  newTodo = '';
  newUser = '';
  isDone = false;


  constructor(
    private readonly todoService: TodosService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.todoService.getTodos().subscribe(data => {
      this.todos = data;
    });
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

  saveTodo(): void {
    this.unsubscribe();
    this.subscription = this.todoService.addNewTodo({
      _id: -1,
      username: this.newUser,
      todo: this.newTodo,
      isDone: this.isDone,
    }).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe(data => {
      this.todos = data;
      this.newTodo = '';
      this.newUser = '';
      this.isDone = false;
    });
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
