import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tasklist } from './tasklist/interface/tasklist';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments';
import { catchError, map } from 'rxjs/operators';

interface TaskRes {
  tasks: Tasklist[]
  }

@Injectable({
  providedIn: 'root',
})

export class TaskService {
   public TaskStatus = [
    "complete" ,
    "incomplete"
  ]
  constructor(private httpClient: HttpClient) {}

  private API_URL = environment.apiUrl;

  // Get Tasks
  getTasks(): Observable<Tasklist[]> {
    return this.httpClient.get<TaskRes>(`${this.API_URL}/tasks`).pipe(
      map((response) => {
        return response.tasks;
      }),
      catchError((error) => {
        console.error('Error fetching tasks:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  // Get Task by Id
  getTodolistById(id: number): Observable<Tasklist> {
    return this.httpClient.get<Tasklist>(`${this.API_URL}/tasks/${id}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching task by id:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }

  // Create Task
  createTasklist(title: string, description: string, status: string): Observable<Tasklist> {
    const formData = {
      title: title,
      description: description,
      status: status
    };
    return this.httpClient.post<Tasklist>(`${this.API_URL}/tasks`, formData).pipe(
      catchError((error: any) => {
        console.error('Error creating task:', error);
        return throwError('Failed to create task. Please try again later.');
      })
    );
  }
  updateTask(id: string, title: string, description: string, status: string): Observable<any> {
    const formData = {
      title: title,
      description: description,
      status: status
    };
    return this.httpClient.put(`${this.API_URL}/tasks/${id}`, formData);
  }
  
  deleteTask(id: String): Observable<any> {
    return this.httpClient.delete(`${this.API_URL}/tasks/${id}`);
}
}
