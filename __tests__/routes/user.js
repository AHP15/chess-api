import app from "../../app.js";
import request from "supertest";
import DB from "../../models/index.js";
import dotenv from "dotenv";

dotenv.config();

const requests = {
    signup: request(app).post("/api/v1/auth/signup").send({
        username: "username",
        email: "username@gmail.com",
        password: "kljsfdlmsdlsmdds"
    }),
    validateSignup: request(app).post("/api/v1/auth/signup").send({
        username: "username",
        email: "username@gmail.com",
    }),
    duplicateSignup: request(app).post("/api/v1/auth/signup").send({
        username: "duplicate",
        email: "duplicate@gmail.com",// this email already exist in DB
        password: "kljsfdlmsdlsmdds",
    }),
    sanatizeSignup: request(app).post("/api/v1/auth/signup").send({
        username: "<script>code</script>",
        email: "code@gmail.com",
        password: "kljsfdlmsdlsmdds",
    }),

    signin: request(app).post("/api/v1/auth/signin").send({
        email: "duplicate@gmail.com",
        password: "kljsfdlmsdlsmdds",
    }),
    sanatizeSignin: request(app).post("/api/v1/auth/signin").send({
        email: "<script>code@gmail.com</script>",
        password: "kljsfdlmsdlsmdds",
    }),
};

jest.setTimeout(60000);

describe("Test the signup and signin routes", () => {
    let responses;
    let userIds = [];

    beforeAll(async () => {
        await DB.mongoose.connect(process.env.CONNECTION_URL, {
            dbName: 'chess',
        });
        // for performing the validation correctly for more info visit
        // https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
        // await DB.user.init();
        responses = await Promise.allSettled(Object.values(requests));
    });
    afterAll(async () => {
        await Promise.all(userIds);
        await DB.mongoose.disconnect();
    });

    // signup route
    test("It should respond to the post method for signup route", () => {
        const res = responses[0];
        const {statusCode, body} = res.value;
        userIds.push(DB.user.findByIdAndDelete(body.user._id));

        // Assertion
        expect(statusCode).toBe(201);
        expect(body.seccuss).toBe(true);
        expect(body.user.username).toBe("username");
    });
    test("It should validate the request body for signup route", () => {
        const res = responses[1];
        const {statusCode, body} = res.value;

        // Assertion
        expect(statusCode).toBe(400);
        expect(body.seccuss).toBe(false);
        expect(body.error).toMatch(/User validation failed/);
    });
    test("It should check for duplicate emails in signup route", () => {
        const res = responses[2];
        const {statusCode, body} = res.value;

        // Assertion
        expect(statusCode).toBe(400);
        expect(body.seccuss).toBe(false);
        expect(body.error).toBe("Email aleardy exist!");
    });
    test("It should sanatize the req body for signup route", () => {
        const res = responses[3];
        const {statusCode, body} = res.value;
        userIds.push(DB.user.findByIdAndDelete(body.user._id));

        // Assertion
        expect(statusCode).toBe(201);
        expect(body.seccuss).toBe(true);
        expect(body.user.username).toBe("&lt;script>code&lt;/script>");
    });


    // signin route
    test("It should response to the POST method in signin route", () => {
        const res = responses[4];
        const {statusCode, body} = res.value;

        // Assertion
        expect(statusCode).toBe(200);
        expect(body.seccuss).toBe(true);
        expect(body.user.username).toBe("duplicate");
    });
    test("It should sanatize the req body for signin route", () => {
        const res = responses[5];
        const {statusCode, body} = res.value;

        // Assertion
        expect(statusCode).toBe(404);
        expect(body.seccuss).toBe(false);
        expect(body.error).toBe(
            "user with email &lt;script>code@gmail.com&lt;/script> does not exist"
        );
    });
});
