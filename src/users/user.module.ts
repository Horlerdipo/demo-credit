import express from 'express';
import {AppModule} from "../app.module";
import UserController from "./user.controller";
import {body} from "express-validator";
import KnexModule from "../database/knex.module";
import UserService from "./user.service";


export class UserModule extends AppModule {
    constructor(app: express.Application) {
        super(app, 'UserModule');
    }

    //TODO: ADD MIDDLEWARE FOR VERIFYING THE REQUEST TOKEN
    configureRoutes() {
        this.app.route(`/user`)
            .post(
                body("email").not().isEmpty().isEmail().custom(value => {
                    return UserService.findUserByEmail(value).then(user => {
                        if (user) {
                            return Promise.reject('E-mail already in use');
                        }
                    });
                }),
                body("name").not().isEmpty(),
                body('pin').not().isEmpty().isLength({min: 4}),
                UserController.createUser,
            )

        this.app.post('/user/token', UserController.generateNewToken,)

        return this.app;
    }

}