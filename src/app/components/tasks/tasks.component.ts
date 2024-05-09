import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Tasklist } from 'src/app/tasklist/interface/tasklist';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditComponent } from '../task-edit/task-edit.component';

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

  public statusList = this.taskService.TaskStatus

  constructor( private taskService: TaskService, private editDialog: MatDialog) {}
  ngOnInit(): void {
    this.getTasks();
  }
 
  getTasks() {
    this.taskService.getTasks().subscribe(
      (res: Tasklist[]) => {
        this.taskList = res
          this.dataSource = new MatTableDataSource<Tasklist>(res)
          this.dataSource.paginator = this.paginator
      },
      error => {
        console.error('Error fetching tasks:', error);
      }
    );
  }
  // Create new task
  createTodolist(): void {
    this.taskService.createTasklist(this.title, this.description, this.status).subscribe(
      (res: Tasklist) => {
        this.taskList.push(res);
        this.ngOnInit()
      },
      (error) => {
        console.error('Error creating todo:', error);
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
    this.taskService.deleteTask(id).subscribe(() => {
        this.ngOnInit()
        console.log(`Deleted task with id ${id}`);
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }
  
}
