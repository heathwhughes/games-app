import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import gamesRoutes from './routes/games.js';
const { json } = bodyParser;
const { Client } = pg;
const app = express();
app.use(cors());
const port = 3000;
app.use(json());
app.use('/games', gamesRoutes);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(port);
