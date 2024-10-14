import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("USER TESTING", () => {
    describe("POST /api/users", () => {
        // setiap kali testing fungsi berikut di jalankan
        afterEach(async () => {
            await removeTestUser();
        });

        // mengecek dengan data valid
        // mengecek dengan data invalid
        // mengecek dengan data duplicate

        it("should can register new user ", async () => {
            const result = await supertest(web).post("/api/users").send({
                username: "test",
                password: "rahasia",
                name: "test",
            });
            expect(result.status).toBe(200);
            expect(result.body.data.name).toBe("test");
            expect(result.body.data.username).toBe("test");
            expect(result.body.data.password).toBeUndefined();
        });

        it("should reject if requst if invalid", async () => {
            const result = await supertest(web).post("/api/users").send({
                username: "",
                password: "",
                name: "",
            });

            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });

        it("should reject if duplicate username ", async () => {
            let result = await supertest(web).post("/api/users").send({
                username: "test",
                password: "rahasia",
                name: "test",
            });

            result = await supertest(web).post("/api/users").send({
                username: "test",
                password: "rahasia",
                name: "test",
            });

            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });
    });

    describe("POST /api/users/login", () => {
        // setiap kali testing fungsi berikut di jalankan
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        // testing untuk valid data
        // testing untuk invalid data

        it("should can login with valid username and password ", async () => {
            const resultLogin = await supertest(web).post("/api/users/login").send({
                username: "test",
                password: "rahasia",
            });

            expect(resultLogin.status).toBe(200);
            expect(resultLogin.body.data.token).toBeDefined();
            expect(resultLogin.body.data.token).not.toBe("test");
        });

        it("should reject when login with invalid username or password ", async () => {
            const resultLogin = await supertest(web).post("/api/users/login").send({
                username: "username salah",
                password: "password salah",
            });

            expect(resultLogin.status).toBe(401);
            expect(resultLogin.body.data).toBeUndefined();
            expect(resultLogin.error).toBeDefined();
        });
    });

    describe("GET /api/users/current", () => {
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        // testing after log in with valid Header 'Authorization'
        // testing before log in (no Header)
        // testing with invalid token Header

        it("should be able to get current users", async () => {
            const request = await supertest(web)
                .get("/api/users/current")
                .set("Authorization", "test");

            expect(request.status).toBe(200);
            expect(request.body.data.username).toBe("test");
            expect(request.body.data.name).toBe("test");
        });

        it("should be reject when get user without login first", async () => {
            const request = await supertest(web).get("/api/users/current");

            expect(request.status).toBe(401);
            expect(request.body.errors).toBe("Unauthorization");
        });

        it("should be reject when use invalid token", async () => {
            const request = await supertest(web)
                .get("/api/users/current")
                .set("Authorization", "invalidToken");

            expect(request.status).toBe(401);
            expect(request.body.errors).toBe("Unauthorization");
        });
    });

    describe("PATCH /api/users/current", () => {
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        // testing dengan data valid
        // testing dengan sebagian data
        // testing update data username
        // testing dengan field sembarang

        it("should be able to update with valid request", async () => {
            const result = await supertest(web)
                .patch("/api/users/current")
                .set("Authorization", "test")
                .send({
                    name: "Test Nama Baru",
                    password: "TestPasswordBaru",
                });

            const user = await getTestUser();

            expect(await bcrypt.compare("TestPasswordBaru", user.password)).toBe(true);
            expect(result.status).toBe(200);
            expect(result.body.data.name).toBe("Test Nama Baru");
            expect(result.body.data.username).toBe("test");
        });

        it("should be able to update with only one valid data", async () => {
            const result = await supertest(web)
                .patch("/api/users/current")
                .set("Authorization", "test")
                .send({
                    name: "TestNamaBaru",
                });

            const user = await getTestUser();

            expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
            expect(result.status).toBe(200);
            expect(result.body.data.name).toBe("TestNamaBaru");
            expect(result.body.data.username).toBe("test");
        });

        it("should be reject when update username", async () => {
            const result = await supertest(web)
                .patch("/api/users/current")
                .set("Authorization", "test")
                .send({
                    username: "ubahUserName",
                });

            const user = await getTestUser();

            expect(result.status).toBe(400);
            expect(user.name).toBe("test");
            expect(user.username).toBe("test");
            expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
        });

        it("should be reject when updte with invalid token", async () => {
            const result = await supertest(web)
                .patch("/api/users/current")
                .set("Authorization", "invalidtoken")
                .send({
                    name: "invalid token",
                });

            const user = await getTestUser();

            expect(result.status).toBe(401);
            expect(user.name).toBe("test");
            expect(user.username).toBe("test");
            expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
        });

        it("should be reject when update using invalid field", async () => {
            const result = await supertest(web)
                .patch("/api/users/current")
                .set("Authorization", "test")
                .send({
                    virus: "inivirus",
                });

            const user = await getTestUser();

            expect(await bcrypt.compare("rahasia", user.password)).toBe(true);
            expect(result.status).toBe(400);
            expect(user.name).toBe("test");
            expect(user.username).toBe("test");
        });
    });

    describe("DELETE /api/users/logout", () => {
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        // logut ketika sudah login
        it("should be able to log out while user log in", async () => {
            const result = await supertest(web)
                .delete("/api/users/logout")
                .set("Authorization", "test");

            const user = await getTestUser();

            expect(result.status).toBe(200);
            expect(result.body.data).toBe("OK");
            expect(user.token).toBeNull();
        });

        it("should be reject to log out while user not log in", async () => {
            const result = await supertest(web).delete("/api/users/logout");

            const user = await getTestUser();

            expect(result.status).toBe(401);
            expect(result.body.errors).toBe("Unauthorization");
            expect(user.token).not.toBeNull();
        });
    });
});
