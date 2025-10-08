import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './src/middlewares/error.js';
import routes from './src/routes/index.js';

const app = express();

// middleware
app.use(helmet());
app.use(json({ limit: '2mb' }));
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use('/api', routes);

// 404 + error
app.use(notFound);
app.use(errorHandler);

export default app;
