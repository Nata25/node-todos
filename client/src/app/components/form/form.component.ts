import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { parseDateForDatepicker } from 'src/app/utils/parse-date';
import { TodosService } from 'src/app/services/todos.service';
import { SubscriptionsComponent } from '../subscriptions.component';
import { ITodoDetails } from '../../models/todo.interface';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends SubscriptionsComponent implements OnInit, OnChanges {
  @Input() todo: ITodoDetails | null = null;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  todoForm: FormGroup = new FormGroup({
    todo: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    isDone: new FormControl(false),
    details: new FormControl(''),
    dueDate: new FormControl(parseDateForDatepicker()),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly todoService: TodosService,
  ) { super(); }

  ngOnInit(): void {
    if (this.todo) {
      this.populateForm(this.todo);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && changes['todo'].currentValue) {
      this.populateForm(changes['todo'].currentValue);
    }
  }

  populateForm(source: ITodoDetails): void {
    const { todo, isDone, username, dueDate: originalDate, details } = source;
    const dueDate = parseDateForDatepicker(originalDate);
    this.todoForm.patchValue({
      todo,
      isDone,
      username,
      dueDate,
      details,
    });
  }

  saveTodo(): void {
    if (this.subscriptions['saveTodo']) this.subscriptions['saveTodo'].unsubscribe();
    this.subscriptions['saveTodo'] = this.todoService.saveTodo({
      _id: this.route.snapshot.params['id'],
      username: this.todoForm.controls['username'].value,
      todo: this.todoForm.controls['todo'].value,
      isDone: this.todoForm.controls['isDone'].value,
      details: this.todoForm.controls['details'].value,
      dueDate: this.todoForm.controls['dueDate'].value,
      attachment: this.fileInput.nativeElement.files[0],
    }).pipe(
      switchMap(() => this.todoService.getTodos())
    ).subscribe(() => {
      this.todoForm.patchValue({
        username: '',
        todo: '',
        isDone: false,
        dueDate: parseDateForDatepicker(),
      });
      this.fileInput.nativeElement.value = '';
      this.closed.emit();
    });
  }

  onCancel(): void {
    this.closed.emit();
  }
}
