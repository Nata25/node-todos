import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Subscription, switchMap } from 'rxjs';

import { TodosService } from 'src/app/services/todos.service';
import { ITodo } from '../../models/todo.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  todoForm: FormGroup = new FormGroup({
    todo: new FormControl(''),
    username: new FormControl(''),
    isDone: new FormControl(false),
  });

  subscriptions: {
    [key: string]: Subscription,
  } = {};

  constructor(
    private readonly todoService: TodosService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subscriptions['route'] = this.route.params.pipe(
      map(data => data['id']),
      filter(id => Boolean(id)),
      switchMap((id: string) => this.todoService.getTodoDetails(id)),
    )
      .subscribe((data: ITodo) => {
        this.todoForm.patchValue({
          todo: data.todo,
          isDone: data.isDone,
          username: data.username,
        })
      });
  }

  ngOnDestroy(): void {
    Object.keys(this.subscriptions).forEach(key => {
      (this.subscriptions[key] as Subscription).unsubscribe();
    });
  }

  saveTodo(): void {
    if (this.subscriptions['saveTodo']) this.subscriptions['saveTodo'].unsubscribe();

    this.subscriptions['saveTodo'] = this.todoService.addNewTodo({
      _id: -1,
      username: this.todoForm.controls['username'].value,
      todo: this.todoForm.controls['todo'].value,
      isDone: this.todoForm.controls['isDone'].value,
    }).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe(() => {
      this.todoForm.reset();
    });
  }
}
