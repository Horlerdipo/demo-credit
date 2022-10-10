import KnexModule from "../database/knex.module";
import {FundWalletDto} from "./dtos/fund-wallet.dto";
import * as bcrypt from "bcrypt";
import helpers from "../helpers";
import {TransactionTypeEnum} from "./enums/transaction-type.enum";
import {MakeTransferDto} from "./dtos/make-transfer.dto";
import {MakeWithdrawalDto} from "./dtos/make-withdrawal.dto";

class WalletService {

    async fundWallet(fundWalletDto: FundWalletDto) {

        //GET AUTHENTICATED USER INFO
        const user = await KnexModule("users").where("id", fundWalletDto.user_id).first();

        //CHECK IF PIN MATCHES TO PROCEED
        const result = await bcrypt.compare(fundWalletDto.pin, user.pin);

        //RETURN ERROR IF PIN DOES NOT MATCH
        if (!result) {
            return {
                statusCode: 400,
                message: 'Incorrect PIN',
                data: {},
            }
        }

        //GET USER WALLET DETAILS
        const wallet = await KnexModule("wallets")
            .where("account_number", fundWalletDto.account_number)
            .andWhere("user_id", fundWalletDto.user_id)
            .first();

        //RETURN ERROR IF THERE IS NO WALLET LINKED TO ACCOUNT NUMBER
        if (!wallet) {
            return {
                statusCode: 400,
                message: 'Wallet does not exist',
                data: {},
            }
        }
        const newBalance: number = parseFloat(wallet.balance) + parseFloat(fundWalletDto.amount);

        await KnexModule.transaction(async (transaction) => {
            //UPDATE USER WALLET BALANCE
            await transaction.update({
                balance: newBalance
            }).where({
                id: wallet.id
            }).into("wallets");

            // PUT TRANSACTION IN THE TRANSACTIONS TABLE
            await transaction.insert({
                transaction_id: helpers.generateRandomString(20),
                type: TransactionTypeEnum.DEPOSIT,
                sender: null,
                receiver: fundWalletDto.user_id,
                amount: parseFloat(fundWalletDto.amount),
                prev_balance: parseFloat(wallet.balance),
                next_balance: newBalance,
            }).into("transactions")

        })

        //RETURN SUCCESS
        return {
            statusCode: 200,
            message: 'Wallet Funded Successfully',
            data: {
                account_number: fundWalletDto.account_number,
                wallet_balance: newBalance.toFixed(2),
            },
        }
    }


