import app from "../../app.js";
import request from "supertest";
import DB from "../../models/index.js";
import dotenv from "dotenv";

dotenv.config();

const testPostMethod = async (body, url, status) => {
    // Arrange
    const user = body;

    // Act
    const response = await request(app)
        .post(url)
        .send(user);
    const { statusCode, _body } = response;
    if(url === "/api/v1/auth/signup") {
        await DB.user.findByIdAndDelete(_body.user?._id);
    }

    // Assertion
    expect(statusCode).toBe(status);
    expect(_body.seccuss).toBe(true);
    if(url === "/api/v1/auth/signup") {
        expect(_body.user.username).toBe(user.username);
    }
    expect(_body.user.email).toBe(user.email);
};

describe("Test the signup route", () => {
    
    beforeAll(async () => {
       await DB.mongoose.connect(process.env.CONNECTION_URL); 
    });


    test("It should response the POST method", async () => {
        await testPostMethod(
            {
                username: "username",
                email: "username@gmail.com",
                password: "kljsfdlmsdlsmdds"
            },
            "/api/v1/auth/signup",
            201
        );
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
});



describe('Test the signin route', () => {

    afterAll(async () => {
        await DB.mongoose.disconnect();
    });

    test("It should response to the POST method", async () => {
        await testPostMethod(
            {
                email: "duplicate@gmail.com",
                password: "kljsfdlmsdlsmdds",
            },
            "/api/v1/auth/signin",
            200
        );
    });

    test("It should sanatize the req body", async () => {
        // Arrange
        const user = {
            email: "<script>code@gmail.com</script>",
            password: "kljsfdlmsdlsmdds",
        };

        // Act
        const response = await request(app)
                                .post("/api/v1/auth/signin")
                                .send(user);
        const {statusCode, _body} =  response;
        
        // Assertion
        expect(statusCode).toBe(404);
        expect(_body.seccuss).toBe(false);
        expect(_body.error).toBe(
            "user with email &lt;script>code@gmail.com&lt;/script> does not exist"
        );
    });
});
