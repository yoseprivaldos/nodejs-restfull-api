import addressService from "../services/address-service.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const request = req.body;
        const result = await addressService.create(contactId, request, user);

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;
        const result = await addressService.get(addressId, contactId, user);

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;

        request.id = addressId;

        const result = await addressService.update(contactId, request, user);

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;

        await addressService.remove(addressId, contactId, user);
        res.status(200).json({
            data: "OK",
        });
    } catch (error) {
        next(error);
    }
};

const list = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contactId;

        const result = await addressService.list(contactId, user);

        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    create,
    get,
    update,
    remove,
    list,
};
