import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ITodo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  setupInitialData(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos/setup`);
  }

  getTodos(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.API_URL}/api/todos`);
  }

  addNewTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(`${environment.API_URL}/api/todos`, todo);
  }

  updateTodo(todo: ITodo): Observable<ITodo> {
    return this.http.put<ITodo>(`${environment.API_URL}/api/todos`, todo);
  }

  deleteTodo(id: string | number): Observable<ITodo> {
    return this.http.delete<ITodo>(`${environment.API_URL}/api/todos/${id}`);
  }
}
