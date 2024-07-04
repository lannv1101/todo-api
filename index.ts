import express, { Express } from 'express';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Task } from './src/tasks/tasks.entity';
import { tasksRouter } from './src/tasks/task.router';

// instantiate express app
const app: Express = express();
dotenv.config();

// Parse request Body
app.use(bodyParser.json());

//USe CORS install types as well
app.use(cors());

// create database connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [Task],
  synchronize: true,
});

// define server port
const port = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    // start listening to the requests on the default port
    app.listen(port);
    console.log('Data source has been initialized');
  })
  .catch((error) => {
    console.log(
      'Error during Data Source initialization',
      error,
    );
  });

app.use('/', tasksRouter);
