import express from "express";
import walletService from "./wallet.service";
import {validationResult} from "express-validator";
import e from "express";
import helpers from "../helpers";

class WalletController {
    async fundWallet(request: express.Request, response: express.Response) {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            //TODO: CHANGE USER_ID TO AUTHENTICATED USER ID
            const serviceResponse = await walletService.fundWallet({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: helpers.getErrorMessage(error),
                data: {}
            })
        }

    }


    async makeTransfer(request: express.Request, response: express.Response) {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            //TODO: CHANGE USER_ID TO AUTHENTICATED USER ID
            const serviceResponse = await walletService.makeTransfer({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: helpers.getErrorMessage(error),
                data: {}
            })
        }

    }


    async makeWithdrawal(request: express.Request, response: express.Response) {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            //TODO: CHANGE USER_ID TO AUTHENTICATED USER ID
            const serviceResponse = await walletService.makeWithdrawal({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
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

export default new WalletController();