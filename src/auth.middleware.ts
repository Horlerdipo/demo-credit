import express from "express";
import helpers from "./helpers";
import UserService from "./users/user.service";

interface Error {
    status?: number;
    code?: number;
}

class AuthMiddleware {

    async run(request: express.Request, response: express.Response, next: express.NextFunction) {

        const authHeader = request.header('auth-token');

        if (!authHeader) {
            return response.status(400).json({
                statusCode: 400,
                message: "Authentication Token is Required in header",
                data: {}
            })
        }
        const userInfo = await UserService.findUserByToken(authHeader);
        if (!userInfo) {
            return response.status(400).json({
                statusCode: 400,
                message: "Authentication Token is Incorrect",
                data: {},
            })
        }
        response.locals.user_id = userInfo.id;
        return next();
    }
}

export default new AuthMiddleware();