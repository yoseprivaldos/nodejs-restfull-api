import supertest from "supertest";
import { web } from "../src/application/web";
import {
    createTestAddress,
    createTestContact,
    createTestManyAddress,
    createTestUser,
    getTestAddress,
    getTestContact,
    removeTestAddress,
    removeTestContact,
    removeTestUser,
} from "./test-util";

describe("ADDRESS TEST", () => {
    describe("POST /api/contacts/:contactId/addresses", () => {
        beforeEach(async () => {
            await createTestUser();
            await createTestContact();
        });
        afterEach(async () => {
            await removeTestAddress();
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to create address", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .post(`/api/contacts/${testContact.id}/addresses`)
                .set("Authorization", "test")
                .send({
                    country: "country",
                    city: "city",
                    province: "province",
                    street: "street",
                    postal_code: "12345",
                });

            expect(result.status).toBe(200);
            expect(result.body.data.country).toBe("country");
            expect(result.body.data.city).toBe("city");
            expect(result.body.data.province).toBe("province");
            expect(result.body.data.street).toBe("street");
            expect(result.body.data.postal_code).toBe("12345");
        });
        it("should be reject to create address when request invalid", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .post(`/api/contacts/${testContact.id}/addresses`)
                .set("Authorization", "test")
                .send({
                    country: "country",
                    city: "city",
                    province: "province",
                    street: "",
                    postal_code: "",
                });

            expect(result.status).toBe(400);
        });
        it("should be reject to create address when contactId invalid", async () => {
            const testContact = await getTestContact();

            const result = await supertest(web)
                .post(`/api/contacts/${testContact.id + 1}/addresses`)
                .set("Authorization", "test")
                .send({
                    country: "country",
                    city: "city",
                    province: "province",
                    street: "street",
                    postal_code: "12345",
                });

            expect(result.status).toBe(404);
        });
    });

    describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
        beforeEach(async () => {
            await createTestUser();
            const testContact = await createTestContact();
            await createTestAddress(testContact);
        });
        afterEach(async () => {
            await removeTestAddress();
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to get address", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);
            const result = await supertest(web)
                .get(`/api/contacts/${getContact.id}/addresses/${getAddress.id}`)
                .set("Authorization", "test");

            expect(result.status).toBe(200);
            expect(result.body.data.country).toBe("country");
            expect(result.body.data.city).toBe("city");
            expect(result.body.data.province).toBe("province");
            expect(result.body.data.street).toBe("street");
            expect(result.body.data.postal_code).toBe("12345");
        });

        it("should be reject to get address using invalid contactId", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);
            const result = await supertest(web)
                .get(`/api/contacts/${getContact.id + 100}/addresses/${getAddress.id}`)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });

        it("should be reject to get address using invalid AddressId", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);
            const result = await supertest(web)
                .get(`/api/contacts/${getContact.id}/addresses/${getAddress.id + 100}`)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
    });

    describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
        beforeEach(async () => {
            await createTestUser();
            const testContact = await createTestContact();
            await createTestAddress(testContact);
        });
        afterEach(async () => {
            await removeTestAddress();
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to update address", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .put(`/api/contacts/${getContact.id}/addresses/${getAddress.id}`)
                .set("Authorization", "test")
                .send({
                    country: "country update",
                    city: "city update",
                    province: "province update",
                    street: "street update",
                    postal_code: "54321",
                });

            expect(result.status).toBe(200);
            expect(result.body.data.country).toBe("country update");
            expect(result.body.data.city).toBe("city update");
            expect(result.body.data.province).toBe("province update");
            expect(result.body.data.street).toBe("street update");
            expect(result.body.data.postal_code).toBe("54321");
        });

        it("should be able to update address with few field", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .put(`/api/contacts/${getContact.id}/addresses/${getAddress.id}`)
                .set("Authorization", "test")
                .send({
                    country: "country update",
                    city: "",
                    province: "",
                    street: "",
                    postal_code: "54321",
                });

            expect(result.status).toBe(200);
            expect(result.body.data.country).toBe("country update");
            expect(result.body.data.city).toBeNull();
            expect(result.body.data.province).toBeNull();
            expect(result.body.data.street).toBeNull();
            expect(result.body.data.postal_code).toBe("54321");
        });
        it("should be reject to update address when required field not valid", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .put(`/api/contacts/${getContact.id}/addresses/${getAddress.id}`)
                .set("Authorization", "test")
                .send({
                    country: "", // cannot be empty string and must required
                    city: "",
                    province: "",
                    street: "",
                    postal_code: "", // cannot be empty string and must required
                });

            expect(result.status).toBe(400);
        });
    });

    describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
        beforeEach(async () => {
            await createTestUser();
            const testContact = await createTestContact();
            await createTestAddress(testContact);
        });
        afterEach(async () => {
            await removeTestAddress();
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to delete with valid data", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .delete(`/api/contacts/${getContact.id}/addresses/${getAddress.id}`)
                .set("Authorization", "test");

            expect(result.body.data).toBe("OK");
            expect(result.status).toBe(200);

            const getAddressAfterDelete = await getTestAddress(getContact);
            expect(getAddressAfterDelete).toBeNull();
        });
        it("should be reject to delete with invalid data contactId", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .delete(`/api/contacts/${getContact.id + 100}/addresses/${getAddress.id}`)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
        it("should be reject to delete with invalid data addressId", async () => {
            const getContact = await getTestContact();
            const getAddress = await getTestAddress(getContact);

            const result = await supertest(web)
                .delete(`/api/contacts/${getContact.id}/addresses/${getAddress.id + 100}`)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
    });

    describe("GET /api/contacts/:contactId/addresses", () => {
        beforeEach(async () => {
            await createTestUser();
            const testContact = await createTestContact();
            await createTestManyAddress(testContact);
        });
        afterEach(async () => {
            await removeTestAddress();
            await removeTestContact();
            await removeTestUser();
        });

        it("should be able to get all address", async () => {
            const getContact = await getTestContact();

            const result = await supertest(web)
                .get(`/api/contacts/${getContact.id}/addresses`)
                .set("Authorization", "test");

            expect(result.status).toBe(200);
            expect(result.body.data.length).toBe(15);
        });
        it("should be reject to get all address when contact invalid", async () => {
            const getContact = await getTestContact();

            const result = await supertest(web)
                .get(`/api/contacts/${getContact.id + 100}/addresses`)
                .set("Authorization", "test");

            expect(result.status).toBe(404);
        });
    });
});
