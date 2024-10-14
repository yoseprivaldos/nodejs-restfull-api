import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import {
    createContactValidation,
    getContactValidation,
    searchContactValidation,
    updateContactValidation,
} from "../validations/contact-validation.js";
import { getUserValidation } from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";

const create = async (username, request) => {
    const contact = validate(createContactValidation, request);
    const usernameValid = validate(getUserValidation, username);

    contact.username = usernameValid;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });
};

const get = async (user, contactId) => {
    contactId = validate(getContactValidation, contactId);

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contactId,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });

    if (!contact) {
        throw new ResponseError(404, "contact is not found");
    }

    return contact;
};

const update = async (user, contactId, request) => {
    const contactIdValid = validate(getContactValidation, contactId);
    const username = validate(getUserValidation, user.username);
    const requestBody = validate(updateContactValidation, request);

    const totalContact = await prismaClient.contact.count({
        where: {
            id: contactIdValid,
            username: username,
        },
    });

    if (totalContact !== 1) {
        throw new ResponseError(404, "contact tidak ditemukan");
    }
    //simpan request
    return prismaClient.contact.update({
        data: {
            first_name: requestBody.first_name,
            last_name: requestBody.last_name,
            email: requestBody.email,
            phone: requestBody.phone,
        },
        where: {
            id: contactIdValid,
            username: username,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
        },
    });
};

const remove = async (user, contactId) => {
    const contactIdValid = validate(getContactValidation, contactId);
    const username = validate(getUserValidation, user.username);

    const contact = await prismaClient.contact.findUnique({
        where: {
            id: contactIdValid,
            username: username,
        },
    });

    if (!contact) {
        throw new ResponseError(404, "Contact is snot found");
    }

    return prismaClient.contact.delete({
        where: {
            id: contactIdValid,
        },
    });
};

// as we know data request will be like
// name [first_name, last_name]
// email
// phone
// page (page number)
// size (size per page)

const search = async (user, request) => {
    // const requestValid = validate(searchContactValidation, request);
    request = validate(searchContactValidation, request);

    const skip = (request.page - 1) * request.size;

    const filters = [];

    filters.push({
        username: user.username,
    });

    if (request.name) {
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name,
                    },
                },
                {
                    last_name: {
                        contains: request.name,
                    },
                },
            ],
        });
    }

    if (request.email) {
        filters.push({
            email: {
                contains: request.email,
            },
        });
    }

    if (request.phone) {
        filters.push({
            phone: {
                contains: request.phone,
            },
        });
    }

    const results = await prismaClient.contact.findMany({
        where: {
            AND: filters,
        },
        take: request.size,
        skip: skip,
    });

    if (!results) {
        throw new ResponseError(404, "contact is not found");
    }

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters,
        },
    });

    return {
        data: results,
        paging: {
            page: request.page,
            total_page: Math.ceil(totalItems / request.size),
            total_item: totalItems,
        },
    };
};

export default { create, get, update, remove, search };
