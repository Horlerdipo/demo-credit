import express from 'express';
import {CommonRoutesConfig} from "../app.module";
import UserController from "./user.controller";

export class UserModule extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserModule');
    }

    configureRoutes() {
        this.app.route(`/users`)
            .get(UserController.listUser)

        return this.app;
    }

}