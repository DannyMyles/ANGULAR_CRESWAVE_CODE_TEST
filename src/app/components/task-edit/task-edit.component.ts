import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute } from '@angular/router';
import { Tasklist } from 'src/app/tasklist/interface/tasklist';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskId: any;
  task: any;
  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<TaskEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  public statusList = this.taskService.TaskStatus

  ngOnInit(): void {
    this.task = { ...this.data }; 
  }
  
  updateTask(): void {
    let id = this.data.task._id;
    console.log("Data received:", id);
    if (!id) {
      console.error('Cannot update task: _id is undefined');
      return;
    }
  
    console.log("Updating task:", this.task);
    this.taskService.updateTask(id, this.task.title, this.task.description, this.task.status)
      .subscribe(
        () => {
          console.log(`Task with ID ${this.task._id} updated successfully`);
          Swal.fire('Success', 'Task updated successfully', 'success');
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating task:', error);
          Swal.fire('Error', 'Failed to update task', 'error');
        }
      );
  }
  
  
}
