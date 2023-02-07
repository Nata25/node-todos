import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

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
  todo?: ITodoDetails;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly todoService: TodosService,
  ) { super(); }

  ngOnInit(): void {
    this.subscriptions['router'] = this.route.params.pipe(
      map(data => data['id']),
      filter(id => Boolean(id)),
      switchMap((id: string) => this.todoService.getTodoDetails(id)),
    )
      .subscribe((data: ITodoDetails) => {
        this.todo = data;
      });

    this.subscriptions['todos'] = this.todoService.$todos.subscribe(data => {
      const id = this.route.snapshot.params['id'];
      if (!data.find(todo => todo._id === id)) {
        this.router.navigate(['/']);
      }
    })
  }
}
