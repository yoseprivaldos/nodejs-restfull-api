import {
    getUserValidation,
    loginUserValidation,
    logOutValidation,
    registerUserValidation,
    updateUserValidation,
} from "../validations/user-validation.js";
import { validate } from "../validations/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

//service logic register
const register = async (request) => {
    //validasi data request (username, name, password)
    const validUser = validate(registerUserValidation, request);

    //cari apakah username sudah terdaftar di database
    const countUser = await prismaClient.user.count({
        where: {
            username: validUser.username,
        },
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    //secure password
    validUser.password = await bcrypt.hash(validUser.password, 10);

    //simpan ke database
    return prismaClient.user.create({
        data: validUser,
        select: {
            username: true,
            name: true,
        },
    });
};

//service logic login
const login = async (request) => {
    // cek validasi request
    const loginRequest = validate(loginUserValidation, request);

    // mencari data username dan password
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
        },
        select: {
            username: true,
            password: true,
        },
    });

    if (!user) {
        throw new ResponseError(401, "username or password wrong");
    }

    // membandingkan data password
    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordValid) {
        throw new ResponseError(401, "username or password wrong");
    }

    // membuat token
    const token = uuid().toString();

    // memberikan respon

    return prismaClient.user.update({
        data: {
            token: token,
        },
        where: {
            username: user.username,
        },
        select: {
            token: true,
        },
    });
};

const get = async (username) => {
    const validUsername = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: validUsername,
        },
        select: {
            username: true,
            name: true,
        },
    });

    if (!user) {
        throw new ResponseError(404, "user not found");
    }

    return user;
};

const update = async (request, username) => {
    const requestValid = validate(updateUserValidation, request);
    const usernameValid = validate(getUserValidation, username);

    if (requestValid.username !== usernameValid) {
        throw new ResponseError(400, "Can not change username");
    }

    const user = await prismaClient.user.findUnique({
        where: {
            username: usernameValid,
        },
    });

    if (!user) {
        throw new ResponseError(404, "User Not Found");
    }

    const data = {};
    if (requestValid.name) {
        data.name = requestValid.name;
    }

    if (requestValid.password) {
        data.password = await bcrypt.hash(requestValid.password, 10);
    }

    return prismaClient.user.update({
        data: data,
        where: {
            username: usernameValid,
        },
        select: {
            username: true,
            name: true,
        },
    });
};

const logout = async (username) => {
    const usernameValid = validate(logOutValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: usernameValid,
        },
    });

    if (!user) {
        throw new ResponseError(404, "User is not found");
    }

    return prismaClient.user.update({
        data: {
            token: null,
        },
        where: {
            username: usernameValid,
        },
        select: {
            username: true,
        },
    });
};

export default {
    register,
    login,
    get,
    update,
    logout,
};
