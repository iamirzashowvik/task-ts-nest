import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createtask.dto';
import { GetTaskFilterDto } from './dto/gettaskfilter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) getTaskFilterDto: GetTaskFilterDto,
    @Req() req,
  ): Promise<Task[]> | any {
    try {
      if (Object.keys(getTaskFilterDto).length) {
        return this.taskService.getTaskWithFilter(getTaskFilterDto, req.user);
      } else {
        return this.taskService.getAllTasks(req.user);
      }
    } catch (error) {
      return new BadRequestException(`error is ${error}`);
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<Task> {
    const user: User = req.user;
    return this.taskService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, req.user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.taskService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, req.user);
  }
}
