import app from "../index.js"
import request from "supertest"
import { AppDataSource } from "../config/database.js"
import {faker} from '@faker-js/faker';

beforeAll(async ()=> {
    await AppDataSource.initialize();
})

afterAll(async ()=> {
    await AppDataSource.destroy();
})

describe("User Tests", () => {
    const randomUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName()
    };

    it("should register a User", async () => {
        const res = await request(app).post('/api/users/register').send(randomUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User Registered Succefully");
    });

    it("should not register a User with duplicate email", async () => {
        const res = await request(app).post('/api/users/register').send(randomUser);
        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Email is already taken");
    });

    it("should return 400 for a missing name", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            password: faker.internet.password(),
            name:""
        };
        const res = await request(app).post('/api/users/register').send(invalidUser);
        expect(res.status).toBe(400);
        console.log(res.body);
        expect(res.body.error).toContain('"name" is not allowed to be empty');
    });

    it("should return 400 for missing email", async () => {
        const invalidUser = {
            email: "",
            password: faker.internet.password(),
            name:faker.person.fullName(),
        };
        const res = await request(app).post('/api/users/register').send(invalidUser);
        expect(res.status).toBe(400);
        console.log(res.body);
        expect(res.body.error).toContain('"email" is not allowed to be empty');
    });

    it("should return 400 for missing password", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            password: "",
            name:faker.person.fullName(),
        };
        const res = await request(app).post('/api/users/register').send(invalidUser);
        expect(res.status).toBe(400);
        console.log(res.body);
        expect(res.body.error).toContain('"password" is not allowed to be empty');
    });

    it("should return 400 for invalid email format", async () => {
        const invalidUser = {
            email: "notanemail",
            password: faker.internet.password(),
            name: faker.person.fullName(),
        };
        const res = await request(app).post('/api/users/register').send(invalidUser);
        expect(res.status).toBe(400);
        console.log(res.body);
        expect(res.body.error).toContain('"email" must be a valid email');
    });

    it("should return 400 for insufficient password length", async () => {
        const invalidUser = {
            email: faker.internet.email(),
            password:"short",
            name: faker.person.fullName(),
        };
        const res = await request(app).post('/api/users/register').send(invalidUser);
        expect(res.status).toBe(400);
        console.log(res.body);
        expect(res.body.error).toContain('"password" length must be at least 6 characters long');
    });
    
})