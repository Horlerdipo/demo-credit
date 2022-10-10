import express from "express";
import walletService from "./wallet.service";
import {validationResult} from "express-validator";
import e from "express";
import helpers from "../helpers";

class WalletController {

    async fundWallet(request: express.Request, response: express.Response) {
        try {

            //RUN VALIDATIONS
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            //EXECUTE WALLET FUNDING SERVICE
            const serviceResponse = await walletService.fundWallet({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            //DISPLAY ANY ERRORS CAUGHT
            //TODO: IF IN PRODUCTION LOG AND DISPLAY NORMAL ERROR
            return helpers.sendErrorMessage(response,error)
        }

    }


    async makeTransfer(request: express.Request, response: express.Response) {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            const serviceResponse = await walletService.makeTransfer({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            return helpers.sendErrorMessage(response,error)
        }

    }


    async makeWithdrawal(request: express.Request, response: express.Response) {
        try {

            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({errors: errors.array()});
            }

            const serviceResponse = await walletService.makeWithdrawal({
                account_number: request.body.account_number,
                pin: request.body.pin,
                amount: request.body.amount,
                user_id: response.locals.user_id,
            })
            response.status(serviceResponse.statusCode).json(serviceResponse);

        } catch (error) {
            return helpers.sendErrorMessage(response,error)
        }

    }
}

export default new WalletController();