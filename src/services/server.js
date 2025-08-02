import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { contactsAll } from './contacts.js';

export function setupServer() {
    const app = express();

    app.use(cors());
    app.use(pinoHttp());

    contactsAll(app)

    app.use((req, res) => {
        res.status(404).json({ massege: 'Not found' })
    });

    const PORT = process.env.PORT || 3000;

   app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}!`);
});

};