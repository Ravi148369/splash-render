/* eslint-disable class-methods-use-this */
import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import methodOverride from 'method-override';
import helmet from 'helmet';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import schedule from 'node-schedule';
import routes from './routes';
import models from './models';
import config from './config';
import loggers from './services/logger';
import appVersionMiddleware from './middlewares/app-version-middleware';
import scheduleJob from './services/schedule-job';
/**
 * Application startup class
 * @export
 * @class Bootstrap
 */
export default class Bootstrap {
  /**
   * Creates an instance of Bootstrap.
   * @param {object} app
   * @memberOf Bootstrap
   */
  constructor(app) {
    this.app = app;
    this.middleware();
    this.connectDb();
    this.routes();
    this.start();
  }

  /**
   * Load all middleware
   * @memberOf Bootstrap
   */
  middleware() {
    const { app } = this;
    const swaggerDefinition = {
      info: {
        title: 'REST API for splash Application',
        version: '1.0.0',
        description: 'This is the REST API for splash Application',
      },
      host: `${config.app.swaggerHost}`,
      basePath: '/api',
      securityDefinitions: {
        BearerAuth: {
          type: 'apiKey',
          description: 'JWT authorization of an API',
          name: 'Authorization',
          in: 'header',
        },
      },
    };

    const options = {
      swaggerDefinition,
      apis: ['./api-docs/*.yaml'],
    };

    const swaggerSpec = swaggerJSDoc(options);
    app.use(cors());
    app.use(
      bodyParser.urlencoded({
        extended: false,
      }),
    );
    app.use(bodyParser.json({ limit: '2000mb' }));
    app.use(compression());
    app.use(methodOverride());
    app.use(
      helmet({
        frameguard: {
          action: 'deny',
        },
      }),
    );
    if (config.app.environment === 'development') {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
    app.use('/assets', express.static(`${__dirname}/uploads`));
    app.use('/images', express.static(`${__dirname}/images`));
    app.use('/public', express.static(`${__dirname}/../public`));

    app.use((req, res, next) => {
      /** if (req.protocol === 'https') {
                  config.app.setBaseUrl(`https://${req.headers.host}/`);
              } else {
                config.app.setBaseUrl(`http://${req.headers.host}/`);
             } */
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });

    app.use('/api/*', appVersionMiddleware);
  }

  /**
   * Check database connection
   * @memberOf Bootstrap
   */
  connectDb() {
    const { sequelize } = models;
    sequelize
      .authenticate()
      .then(async () => {
        loggers.dailyLogger('dbStatus').info('Database connected successfully');
        await sequelize
          .sync()
          .then(() => {
            loggers.dailyLogger('dbStatus').info('Database sync successfully');
          })
          .catch((error) => {
            loggers
              .dailyLogger('dbStatus')
              .error(new Error(`Database syncing error ${error}`));
          });
      })
      .catch((error) => {
        loggers
          .dailyLogger('dbStatus')
          .error(new Error(`Database connection error ${error}`));
      });
  }

  /**
   * Load all routes
   * @memberOf Bootstrap
   */
  routes() {
    routes(this.app);
  }

  /**
   * Start express server
   * @memberOf Bootstrap
   */
  start() {
    const { app } = this;
    const port = app.get('port');
    // eslint-disable-next-line no-unused-vars
    const server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('Server has started on port %d', port);
    });
    this.scheduleJob();
  }

  /**
   * Execute schedule job
   * @memberOf Bootstrap
   */
  scheduleJob() {
    schedule.scheduleJob('*/30 * * * *', scheduleJob.deleteMedia);
    schedule.scheduleJob('*/10 * * * *', scheduleJob.deletePendingBookings);
  }
}
