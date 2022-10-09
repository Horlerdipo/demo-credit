import express from 'express';
import {AppModule} from "../app.module";
import UserController from "./wallet.controller";
import WalletController from "./wallet.controller";

export class WalletModule extends AppModule {
    constructor(app: express.Application) {
        super(app, 'WalletModule');
    }

    configureRoutes() {
        this.app.route(`/wallets`)
            .get(WalletController.listUser)

        return this.app;
    }

}