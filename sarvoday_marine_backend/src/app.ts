import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import UserRoutes from '@src/infrastructure/http/routes/user.routes';
import ServiceRoutes from '@src/infrastructure/http/routes/service.routes';
import ClientRoutes from '@src/infrastructure/http/routes/client.routes';
import EmployeeRoutes from '@src/infrastructure/http/routes/employee.routes';
import LocationRotes from '@src/infrastructure/http/routes/location.routes';
import SalesOrderRoutes from '@src/infrastructure/http/routes/salesOrder.routes';
import ReportRoutes from '@src/infrastructure/http/routes/report.routes';
import morgan from 'morgan';
import hemlet from 'helmet';
import * as dotenv from 'dotenv-safe';
dotenv.config();
import { errorMiddleware } from '@src/shared/middleware/error.middleware';
import { loggerMiddleware } from '@src/shared/middleware/logger.middleware';

class App {
  public express: Application;
  public port: number;
  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseconnection();
    this.initialiseMiddleware();
    this.initialiseRoutes();
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(hemlet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(loggerMiddleware);
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseRoutes(): void {
    this.express.use('/api/users/', UserRoutes);
    this.express.use('/api/services/', ServiceRoutes);
    this.express.use('/api/locations/', LocationRotes);
    this.express.use('/api/clients/', ClientRoutes);
    this.express.use('/api/employees/', EmployeeRoutes);
    this.express.use('/api/orders/', SalesOrderRoutes);
    this.express.use('/api/reports/', ReportRoutes);
  }

  private initialiseErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  private initialiseDatabaseconnection(): void {
    // const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    mongoose.connect(`${process.env.MONGO_PATH ?? ''}/sarvoday_marine_db`);
  }

  public listen() {
    this.express.listen(this.port, '0.0.0.0', () => {
      console.log(`Backend Server is listen on port ${this.port}`);
    });
  }
}

export default App;
