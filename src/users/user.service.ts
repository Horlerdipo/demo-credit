import KnexModule from "../database/knex.module";
import {CreateUserDto} from "./dtos/create-user.dto";
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";
import helpers from "../helpers";
import {GenerateTokenDto} from "./dtos/generate-token.dto";

class UserService {

    async findUserByEmail(email: string) {
        const user = await KnexModule("users").where("email", email).first();

        if (!user) {
            return false;
        }
        console.log(user);
        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<any> {

        //CREATE USER,CREATE USER WALLET ALSO
        const pin = await bcrypt.hash(createUserDto.pin, 10);
        const token = crypto.randomBytes(20).toString('hex');

        const returningId = await KnexModule.transaction(async (transaction) => {
            const id = await transaction.insert({
                name: createUserDto.name,
                email: createUserDto.email,
                pin,
                token,
            }).into("users");

            await transaction.insert({
                user_id: id[0],
                account_number: helpers.generateAccountNumber(10)
            }).into("wallets")
            return id;
        })

        if (Array.isArray(returningId)) {
            return {
                statusCode: 201,
                message: 'Request Processed,User Created',
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    token,
                },
            }
        }

    }

    async generateNewToken(generateTokenDto: GenerateTokenDto) {

        const user = await KnexModule("users").where("email", generateTokenDto.email).first();

        if (!user) {
            return {
                statusCode: 400,
                message: 'User does not exist',
                data: {},
            }
        }

        const result = await bcrypt.compare(generateTokenDto.pin, user.pin);

        if (!result) {
            return {
                statusCode: 400,
                message: 'Incorrect PIN',
                data: {},
            }
        }


        const token = crypto.randomBytes(20).toString('hex');
        console.log(token);
        const returningId = await KnexModule('users').where({
            id: user.id,
        }).update({
            token,
        });

        return {
            statusCode: 200,
            message: 'Token generated',
            data: {
                token,
            },
        }
    }

    //TODO:AN ENDPOINT FOR THE LIST OF TRANSACTIONS MADE BY USER
    async transactions(){

    }
}

export default new UserService();