import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import {
    createAddressValidation,
    getAddressIdValidation,
    updateAddressValidation,
} from "../validations/address-validation.js";
import { getContactValidation } from "../validations/contact-validation.js";
import { getUserValidation } from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";

const checkContactMustExist = async (contactId, user) => {
    const username = validate(getUserValidation, user.username);
    contactId = validate(getContactValidation, contactId);
    const contact = await prismaClient.contact.findFirst({
        where: {
            id: contactId,
            username: username,
        },
    });
    if (!contact) {
        throw new ResponseError(404, "Contact is not found ");
    }

    return contactId;
};

const create = async (contactId, request, user) => {
    contactId = await checkContactMustExist(contactId, user);
    const address = validate(createAddressValidation, request);

    address.contact_id = contactId;

    const result = await prismaClient.address.create({
        data: address,

        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });

    return result;
};

const get = async (addressId, contactId, user) => {
    contactId = await checkContactMustExist(contactId, user);

    addressId = validate(getAddressIdValidation, addressId);

    // cari address sesuai dengan id saja, karena username dan contactId sudah di cek diatas
    const address = await prismaClient.address.findUnique({
        where: {
            id: addressId,
            contact_id: contactId,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });

    // kasih response jika tidak ditemukan addressnya
    if (!address) {
        throw new ResponseError(404, "Address is not found");
    }

    return address;
};

const update = async (contactId, request, user) => {
    contactId = await checkContactMustExist(contactId, user);
    const address = validate(updateAddressValidation, request);

    for (const key in address) {
        if (address[key] === "") {
            address[key] = null;
        }
    }

    const totalAddressInDatabase = await prismaClient.address.count({
        where: {
            id: address.id,
            contact_id: contactId,
        },
    });

    if (totalAddressInDatabase !== 1) {
        throw new ResponseError(404, "Address is not found");
    }

    return prismaClient.address.update({
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code,
        },
        where: {
            id: address.id,
            contact_id: contactId,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });
};

const remove = async (addressId, contactId, user) => {
    contactId = await checkContactMustExist(contactId, user);
    addressId = validate(getAddressIdValidation, addressId);

    const address = await prismaClient.address.findUnique({
        where: {
            id: addressId,
            contact_id: contactId,
        },
    });

    if (!address) {
        throw new ResponseError(404, "Address is not found");
    }

    return prismaClient.address.delete({
        where: {
            id: addressId,
            contact_id: contactId,
        },
    });
};

const list = async (contactId, user) => {
    contactId = await checkContactMustExist(contactId, user);

    const result = await prismaClient.address.findMany({
        where: {
            contact_id: contactId,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true,
        },
    });

    if (!result) {
        throw new ResponseError(404, "Address is not found");
    }

    return result;
};

export default {
    create,
    get,
    update,
    remove,
    list,
};
