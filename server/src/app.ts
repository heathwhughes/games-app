import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

import gamesRoutes from './routes/games.js';

const { json } = bodyParser;
const { Client } = pg;

const app = express();
const port = 3000;

app.use(json());

app.use('/games', gamesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
});

app.listen(port);