import crypto from "crypto";
import express from "express";

class Helpers {

    //GET ERROR MESSAGE FROM ERROR CLASS
    getErrorMessage(error: unknown) {
        if (error instanceof Error) return error.message
        return String(error)
    }

    //GENERATE ACCOUNT NUMBER FOR USERS
    generateAccountNumber(length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    }

    //GENERATE RANDOM STRING OF ANY SIZE
    generateRandomString(size: number) {
        return crypto.randomBytes(size).toString('hex')
    }

    sendErrorMessage(response: express.Response,error: unknown){
        //TODO:IN PRODUCTION ENVIRONMENT, LOG ERROR
        return response.status(500).json({
            statusCode: 500,
            message: this.getErrorMessage(error),
            data: {}
        })
    }
}

export default new Helpers();