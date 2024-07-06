import { Router, Request, Response } from 'express';
import { TasksController } from './task.controller';
import { createValidator } from './task.validator';
import { validationResult } from 'express-validator';

export const tasksRouter: Router = Router();

//create a default route
tasksRouter.get(
  '/tasks',
  async (req: Request, res: Response) => {
    const taskController = new TasksController();
    const allTask = await taskController.getAll();
    res.json(allTask).status(200);
  },
);

tasksRouter.post(
  '/tasks',
  createValidator,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }
  },
);
