import { Router } from 'express';

import { createGame, getGames, getUsers, getCharacters, refreshScores, deleteGame} from '../controllers/games.js';

const router = Router();

router.post('/', createGame);

router.get('/', getGames);
router.get('/users', getUsers);
router.get('/characters', getCharacters);

router.patch('/scores', refreshScores);

router.delete('/:id', deleteGame);

export default router;