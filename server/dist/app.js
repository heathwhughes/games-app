import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import gamesRoutes from './routes/games.js';
import { initializeDatabase } from './db.js';
const { json } = bodyParser;
const app = express();
const port = 3000;
app.use(cors());
app.use(json());
app.use('/games', gamesRoutes);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
// Initialize DB first, then start the server
initializeDatabase().then((pool) => {
    if (!pool) {
        console.error("Database initialization failed. Exiting...");
        process.exit(1);
    }
    // app.listen(port);
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
