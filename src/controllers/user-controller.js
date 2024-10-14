import userService from "../services/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);

        if (result) {
            res.status(200).json({
                data: result,
            });
        }
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        if (result) {
            res.status(200).json({
                data: result,
            });
        }
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        // Jika user ditemukan, lanjutkan dengan logika mendapatkan data
        const username = req.user.username;
        const result = await userService.get(username);

        // Mengirim respon dengan data
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const request = req.body;
        const username = req.user.username;

        if (req.body.username) {
            request.username = req.body.username;
        } else {
            request.username = req.user.username;
        }

        const result = await userService.update(request, username);

        if (result) {
            res.status(200).json({
                data: result,
            });
        }
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await userService.logout(req.user.username);
        if (result) {
            res.status(200).json({
                data: "OK",
            });
        }
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login,
    get,
    update,
    logout,
};
