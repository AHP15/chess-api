import request from "supertest";
import { signup } from "../../controllers/user.controller";
import dotenv from "dotenv";
import DB from "../../models/index.js";


dotenv.config();

describe("Test the signup controller", () => {
    let userId;
    beforeEach(async () => {
        await DB.mongoose.connect(process.env.CONNECTION_URL);
    });

    afterEach(async () => {
        await DB.user.findByIdAndDelete(userId);
        await DB.mongoose.disconnect();
    });

    test("It should insert one document to the collection", async () => {
        // Arrange
        const User = DB.user;
        const mockUser = {
            username: "username",
            email: "username@gmail.com",
            password: "kljsfdlmsdlsmdds",
        };

        // Act
        const user = await User.create(mockUser);
        const createdUser = await User.findById(user._id);
        const createdData = {
            username: createdUser.username,
            email: createdUser.email,
        }
        const insertedData = {
            username: mockUser.username,
            email: mockUser.email,
        };
        userId = createdUser._id;

        // Assertion
        expect(createdData).toEqual(insertedData);
    });

});