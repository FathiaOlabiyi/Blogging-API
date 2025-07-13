const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");

beforeAll(done => mongoose.connection.once("open", done));
afterAll(done => mongoose.connection.close(done));

describe("Auth", () => {
    test("signup + login", async() => {
        const email = `u${Date.now()}@test.com`;

        const signupRes = await request(app).post("/api/signup").send({
            first_name: "Test",
            last_name: "User",
            email,
            password: "pass123"
        });
        expect(signupRes.statusCode).toBe(201);

        const loginRes = (await request(app).post("/api/login")).setEncoding({email, password: "pass123"});
        expect(loginRes.body).toHaveProperty("token");
    });
});