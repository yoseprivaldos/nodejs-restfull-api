import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
    username: Joi.string().required().max(100),
    password: Joi.string().required().max(100),
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(100).optional(),
});

const logOutValidation = Joi.string().max(100).required();

export {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation,
    getUserValidation,
    logOutValidation,
};
