export class Game {
    constructor(public winner_user_id: number, public loser_user_id: number, public winner_character_id: number, public loser_character_id: number, public point_value: number) {}
}