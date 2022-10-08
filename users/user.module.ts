import express from 'express';
import {AppModule} from "../app.module";
import UserController from "./user.controller";

export class UserModule extends AppModule {
    constructor(app: express.Application) {
        super(app, 'UserModule');
    }

    configureRoutes() {
        this.app.route(`/users`)
            .get(UserController.listUser)

        return this.app;
    }

}