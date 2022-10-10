import express from 'express';
import {AppModule} from "../app.module";
import UserController from "./user.controller";
import {body} from "express-validator";
import KnexModule from "../database/knex.module";
import UserService from "./user.service";
import AuthMiddleware from "../auth.middleware";


export class UserModule extends AppModule {
    constructor(app: express.Application) {
        super(app, 'UserModule');
    }

    configureRoutes() {
        this.app.post('/user',
            body("email").not().isEmpty().isEmail().custom(value => {
                return UserService.findUserWithIdentifier(value,"email").then(user => {
                    if (user) {
                        return Promise.reject('E-mail already in use');
                    }
                });
            }),
            body("name").not().isEmpty(),
            body('pin').not().isEmpty().isLength({min: 4}),
            UserController.createUser,
        )

        this.app.post('/user/token',
            body("email").not().isEmpty(),
            body('pin').not().isEmpty().isLength({min: 4}),
            UserController.generateNewToken,)

        this.app.post('/user/details',
            AuthMiddleware.run,
            UserController.userDetails,)

        this.app.post('/user/transactions',
            AuthMiddleware.run,
            UserController.getTransactionsDetails,)

        return this.app;
    }

}