import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { CreateTaskDto } from './dto/createtask.dto';
import { GetTaskFilterDto } from './dto/gettaskfilter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepository: TaskRepository,
  ) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return await this.tasksRepository.find({ where: { user } });
  }
  async getTaskWithFilter(
    getTaskFilterDto: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.tasksRepository.getTask(getTaskFilterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne(id, { where: { user } });
    if (task) {
      return task;
    } else {
      throw new NotFoundException(`Task with this ${id} id does not exist`);
    }
  }

  async deleteTask(id: number, user: User) {
    try {
      const find = await this.getTaskById(id, user);
      if (find) {
        await this.tasksRepository.delete(id);
        return { message: 'Task deleted' };
      } else {
        return new BadRequestException(
          `Task with this ${id} id does not exist`,
        );
      }
    } catch (error) {
      return new NotFoundException();
    }
  }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    if (Object.values(TaskStatus).includes(status)) {
      const task = await this.getTaskById(id, user);
      task.status = status;
      this.tasksRepository.update(id, task);
      return task;
    }
  }
}
