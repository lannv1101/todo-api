import { Request, Response } from 'express';

import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import {
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

class TasksController {
  // Method for the get route
  public async getAll(
    req: Request,
    res: Response,
  ): Promise<Response> {
    // Declare a variable to hold all tasks
    let allTasks: Task[];

    // Fetch all tasks using the repository
    try {
      allTasks = await AppDataSource.getRepository(
        Task,
      ).find({
        order: {
          date: 'ASC',
        },
      });

      // Convert the tasks instance to an array of objects
      allTasks = instanceToPlain(allTasks) as Task[];

      return res.json(allTasks).status(200);
    } catch (errors) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  // Method for the post route
  public async create(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    //Create a new instance of the Task
    const newTask = new Task();

    // Add the required properties to the Task object
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    // Add the new task to the database
    let createdTask: Task;

    try {
      createdTask = await AppDataSource.getRepository(
        Task,
      ).save(newTask);

      // Convert the task instance to an object
      createdTask = instanceToPlain(createdTask) as Task;

      return res.json(createdTask).status(200);
    } catch (errors) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }

  // Method for the update route
  public async update(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }

    //Try find if the task exists
    let task: Task | null;

    try {
      task = await AppDataSource.getRepository(
        Task,
      ).findOne({
        where: { id: req.body.id },
      });
    } catch (errors) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }

    //Return 400 if task is null
    if (!task) {
      return res.status(400).json({
        error: 'The task with given ID does not exist',
      });
    }

    // Declare a variable for updateTask
    let updateTask: UpdateResult;

    //Update the task
    try {
      updateTask = await AppDataSource.getRepository(
        Task,
      ).update(
        req.body.id,
        plainToInstance(Task, { status: req.body.status }),
      );

      // Convert the task instance to an object
      updateTask = instanceToPlain(
        updateTask,
      ) as UpdateResult;

      return res.json(updateTask).status(200);
    } catch (errors) {
      return res
        .json({ error: 'Internal Server Error' })
        .status(500);
    }
  }
}

export const taskController = new TasksController();
