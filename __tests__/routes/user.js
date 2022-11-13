import app from "../../app.js";
import request from "supertest";
import DB from "../../models/index.js";
import dotenv from "dotenv";

dotenv.config();

describe("Test the signup route", () => {
    
    beforeAll(async () => {
       await DB.mongoose.connect(process.env.CONNECTION_URL); 
    });
     
    afterAll(async () => {
        await DB.mongoose.disconnect();
    });


    test("It should response the POST method", async () => {
        // Arrange
        const user = {
            username: "username",
            email: "username@gmail.com",
            password: "kljsfdlmsdlsmdds",
        };

        // Act
        const response = await request(app)
                                .post("/api/v1/auth/signup")
                                .send(user);
        const {statusCode, _body} =  response;
        await DB.user.findByIdAndDelete(_body.user?._id);

        // Assertion
        expect(statusCode).toBe(201);
        expect(_body.seccuss).toBe(true);
        expect(_body.user.username).toBe(user.username);
        expect(_body.user.email).toBe(user.email);
    });

    test("It should check for missing data in the req body", async () => {
        // Arrange
        const user = {
            username: "username",
            email: "username@gmail.com",
        };

        // Act
        const response = await request(app)
                                .post("/api/v1/auth/signup")
                                .send(user);
        const {statusCode, _body} =  response;
        // Assertion
        expect(statusCode).toBe(400);
        expect(_body.seccuss).toBe(false);
        expect(_body.error).toMatch(/User validation failed/);
    });
    
    test("It should check for duplicate emails", async () => {
        // Arrange
        const user = {
            username: "duplicate",
            email: "duplicate@gmail.com",// this email already exist in DB
            password: "kljsfdlmsdlsmdds",
        };

        // Act
        const response = await request(app)
                                .post("/api/v1/auth/signup")
                                .send(user);
        const {statusCode, _body} =  response;

        // Assertion
        expect(statusCode).toBe(400);
        expect(_body.seccuss).toBe(false);
        expect(_body.error).toBe("Email aleardy exist!");
    });

    test("It should sanatize the req body", async () => {
        // Arrange
        const user = {
            username: "<script>code</script>",
            email: "code@gmail.com",
            password: "kljsfdlmsdlsmdds",
        };

        // Act
        const response = await request(app)
                                .post("/api/v1/auth/signup")
                                .send(user);
        const {statusCode, _body} =  response;
        await DB.user.findByIdAndDelete(_body.user?._id);
        
        // Assertion
        expect(statusCode).toBe(201);
        expect(_body.seccuss).toBe(true);
        expect(_body.user.username).toBe("&lt;script>code&lt;/script>");
    });

    test("It should protects from DDoS and brute force attacks", async () => {
        // Arrange
        const user = {
            username: "duplicate",
            email: "duplicate@gmail.com",// this email already exist in DB
            password: "kljsfdlmsdlsmdds",
        };
        
        // Act
        const queries = Array(11).fill(request(app).post("/api/v1/auth/signup").send(user));
        let responses = await Promise.all(queries);
        let lastResponse = responses[responses.length-1];
        let statusCode = lastResponse.statusCode;
        let _body = lastResponse._body;

        console.log(statusCode, _body);

        // Assertion
        expect(statusCode).toBe(429);
        expect(_body.seccuss).toBe(false);
        expect(_body.error).toBe("Too Many Requests");
    });
});
