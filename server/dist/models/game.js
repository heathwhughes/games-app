export class Game {
    winner_user_id;
    loser_user_id;
    winner_character_id;
    loser_character_id;
    point_value;
    constructor(winner_user_id, loser_user_id, winner_character_id, loser_character_id, point_value) {
        this.winner_user_id = winner_user_id;
        this.loser_user_id = loser_user_id;
        this.winner_character_id = winner_character_id;
        this.loser_character_id = loser_character_id;
        this.point_value = point_value;
    }
}
