import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ITodo, ITodoDetails, ITodoForm } from '../models/todo.interface';
import { IAttachment } from '../models/attachment.interface';
import { ITodoWithAttachmentDTO } from '../models/todo-with-attachment-dto.interface';
import { defaultSortingOptions, ISortingOptions } from '../models/sorting.model';
import { TodoAction, ITodoActionTrigger } from '../models/todo-action.enum';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  public todos$ = new BehaviorSubject<ITodo[]>([]);
  /* NOTE: used to update todo details after changes syncronously with backend.
  Should emit after individual todo was updated/removed.
  Then we can look for the recent todo data in DB to update TodoDetails, which is lisneting for this subject. */
  public todoUpdate$ = new BehaviorSubject<ITodoActionTrigger>({ id: '' });

  /* NOTE: save sorting params in the service because relying on browser query string is not safe:
  we have child route for details but need to show sorted list to the left at the same time
  and preserving todo list query along with :todoID in route might look strange. */
  private sortParams = defaultSortingOptions;

  constructor(
    private readonly http: HttpClient,
  ) { }

  setupInitialData(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos/setup`).pipe(
      tap(data => {
        this.todos$.next(data);
      })
    );
  }

  setSortParams(params: ISortingOptions): void {
    this.sortParams = params;
  }

  getTodos(): Observable<ITodo[]> {
    let params = new HttpParams()
      .append('sort', this.sortParams.sort)
      .append('direction', this.sortParams.direction);

    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos`, {
      params
    }).pipe(
      tap(data => {
        this.todos$.next(data);
      }),
    );
  }

  saveTodo(todo: ITodoForm): Observable<ITodoWithAttachmentDTO> {
    const formData = new FormData();
    formData.append('username', todo.username);
    formData.append('todo', todo.todo);
    formData.append('isDone', todo.isDone.toString());
    formData.append('dueDate', todo.dueDate);
    formData.append('attachment', todo.attachment);
    if (todo.details) {
      formData.append('details', todo.details);
    }
    if (todo._id) {
      // Update existing todo from form
      formData.append('_id', (todo._id as string));
      return this.http.put<ITodoWithAttachmentDTO>(`${environment.API_URL}/api/todos`, formData).pipe(
        tap(() => {
          this.todoUpdate$.next({ id: todo._id as string, action: TodoAction.UPDATE });
        }),
      )
    } else {
      // Add new todo
      return this.http.post<ITodoWithAttachmentDTO>(`${environment.API_URL}/api/todos`, formData);
    }
  }

  // Simple update, no form data
  updateTodo(todoID: string, params: { [key: string]: unknown }): Observable<ITodo> {
    return this.http.put<ITodo>(`${environment.API_URL}/api/todos/${todoID}`, params).pipe(
      tap(() => {
        this.todoUpdate$.next({ id: todoID, action: TodoAction.UPDATE });
      }),
    );
  }

  getTodoDetails(id: string): Observable<ITodoDetails> {
    return this.http.get<ITodoDetails>(`${environment.API_URL}/api/todos/${id}`);
  }

  deleteTodo(id: string): Observable<ITodo> {
    return this.http.delete<ITodo>(`${environment.API_URL}/api/todos/${id}`).pipe(
      tap(() => {
        this.todoUpdate$.next({ id, action: TodoAction.DELETE });
      }),
    );
  }

  getAttachmentByTodoID(id: string): Observable<IAttachment> {
    return this.http.get<IAttachment>(`${environment.API_URL}/api/attachments/${id}`);
  }

  deleteAttachmentByTodoID(id: string): Observable<unknown> {
    return this.http.delete(`${environment.API_URL}/api/attachments/${id}`);
  }
}
