import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { pinoHttp } from 'pino-http';

import { generalRouter, appRouter } from './routes/rootRouter';
import { appConfig } from './config/appConfig';
import { swaggerOptions } from './config/swaggerConfig';

import * as errorHandlerMiddleware from '@/middlewares/errorHandler';

const APP_PORT = appConfig.port;
const APP_HOST = appConfig.host;

const app = express();

app.set('port', APP_PORT);
app.set('host', APP_HOST);

app.use(compression());
app.use(helmet({ contentSecurityPolicy: true, crossOriginResourcePolicy: false, crossOriginEmbedderPolicy: false }));

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(pinoHttp());

app.use(generalRouter);
app.use('/api/v1', appRouter);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use(errorHandlerMiddleware.genericErrorHandler);
app.use(errorHandlerMiddleware.emptyBody);
app.use(errorHandlerMiddleware.bodyParser);
app.use(errorHandlerMiddleware.notFoundHandler);

export const server = app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Server started at http://${app.get('host')}:${app.get('port')}`);
});

export default app;
