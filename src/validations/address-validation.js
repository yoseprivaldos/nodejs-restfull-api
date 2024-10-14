import Joi from "joi";

const createAddressValidation = Joi.object({
    postal_code: Joi.string().max(5).required(),
    street: Joi.string().max(255).optional(),
    city: Joi.string().max(100).optional(),
    province: Joi.string().max(100).optional(),
    country: Joi.string().max(100).required(),
});

const getAddressIdValidation = Joi.number().positive().required().min(1);

const updateAddressValidation = Joi.object({
    id: Joi.number().min(1).required().positive(),
    street: Joi.string().max(255).optional().allow(""),
    city: Joi.string().max(100).optional().allow(""),
    province: Joi.string().max(100).optional().allow(""),
    country: Joi.string().max(100).required(),
    postal_code: Joi.string().max(5).required(),
});

export { createAddressValidation, getAddressIdValidation, updateAddressValidation };
