import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const gameSchema = new Schema({
    whitePlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "White player required"],
    },
    blackPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Black player required"],
    },
    moves: [{
        publicName: {
            type: String,
            required: [true, "publicName property required"]
        },
        info: {
            name: {
                type: String,
                required: [true, "info.name property required"]
            },
            x: {
                type: Number,
                required: [true, "info.x property required"]
            },
            y: {
                type: Number,
                required: [true, "info.y property required"]
            },
            color: {
                type: String,
                required: [true, "info.color property required"]
            },
            isFirstMove: Boolean,
            canPromote: Boolean,
        }
    }],
    pieaces: [],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createAt: Date,
});

gameSchema.methods.getGameData = function() {
    return this;
}

gameSchema.methods.addMove = function() {
    this.moves.set();
}

gameSchema.methods.setWinner = function(userId) {
    this.winner = userId;
}

export default model("Game", gameSchema);