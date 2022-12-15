import app from "../../app.js";
import request from "supertest";
import DB from "../../models/index.js";
import dotenv from "dotenv";

dotenv.config();

const requests = {
  createGame: request(app).post("/api/v1/game/new").send({
    whitePlayer: "639744eec32888dd39c2c4c8",
    blackPlayer: "639744eec32888dd39c2c4c8",
    moves: [{
      publicName: 'move',
      info: {
        name: 'test',
        x: 1,
        y: 2,
        color: 'white',
      },
    }],
  }),
};

jest.setTimeout(60000);

describe("Test the create game route", () => {
  let responses;
  let gameIds = [];
  beforeEach(async () => {
    await DB.mongoose.connect(process.env.CONNECTION_URL, {
      dbName: 'chess',
    });
    responses = await Promise.allSettled(Object.values(requests));
  });
  afterEach(async () => {
    await Promise.all(gameIds);
    await DB.mongoose.disconnect();
  });

  test("It shoudl create a new game", () => {
    const res = responses[0];
    const {statusCode, body} = res.value;
    gameIds.push(DB.game.findByIdAndDelete(body.game._id))

    // Assertion
    expect(statusCode).toBe(201);
    expect(body.seccuss).toBe(true);
    expect(body.message).toBe("Game created!");
  });
});