    async makeTransfer(makeTransferDto: MakeTransferDto) {

        //GET AUUTHENTICATED USER INFO
        const sender = await KnexModule
            .select('users.id', 'users.pin', 'wallets.account_number', 'wallets.balance', 'wallets.id as wallet_id')
            .from('users')
            .where('users.id', makeTransferDto.user_id)
            .innerJoin('wallets', 'users.id', 'wallets.user_id')
            .first();

        //CHECK IF PIN IS CORRECT
        const result = await bcrypt.compare(makeTransferDto.pin, sender.pin);

        //RETURN ERROR,IF IT IS NOT
        if (!result) {
            return {
                statusCode: 400,
                message: 'Incorrect PIN',
                data: {},
            }
        }

        //CHECK IF SENDER HAS ENOUGH IN HIS WALLET
        if (parseFloat(makeTransferDto.amount) > parseFloat(sender.balance)) {
            return {
                statusCode: 400,
                message: 'You do not have up to that in your wallet',
                data: {},
            }
        }

        //GET RECEIVER'S WALLET INFO
        const receiverWallet = await KnexModule("wallets")
            .where("account_number", makeTransferDto.account_number)
            .first();

        //IF RECEIVER'S WALLET DOES NOT EXIST,RETURN ERROR
        if (!receiverWallet) {
            return {
                statusCode: 400,
                message: 'Wallet does not exist',
                data: {},
            }
        }

        //CHECK IF USER IS NOT SENDING TO HIS OWN WALLET
        if (makeTransferDto.account_number == sender.account_number) {
            return {
                statusCode: 400,
                message: 'You cannot transfer to your own wallet',
                data: {},
            }
        }

        //GET SENDER AND RECEIVER'S NEW BALANCES
        const newSenderBalance = parseFloat(sender.balance) - parseFloat(makeTransferDto.amount);
        const newReceiverBalance = parseFloat(receiverWallet.balance) + parseFloat(makeTransferDto.amount);

        //START TRANSACTION
        await KnexModule.transaction(async (transaction) => {
            //UPDATE SENDER'S WALLET BALANCE
            await transaction.update({
                balance: newSenderBalance
            }).where({
                id: sender.wallet_id
            }).into("wallets");

            //UPDATE RECEIVER'S WALLET BALANCE
            await transaction.update({
                balance: newReceiverBalance
            }).where({
                id: receiverWallet.id
            }).into("wallets");

            //INSERT TRANSACTION INTO THE TRANSACTIONS TABLE
            await transaction.insert({
                transaction_id: helpers.generateRandomString(20),
                type: TransactionTypeEnum.TRANSFER,
                sender: sender.id,
                receiver: receiverWallet.user_id,
                amount: parseFloat(makeTransferDto.amount,),
                prev_balance: parseFloat(receiverWallet.balance),
                next_balance: newReceiverBalance,
            }).into("transactions")

        })

        //RETURN SUCCESS
        return {
            statusCode: 200,
            message: 'Wallet Funded Successfully',
            data: {
                from: sender.account_number,
                to: makeTransferDto.account_number,
                amount: makeTransferDto.amount,
                wallet_balance: newSenderBalance.toFixed(2),
            },
        }
    }

    async makeWithdrawal(makeWithdrawalDto: MakeWithdrawalDto) {

        //GET AUTHENTICATED USER INFO
        const user = await KnexModule("users").where("id", makeWithdrawalDto.user_id).first();
        const result = await bcrypt.compare(makeWithdrawalDto.pin, user.pin);

        //CHECK IF PIN IS CORRECT
        if (!result) {
            return {
                statusCode: 400,
                message: 'Incorrect PIN',
                data: {},
            }
        }

        //CHECK IF USER IS LINKED TO THE ACCOUNT NUMBER
        const wallet = await KnexModule("wallets")
            .where("account_number", makeWithdrawalDto.account_number)
            .andWhere("user_id", makeWithdrawalDto.user_id)
            .first();

        //RETURNS ERROR IF IT IS NOT
        if (!wallet) {
            return {
                statusCode: 400,
                message: 'Wallet does not exist',
                data: {},
            }
        }

        //CHECK IF USER HAS UP TO REQUESTED AMOUNT IN WALLET
        if (parseFloat(makeWithdrawalDto.amount) > parseFloat(wallet.balance)) {
            return {
                statusCode: 400,
                message: 'You do not have up to that in your wallet',
                data: {},
            }
        }

        //GET NEW USER BALANCE
        const newBalance: number = parseFloat(wallet.balance) - parseFloat(makeWithdrawalDto.amount);

        //START TRANSACTION
        await KnexModule.transaction(async (transaction) => {
            //UPDATE THE USER WALLET WITH NEW BALANCE
            await transaction.update({
                balance: newBalance
            }).where({
                id: wallet.id
            }).into("wallets");

            //INSERT THE TRANSACTION INTO THE TRANSAACTIONS TABLE
            await transaction.insert({
                transaction_id: helpers.generateRandomString(20),
                type: TransactionTypeEnum.WITHDRAWAL,
                sender: null,
                receiver: makeWithdrawalDto.user_id,
                amount: parseFloat(makeWithdrawalDto.amount),
                prev_balance: parseFloat(wallet.balance),
                next_balance: newBalance,
            }).into("transactions")
        })

        //RETURN SUCCESS
        return {
            statusCode: 200,
            message: 'Wallet Withdrawal Successfully',
            data: {
                account_number: makeWithdrawalDto.account_number,
                wallet_balance: newBalance.toFixed(2),
            },
        }
    }
}

export default new WalletService();