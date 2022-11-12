import mongoose from "mongoose";
import User from './user.model.js';
import Game from './game.model.js';

const DB = {
    mongoose: mongoose,
    user: User,
    game: Game,
}

export default DB;