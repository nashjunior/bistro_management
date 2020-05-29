import 'dotenv/config';

import Youch from 'youch';

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routesBackend from '../routes/routesBack';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routesBackend);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const error = await new Youch(err, req).toJSON();
        return res.status(500).json(error);
      }
      /**
       * The user don't have to be able to know what error happened
       * */
      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
