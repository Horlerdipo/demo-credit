import express from 'express';
import {AppModule} from "../app.module";
import UserController from "./wallet.controller";
import WalletController from "./wallet.controller";
import {body} from "express-validator";
import AuthMiddleware from "../auth.middleware";

export class WalletModule extends AppModule {
    constructor(app: express.Application) {
        super(app, 'WalletModule');
    }

    configureRoutes() {
        this.app.post('/wallet/fund',
            AuthMiddleware.run,
            body("account_number").not().isEmpty(),
            body('pin').not().isEmpty(),
            body('amount').not().isEmpty().isNumeric(),
            WalletController.fundWallet)

        this.app.post('/wallet/transfer',
            AuthMiddleware.run,
            body("account_number").not().isEmpty(),
            body('pin').not().isEmpty(),
            body('amount').not().isEmpty().isNumeric(),
            WalletController.makeTransfer)

        this.app.post('/wallet/withdraw',
            AuthMiddleware.run,
            body("account_number").not().isEmpty(),
            body('pin').not().isEmpty(),
            body('amount').not().isEmpty().isNumeric(),
            WalletController.makeWithdrawal)

        return this.app;
    }

}