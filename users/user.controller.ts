import express from "express";
import userService from "./user.service";

class UserController {
    async listUser(request: express.Request, response: express.Request): Promise<string> {
        return userService.hello();
    }
}

export default new UserController();