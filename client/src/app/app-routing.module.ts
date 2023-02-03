import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';

const routes: Routes = [
  {
    path: 'details/:id',
    component: TodoDetailsComponent,
  },
  {
    path: 'add',
    component: AddTodoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
