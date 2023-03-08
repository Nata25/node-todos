import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';
import { environment } from 'src/environments/environment';

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
  imports: [RouterModule.forRoot(routes, {useHash: environment.production})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
