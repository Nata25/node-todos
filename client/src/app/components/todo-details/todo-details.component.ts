import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, map, of, switchMap, tap } from 'rxjs';

import { TodosService } from 'src/app/services/todos.service';
import { ITodoDetails } from 'src/app/models/todo.interface';
import { TodoAction } from 'src/app/models/todo-action.enum';
import { SubscriptionsComponent } from '../subscriptions.component';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent extends SubscriptionsComponent implements OnInit {
  isEditMode = false;
  todo$: BehaviorSubject<ITodoDetails | null> = new BehaviorSubject<ITodoDetails | null>(null);
  todoID!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly todoService: TodosService,
  ) { super(); }

  ngOnInit(): void {
    // Change data on every new todo selection
    this.subscriptions['router'] = this.route.params.pipe(
      map(data => data['id']),
      filter(id => Boolean(id)),
      tap(id => {
        this.todoID = id;
      }),
      switchMap((id: string) => this.todoService.getTodoDetails(id)),
      catchError(error => of(error.status)),
    )
      .subscribe((data: ITodoDetails | null) => {
        if (typeof data === 'number' && data === 404) {
          this.router.navigate(['/']);
        } else if (typeof data !== 'number') {
          this.todo$.next(data);
          this.isEditMode = false;
        }
      });

    this.subscriptions['todos'] = this.todoService.todoUpdate$.pipe(
      switchMap(todoChange => {
        // NOTE: do something only if changes apply to the current TODO
        if (todoChange.id === this.todoID) {
          if (todoChange.action === TodoAction.DELETE) {
            return of(TodoAction.DELETE); // need any truthy value to indicate deletion on the following step
          } else return this.todoService.getTodoDetails(this.todoID);
        }
        return of(null);
      }),
      ).subscribe(data => {
        if (data === TodoAction.DELETE) {
          this.router.navigate(['/']);
        } else if (data) {
        // Update todo details
          this.todo$.next(data as ITodoDetails);
        }
    });
  }

  deleteAttachment(): void {
    this.subscriptions['deleteAttachment'] = this.todoService.deleteAttachmentByTodoID(this.todoID).pipe(
      switchMap(() => this.todoService.getTodos()),
      switchMap(() => this.todoService.getTodoDetails(this.todoID)),
    )
      .subscribe(todoDetails => {
        this.todo$.next(todoDetails);
      });
  }
}
