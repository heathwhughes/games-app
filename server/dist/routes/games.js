import { Router } from 'express';
import { createGame, getGames, refreshScores, deleteGame } from '../controllers/games.js';
const router = Router();
router.post('/', createGame);
router.get('/', getGames);
router.patch('/scores', refreshScores);
router.delete('/:id', deleteGame);
export default router;
