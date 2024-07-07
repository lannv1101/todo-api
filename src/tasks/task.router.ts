import { Router } from 'express';
import { taskController } from './task.controller';
import {
  createValidator,
  updateValidator,
} from './task.validator';
export const tasksRouter: Router = Router();

//create a default route
tasksRouter.get('/tasks', taskController.getAll);

tasksRouter.post(
  '/tasks',
  createValidator,
  taskController.create,
);

tasksRouter.put(
  '/tasks',
  updateValidator,
  taskController.update,
);
