import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }, //default route
  { path: 'tasks', component: TasksComponent },
  {
    path: 'tasks/:id',
    children: [
      { path: '', redirectTo: 'updates', pathMatch: 'full' },
      { path: 'updates', component: TaskEditComponent },
    ],
  },
  { path: '**', component: TasksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
