import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import router from '../routers/index.js';
import { notFoundHandler } from '../middlewares/notFoundHandler.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_FILES_PATH } from '../controllers/path.js';

export function setupServer() {
    const app = express();

    app.use(express.json());

  app.use(cors());
  app.use(pinoHttp());
  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_FILES_PATH));

  app.use(router);

    app.use(notFoundHandler);
    app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}!`);
  });
}
