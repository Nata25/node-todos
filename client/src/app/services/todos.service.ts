import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ITodo } from '../models/todo.interface';

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
        console.log(data);
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

  addNewTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(`${environment.API_URL}/api/todos`, todo);
  }

  updateTodo(todo: ITodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${environment.API_URL}/api/todos`, todo);
  }

  getTodoDetails(id: string | number): Observable<ITodo> {
    return this.http.get<ITodo>(`${environment.API_URL}/api/todos/${id}`);
  }

  deleteTodo(id: string | number): Observable<ITodo> {
    return this.http.delete<ITodo>(`${environment.API_URL}/api/todos/${id}`);
  }
}
