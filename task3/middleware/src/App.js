import express from 'express';
import dotenv from 'dotenv';
import notFound from './middlewares/notFound.js';
import errorHandler from './controllers/errorController.js';
import router from './routes/index.js';
dotenv.config();

const app = express();
// 1) Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// 2) Routes
app.use('/api', router);
// 3) 404 (routes-оос ХОЙШ)
app.use(notFound);
// 4) Global error handler (хамгийн сүүлд)
app.use(errorHandler);
export default app;