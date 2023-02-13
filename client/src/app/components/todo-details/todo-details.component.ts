import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';

import { SubscriptionsComponent } from '../subscriptions.component';
import { TodosService } from 'src/app/services/todos.service';
import { ITodoDetails } from 'src/app/models/todo.interface';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.scss']
})
export class TodoDetailsComponent extends SubscriptionsComponent implements OnInit {
  isEditMode = false;
  todo!: ITodoDetails;
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
    )
      .subscribe((data: ITodoDetails) => {
        this.todo = data;
        this.isEditMode = false;
      });

    // Navigate from details page if current todo was deleted
    this.subscriptions['todos'] = this.todoService.$todos.pipe(
      switchMap(data => {
        const id = this.route.snapshot.params['id'];
        if (!data.find(todo => todo._id === id)) {
          this.router.navigate(['/']);
        }
        // update todo details
        return this.todoService.getTodoDetails(this.todoID);
      }),
    ).subscribe(data => {
      this.todo = data;
    });
  }

  deleteAttachment(): void {
    if (this.todo) {
      this.subscriptions['deleteAttachment'] = this.todoService.deleteAttachmentByTodoID(this.todo._id as string).pipe(
        switchMap(() => this.todoService.getTodos()),
        switchMap(() => this.todoService.getTodoDetails(this.todoID)),
      )
        .subscribe(todoDetails => {
          this.todo = todoDetails;
        });
    }
  }

  onClosed(): void {
    this.isEditMode = false;
  }
}
