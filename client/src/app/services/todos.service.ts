import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ITodo, ITodoDetails, ITodoForm } from '../models/todo.interface';
import { IAttachment } from '../models/attachment.interface';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  $todos = new BehaviorSubject<ITodo[]>([]);

  constructor(
    private readonly http: HttpClient,
  ) { }

  setupInitialData(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos/setup`).pipe(
      tap(data => {
        this.$todos.next(data);
      })
    );
  }

  getTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos`).pipe(
      tap(data => {
        this.$todos.next(data);
      }),
    );
  }

  saveTodo(todo: ITodoForm): Observable<ITodo> {
    const formData = new FormData();
    formData.append('username', todo.username);
    formData.append('todo', todo.todo);
    formData.append('isDone', todo.isDone.toString());
    formData.append('attachment', todo.attachment);
    if (todo._id) {
      // update existing todo
      formData.append('_id', (todo._id as string));
      return this.http.put<ITodo>(`${environment.API_URL}/api/todos`, formData);
    } else {
      // add new todo
      return this.http.post<ITodo>(`${environment.API_URL}/api/todos`, formData);
    }
  }

  updateTodo(todoID: string, params: { [key: string]: unknown }): Observable<ITodo> {
    return this.http.put<ITodo>(`${environment.API_URL}/api/todos/${todoID}`, params);
  }

  getTodoDetails(id: string): Observable<ITodoDetails> {
    return this.http.get<ITodoDetails>(`${environment.API_URL}/api/todos/${id}`);
  }

  deleteTodo(id: string): Observable<ITodo> {
    return this.http.delete<ITodo>(`${environment.API_URL}/api/todos/${id}`);
  }

  getAttachmentByTodoID(id: string): Observable<IAttachment> {
    return this.http.get<IAttachment>(`${environment.API_URL}/api/attachments/${id}`);
  }
}
