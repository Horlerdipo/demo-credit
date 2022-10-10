import express from "express";
import helpers from "./helpers";
import UserService from "./users/user.service";

interface Error {
    status?: number;
    code?: number;
}

class AuthMiddleware {

    async run(request: express.Request, response: express.Response, next: express.NextFunction) {

        //GET HEADER FROM REQUEST
        const authHeader = request.header('auth-token');

        //IF NO AUTH HEADER,SEND ERROR MESSAGE
        if (!authHeader) {
            return response.status(400).json({
                statusCode: 400,
                message: "Authentication Token is Required in header",
                data: {}
            })
        }
        //CHECK IF TOKEN EXISTS IN DB
        const userInfo = await UserService.findUserWithIdentifier(authHeader,"token");
        if (!userInfo) {
            return response.status(400).json({
                statusCode: 400,
                message: "Authentication Token is Incorrect",
                data: {},
            })
        }
        //ADD USER ID TO LOCALS
        response.locals.user_id = userInfo.id;
        return next();
    }
}

export default new AuthMiddleware();