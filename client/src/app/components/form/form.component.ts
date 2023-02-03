import { Component, OnDestroy } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';

import { TodosService } from 'src/app/services/todos.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnDestroy {
  newTodo = '';
  newUser = '';
  isDone = false;

  subscription!: Subscription;

  constructor(
    private readonly todoService: TodosService,
  ) { }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  saveTodo(): void {
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.todoService.addNewTodo({
      _id: -1,
      username: this.newUser,
      todo: this.newTodo,
      isDone: this.isDone,
    }).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe(() => {
      this.newTodo = '';
      this.newUser = '';
      this.isDone = false;
    });
  }
}
