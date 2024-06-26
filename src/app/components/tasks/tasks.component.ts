import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Tasklist } from 'src/app/tasklist/interface/tasklist';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'status',"update","delete"];
  public dataSource = new MatTableDataSource<Tasklist>([])
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public taskList!: Tasklist[];
  
  public title: string = '';
  public description: string = '';
  public status: string = '';
  public isLoading: boolean = true
  public statusList = this.taskService.TaskStatus

  constructor( private taskService: TaskService, private editDialog: MatDialog, private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.getTasks();
  }
 
  getTasks() {
    this.isLoading = true;
    this.spinner.show();
    this.taskService.getTasks().subscribe(
      (res: Tasklist[]) => {
        this.taskList = res;
        this.dataSource = new MatTableDataSource<Tasklist>(res);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
        this.isLoading = false;
      },
      error => {
        this.spinner.hide();
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );
  }
  
  // Create new task
  createTodolist(): void {
    this.taskService.createTasklist(this.title, this.description, this.status).subscribe(
      (res: Tasklist) => {
        this.taskList.push(res);
        this.ngOnInit();
        Swal.fire('Success', 'Task created successfully', 'success');
        // Clear form fields
        this.title = '';
        this.description = '';
        this.status = '';
      },
      (error) => {
        console.error('Error creating todo:', error);
        Swal.fire('Error', 'Failed to create task', 'error');
      }
    );
  }
  
  

  updateTodoList(task: any) {
    console.log("TaskId here", task)
    const dialogRef = this.editDialog.open(TaskEditComponent, {
      width: '400px',
      data: { task },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  
  // Delete task
  deleteTodolist(id: string): void {
    console.log("Deleting task with id:", id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        },
        (error) => {
          console.error('Error deleting task:', error);
          Swal.fire('Error', 'Failed to delete task', 'error');
        });
      }
    });
  }
  
}
