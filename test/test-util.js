import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test",
        },
    });
};

const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test",
        },
    });
};

const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test",
        },
    });
};

const removeTestContact = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "test",
        },
    });
};

const createTestContact = async () => {
    return await prismaClient.contact.create({
        data: {
            username: "test",
            first_name: "firstName",
            last_name: "lastName",
            email: "email@gmail.com",
            phone: "1234567890",
        },
    });
};

const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "test",
        },
    });
};

const createTestManyContact = async () => {
    for (let i = 1; i <= 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: `test`,
                first_name: `firstName${i}`,
                last_name: `lastName${i}`,
                email: `email${i}@gmail.com`,
                phone: `1234567890:${i}`,
            },
        });
    }
};

const createTestAddress = async (testContact) => {
    return await prismaClient.address.create({
        data: {
            country: "country",
            city: "city",
            province: "province",
            street: "street",
            postal_code: "12345",
            contact_id: testContact.id,
        },
    });
};

const removeTestAddress = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: "test",
            },
        },
    });
};

const getTestAddress = async (contact) => {
    return await prismaClient.address.findFirst({
        where: {
            contact_id: contact.id,
        },
    });
};

const createTestManyAddress = async (contact) => {
    for (let i = 1; i <= 15; i++) {
        await prismaClient.address.create({
            data: {
                contact_id: contact.id,
                postal_code: `pos${i}`,
                country: `country${i}`,
                province: `province${i}`,
                city: `city${i}`,
                street: `street${i}`,
            },
        });
    }
};

export {
    removeTestUser,
    createTestUser,
    getTestUser,
    removeTestContact,
    createTestContact,
    getTestContact,
    createTestManyContact,
    createTestAddress,
    removeTestAddress,
    getTestAddress,
    createTestManyAddress,
};
