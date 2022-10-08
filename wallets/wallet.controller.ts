import express from "express";
import walletService from "./wallet.service";

class WalletController {
    async listUser(request: express.Request, response: express.Request): Promise<string> {
        return walletService.hello()
    }
}

export default new WalletController();