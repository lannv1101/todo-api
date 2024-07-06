import { instanceToPlain } from 'class-transformer';
import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';

export class TasksController {
  constructor(
    private taskRepository = AppDataSource.getRepository(
      Task,
    ),
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public async getAll(): Promise<Task[]> {
    // Declare a variable to hold all tasks
    let allTasks: Task[];

    // Fetch all tasks using the repository
    try {
      allTasks = await this.taskRepository.find({
        order: {
          date: 'ASC',
        },
      });
      // Convert the tasks instance to an array of objects
      allTasks = instanceToPlain(allTasks) as Task[];

      return allTasks;
    } catch (errors) {
      console.log(errors);
    }
  }
}
