import bodyParser from 'body-parser';
import pg from 'pg';
import { Game } from '../models/game.js';
const { json } = bodyParser;
const { Client } = pg;
const Pool = pg.Pool;
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'game',
    password: 'password',
    port: 5432,
});
export const createGame = (req, res, next) => {
    const winner = req.body.winner_id;
    const loser = req.body.loser_id;
    const winner_character = req.body.winner_character_id;
    const loser_character = req.body.loser_character_id;
    const default_point_value = 1000;
    (async () => {
        try {
            let winner_points;
            let winner_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${winner} AND character_id = ${winner_character};`);
            console.log(`num winners returned (should be 1 or 0): ${winner_points_results.rowCount}`);
            if (winner_points_results.rowCount === 0) {
                await pool.query(`INSERT INTO users_characters (user_id, character_id, points) 
                    VALUES (${winner}, ${winner_character}, ${default_point_value});`);
                console.log("inserted new user/character for the winner");
                winner_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${winner} AND character_id = ${winner_character};`);
                console.log(`winner points after inserting new winner: ${winner_points_results.rows[0].points}`);
            }
            winner_points = winner_points_results.rows[0].points;
            console.log(`winner points: ${winner_points}`);
            let loser_points;
            let loser_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${loser} AND character_id = ${loser_character};`);
            console.log(`num losers returned (should be 1 or 0): ${loser_points_results.rowCount}`);
            if (loser_points_results.rowCount === 0) {
                await pool.query(`INSERT INTO users_characters (user_id, character_id, points) 
                    VALUES (${loser}, ${loser_character}, ${default_point_value});`);
                console.log("inserted new user/character for the loser");
                loser_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${loser} AND character_id = ${loser_character};`);
                console.log(`loser points after inserting new winner: ${loser_points_results.rows[0].points}`);
            }
            loser_points = loser_points_results.rows[0].points;
            console.log(`loser points: ${loser_points}`);
            const point_value = determineGamePointValue(winner_points, loser_points);
            console.log(`Game Point Value: ${point_value}`);
            const newGame = new Game(winner, loser, winner_character, loser_character, point_value);
            await pool.query(`INSERT INTO games (winner_user_id, loser_user_id, winner_character_id, loser_character_id, point_value) 
                VALUES (${newGame.winner_user_id}, ${newGame.loser_user_id}, ${newGame.winner_character_id}, ${newGame.loser_character_id}, ${newGame.point_value});`);
            const new_winner_points = winner_points + point_value;
            const new_loser_points = loser_points - point_value;
            await pool.query(`UPDATE users_characters SET points = ${new_winner_points} WHERE user_id = ${newGame.winner_user_id} AND character_id = ${newGame.winner_character_id}`);
            console.log(`New winner points: ${new_winner_points}`);
            await pool.query(`UPDATE users_characters SET points = ${new_loser_points} WHERE user_id = ${newGame.loser_user_id} AND character_id = ${newGame.loser_character_id}`);
            console.log(`New loser points: ${new_loser_points}`);
            res.status(200).json("game saved and rankings updated");
        }
        catch (error) {
            console.error(error);
        }
    })();
};
export const getGames = (req, res, next) => {
    (async () => {
        let playerChars = [];
        try {
            const playerChars_results = await pool.query(`SELECT uc.user_id, uc.character_id, u.name as player_name, c.name as character_name, uc.points 
                FROM users_characters uc 
                join users u on u.id = uc.user_id 
                join characters c on c.id =uc.character_id 
                order by uc.points desc;`);
            playerChars = playerChars_results.rows;
        }
        catch (error) {
            console.error(error);
        }
        let rankedPlayerChars = [];
        try {
            for (const playerChar of playerChars) {
                console.log(playerChar);
                let numGamesResult = await pool.query(`SELECT count(*) FROM games WHERE (winner_user_id = ${playerChar.user_id} AND winner_character_id = ${playerChar.character_id})
                    OR (loser_user_id = ${playerChar.user_id} AND loser_character_id = ${playerChar.character_id});`);
                let numGames = numGamesResult.rows[0].count;
                if (numGames > 5) {
                    rankedPlayerChars.push(playerChar);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
        res.status(200).json(rankedPlayerChars);
    })();
};
export const refreshScores = (req, res, next) => {
    (async () => {
        var games = [];
        try {
            const games_results = await pool.query('SELECT * FROM games ORDER BY id ASC;');
            games = games_results.rows;
        }
        catch (error) {
            console.error(error);
        }
        try {
            for (const game of games) {
                console.log(`game id = ${game.id}`);
                let winner_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${game.winner_user_id} AND character_id = ${game.winner_character_id};`);
                let winner_points = winner_points_results.rows[0].points;
                console.log(`winner points: ${winner_points}`);
                let loser_points_results = await pool.query(`SELECT points FROM users_characters WHERE user_id = ${game.loser_user_id} AND character_id = ${game.loser_character_id};`);
                let loser_points = loser_points_results.rows[0].points;
                console.log(`loser points: ${loser_points}`);
                const point_value = determineGamePointValue(winner_points, loser_points);
                console.log(`Game Point Value: ${point_value}`);
                await pool.query(`UPDATE games SET point_value = ${point_value} WHERE id = ${game.id}`);
                console.log("game points updated.");
                const new_winner_points = winner_points + point_value;
                const new_loser_points = loser_points - point_value;
                await pool.query(`UPDATE users_characters SET points = ${new_winner_points} WHERE user_id = ${game.winner_user_id} AND character_id = ${game.winner_character_id}`);
                console.log(`New winner points: ${new_winner_points}`);
                await pool.query(`UPDATE users_characters SET points = ${new_loser_points} WHERE user_id = ${game.loser_user_id} AND character_id = ${game.loser_character_id}`);
                console.log(`New loser points: ${new_loser_points}`);
            }
        }
        catch (error) {
            console.error(error);
        }
        res.status(200).json(games);
    })();
};
export const deleteGame = (req, res, next) => {
    // TODO?
};
function determineGamePointValue(winnerPoints, loserPoints) {
    let pointDifferential = Math.abs(winnerPoints - loserPoints);
    let [favored_point_value, upset_point_value] = calculatePointValues(pointDifferential);
    if (winnerPoints > loserPoints) {
        console.log('the favored player won');
        return favored_point_value;
    }
    console.log('either points were equal or there was an upset');
    return upset_point_value;
}
function calculatePointValues(differential) {
    if (differential <= 50) {
        return [25, 25];
    }
    else if (differential <= 150) {
        return [23, 31];
    }
    else if (differential <= 250) {
        return [21, 38];
    }
    else if (differential <= 350) {
        return [19, 44];
    }
    else if (differential <= 450) {
        return [17, 51];
    }
    else if (differential <= 550) {
        return [15, 57];
    }
    else if (differential <= 650) {
        return [13, 64];
    }
    else if (differential <= 750) {
        return [11, 70];
    }
    else if (differential <= 850) {
        return [9, 77];
    }
    else if (differential <= 950) {
        return [7, 83];
    }
    else if (differential <= 1050) {
        return [5, 90];
    }
    else if (differential <= 1150) {
        return [3, 96];
    }
    else {
        return [1, 103];
    }
}
