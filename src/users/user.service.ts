import KnexModule from "../database/knex.module";
import {CreateUserDto} from "./dtos/create-user.dto";
import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";
import helpers from "../helpers";
import {GenerateTokenDto} from "./dtos/generate-token.dto";

class UserService {

    async findUserWithIdentifier(id: string, type: string) {
        //FIND USER WITH EMAIL,TOKEN,ID OR ANY IDENTIFIER
        const user = await KnexModule("users").where(type, id).first();

        if (!user) {
            return false;
        }
        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<any> {

        //HASH PIN,GENERATE AUTH TOKEN AND ACCOUNT NUMBER
        const pin = await bcrypt.hash(createUserDto.pin, 10);
        const token = helpers.generateRandomString(20);
        const accountNumber = helpers.generateAccountNumber(10);

        //START TRANSACTION
        const returningId = await KnexModule.transaction(async (transaction) => {
            //INSERT USER INTO THE USERS TABLE
            const id = await transaction.insert({
                name: createUserDto.name,
                email: createUserDto.email,
                pin,
                token,
            }).into("users");

            //CREATE NEW WALLET FOR THE NEW USER
            await transaction.insert({
                user_id: id[0],
                account_number: accountNumber,
            }).into("wallets")
            return id;
        })

        //IF TRANSACTION IS SUCCESSFUL,RETURN SUCCESS
        if (Array.isArray(returningId)) {
            return {
                statusCode: 201,
                message: 'Request Processed,User Created',
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    token,
                    account_number: accountNumber,
                },
            }
        }

    }

    //SERVICE METHOD TO GET NEW AUTH TOKEN
    async generateNewToken(generateTokenDto: GenerateTokenDto) {

        //GET USER INFO
        const user = await KnexModule("users").where("email", generateTokenDto.email).first();

        //RETURN ERROR IF USER DOES NOT EXIST
        if (!user) {
            return {
                statusCode: 400,
                message: 'User does not exist',
                data: {},
            }
        }

        //CHECK IF PIN IS CORRECT
        const result = await bcrypt.compare(generateTokenDto.pin, user.pin);

        //RETURN ERROR IF IT ISN'T
        if (!result) {
            return {
                statusCode: 400,
                message: 'Incorrect PIN',
                data: {},
            }
        }


        //NEW AUTH TOKEN
        const token = helpers.generateRandomString(20);

        //UPDATE AUTH TOKEN TO USERS TABLE
        await KnexModule('users').where({
            id: user.id,
        }).update({
            token,
        });

        //RETURN SUCCESS
        return {
            statusCode: 200,
            message: 'Token generated',
            data: {
                token,
            },
        }
    }

    async getTransactionsDetails(userId: number) {

        //GET AUTHENTICATED USER RELATED TRANSACTIONS
        const transactions = await KnexModule.select('*').from('transactions').where({
            sender: userId
        }).orWhere({
            receiver: userId
        });

        //RETURN SUCCESS
        return {
            statusCode: 200,
            message: 'Request Processed',
            data: {
                transactions,
            },
        }
    }

    async userDetails(userId: number) {
        //GET AUTHENTICATED USER INFO AND WALLET DETAILS IN ONE GO
        const userDetails: { email: string, name: string, balance: number, account_number: string, token: string } = await KnexModule
            .select('users.email', 'users.name', 'wallets.balance', 'wallets.account_number', 'users.token')
            .from('users')
            .where('users.id', userId)
            .innerJoin('wallets', 'users.id', 'wallets.user_id')
            .first();

        //RETURN SUCCESS
        return {
            statusCode: 200,
            msg: "Request Processed",
            data: {
                email: userDetails.email,
                name: userDetails.name,
                account_number: userDetails.account_number,
                wallet_balance: userDetails.balance,
                token: userDetails.token
            }

        };
    }
}

export default new UserService();