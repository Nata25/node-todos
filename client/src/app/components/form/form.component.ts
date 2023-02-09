import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { TodosService } from 'src/app/services/todos.service';
import { SubscriptionsComponent } from '../subscriptions.component';
import { ITodoDetails } from '../../models/todo.interface';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends SubscriptionsComponent implements OnInit, OnChanges {
  @Input() todo?: ITodoDetails;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  todoForm: FormGroup = new FormGroup({
    todo: new FormControl(''),
    username: new FormControl(''),
    isDone: new FormControl(false),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoService: TodosService,
  ) { super(); }

  ngOnInit(): void {
    if (this.todo) {
      const { todo, isDone, username } = this.todo;
      this.todoForm.patchValue({
        todo,
        isDone,
        username,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && changes['todo'].currentValue) {
      const { todo, isDone, username } = changes['todo'].currentValue;
      this.todoForm.patchValue({
        todo,
        isDone,
        username,
      });
    }
  }

  saveTodo(): void {
    if (this.subscriptions['saveTodo']) this.subscriptions['saveTodo'].unsubscribe();
    this.subscriptions['saveTodo'] = this.todoService.saveTodo({
      _id: this.route.snapshot.params['id'],
      username: this.todoForm.controls['username'].value,
      todo: this.todoForm.controls['todo'].value,
      isDone: this.todoForm.controls['isDone'].value,
      attachment: this.fileInput.nativeElement.files[0],
    }).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe(() => {
      this.todoForm.patchValue({
        username: '',
        todo: '',
        isDone: false,
      });
      this.fileInput.nativeElement.value = '';
      this.closed.emit();
    });
  }

  onCancel(): void {
    this.closed.emit();
  }
}
