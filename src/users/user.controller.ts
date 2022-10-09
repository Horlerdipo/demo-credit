import express from "express";
import {validationResult} from "express-validator";
import UserService from "./user.service";
import helpers from "../helpers";

class UserController {

    async createUser(request: express.Request, response: express.Response) {

        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }
            const returnUser = await UserService.createUser({
                pin: request.body.pin,
                name: request.body.name,
                email: request.body.email,
            });
            response.status(returnUser.statusCode).json(returnUser);

        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: helpers.getErrorMessage(error),
                data: {}
            })
        }

    }

    async generateNewToken(request: express.Request, response: express.Response) {

        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            const serviceResponse = await UserService.generateNewToken({
                pin: request.body.pin,
                email: request.body.email,
            });
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: helpers.getErrorMessage(error),
                data: {}
            })
        }
    }

    async userDetails(request: express.Request, response: express.Response) {

        try {
            const serviceResponse = await UserService.userDetails(response.locals.user_id);
            response.status(serviceResponse.statusCode).json(serviceResponse);
        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: helpers.getErrorMessage(error),
                data: {}
            })
        }
    }
}

export default new UserController();