import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './components/form/form.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { TodoDetailsComponent } from './components/todo-details/todo-details.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    AddTodoComponent,
    TodoDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
