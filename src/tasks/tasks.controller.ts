import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createtask.dto';
import { GetTaskFilterDto } from './dto/gettaskfilter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() getTaskFilterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(getTaskFilterDto).length) {
      return this.taskService.getTaskWithFilter(getTaskFilterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  // @Post()
  // createTask(@Body() body) {
  //   return this.taskService.createTask(body.title, body.description);
  // }
  //same thing as above

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }
  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }
}
