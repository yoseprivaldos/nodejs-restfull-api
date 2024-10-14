import supertest from "supertest";
import { web } from "../src/application/web";
import {
    createTestContact,
    createTestManyContact,
    createTestUser,
    getTestContact,
    removeTestContact,
    removeTestUser,
} from "./test-util";
import { logger } from "../src/application/logging";

describe("CONTACT TESTING", () => {
    describe("POST /api/contacts", () => {
        beforeEach(async () => {
            await createTestUser();
        });
        afterEach(async () => {
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to create contact", async () => {
            const result = await supertest(web)
                .post("/api/contacts")
                .set("Authorization", "test")
                .send({
                    first_name: "firstName",
                    last_name: "lastName",
                    email: "contact@gmail.com",
                    phone: "1234567890",
                });

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBeDefined();
            expect(result.body.data.first_name).toBe("firstName");
            expect(result.body.data.last_name).toBe("lastName");
            expect(result.body.data.email).toBe("contact@gmail.com");
            expect(result.body.data.phone).toBe("1234567890");
        });

        it("should reject to create contact when request is not valid", async () => {
            const result = await supertest(web)
                .post("/api/contacts")
                .set("Authorization", "test")
                .send({
                    first_name: "",
                    last_name: "lastName",
                    email: "invalidEmail",
                    phone: "123456789012341351341251234123535134",
                });

            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });
    });

    describe("GET /api/contacts/:contactId", () => {
        beforeEach(async () => {
            await createTestUser();
            await createTestContact();
        });
        afterEach(async () => {
            await removeTestContact();
            await removeTestUser();
        });

        it("should can get contact", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .get("/api/contacts/" + testContact.id)
                .set("Authorization", "test");

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(testContact.id);
            expect(result.body.data.first_name).toBe(testContact.first_name);
            expect(result.body.data.last_name).toBe(testContact.last_name);
            expect(result.body.data.email).toBe(testContact.email);
            expect(result.body.data.phone).toBe(testContact.phone);
        });

        it("should can get contact", async () => {
            const result = await supertest(web)
                .get("/api/contacts/" + 123)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
    });

    describe("PUT /api/contacts/:contactId", () => {
        beforeEach(async () => {
            await createTestUser();
            await createTestContact();
        });
        afterEach(async () => {
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to update contact with valid request", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .put("/api/contacts/" + testContact.id)
                .set("Authorization", "test")
                .send({
                    first_name: "firstNameUpdate",
                    last_name: "lastNameUpdate",
                    email: "emailupdate@gmail.com",
                    phone: "0987654321",
                });

            expect(result.status).toBe(200);
            expect(result.body.data.id).toBe(testContact.id);
            expect(result.body.data.first_name).toBe("firstNameUpdate");
            expect(result.body.data.last_name).toBe("lastNameUpdate");
            expect(result.body.data.email).toBe("emailupdate@gmail.com");
            expect(result.body.data.phone).toBe("0987654321");
        });

        it("should be reject update contact when use field first_name null", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .put("/api/contacts/" + testContact.id)
                .set("Authorization", "test")
                .send({
                    first_name: "",
                    last_name: "",
                    email: "invalidEmail",
                    phone: 123,
                });

            expect(result.status).toBe(400);
        });
    });

    describe("DELETE /api/contacts/:contactId", () => {
        beforeEach(async () => {
            await createTestUser();
            await createTestContact();
        });
        afterEach(async () => {
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to delete contact", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .delete("/api/contacts/" + testContact.id)
                .set("Authorization", "test");

            const testContactAfterDelete = await getTestContact();

            expect(result.status).toBe(200);
            expect(result.body.data).toBe("OK");
            expect(testContactAfterDelete).toBeNull();
        });

        it("should be reject delete contact when contact not found", async () => {
            const result = await supertest(web)
                .delete("/api/contacts/" + "12342351")
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
    });

    describe("GET /api/contacts", () => {
        beforeEach(async () => {
            await createTestUser();
            await createTestManyContact();
        });
        afterEach(async () => {
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to search data withoudt query", async () => {
            const result = await supertest(web).get("/api/contacts").set("Authorization", "test");

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(10);
            expect(result.body.paging.page).toBe(1);
            expect(result.body.paging.total_page).toBe(2);
            expect(result.body.paging.total_item).toBe(15);
        });

        it("should be able to search to page 2", async () => {
            const result = await supertest(web)
                .get("/api/contacts")
                .set("Authorization", "test")
                .query({ page: 2 });

            logger.info(result.body);

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(5);
            expect(result.body.paging.page).toBe(2);
            expect(result.body.paging.total_page).toBe(2);
            expect(result.body.paging.total_item).toBe(15);
        });

        it("should be able to search using name", async () => {
            const result = await supertest(web)
                .get("/api/contacts")
                .set("Authorization", "test")
                .query({ name: "firstName1" });

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(7);
            expect(result.body.paging.page).toBe(1);
            expect(result.body.paging.total_page).toBe(1);
            expect(result.body.paging.total_item).toBe(7);
        });

        it("should be able to search using email", async () => {
            const result = await supertest(web)
                .get("/api/contacts")
                .set("Authorization", "test")
                .query({ email: "email1" });

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(7);
            expect(result.body.paging.page).toBe(1);
            expect(result.body.paging.total_page).toBe(1);
            expect(result.body.paging.total_item).toBe(7);
        });

        it("should be able to search using phone", async () => {
            const result = await supertest(web)
                .get("/api/contacts")
                .set("Authorization", "test")
                .query({ phone: ":1" });

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(7);
            expect(result.body.paging.page).toBe(1);
            expect(result.body.paging.total_page).toBe(1);
            expect(result.body.paging.total_item).toBe(7);
        });
    });
});
