class WalletService {

    async hello() {
        return "hello";
    }

    async fundWallet(){
        //TODO CHECK IF THE ACCOUNT NUMBER EXISTS AND THE PIN IS CORRECT, AND FUND THE WALLET,THEN SAVE INTO THE TRANSACTIONS HISTORY TABLE
    }

    async makeTransfer(){
        //TODO CHECK IF THE SENDER'S BALANCE IS ENOUGH,CHECK IF RECEIVER'S ACCOUNT NUMBER EXISTS,CHECK IF THE SENDER'S PIN IS CORRECT,
        // IF ABOVE CRITERION ARE MET,ADD THE AMOUNT TO THE RECEIVER'S BALANCE,REMOVE FROM THE SENDER'S BALANCE,ADD THE TRANSACTION TO TRANSACTIONS HISTORY TABLE,AND SEND SUCCESS RESPONSE
    }

    async makeWithdrawal(){
        //TODO CHECK IF USER'S BALANCE IS ENOUGH,IF IT IS,DEDUCT AMOUNT FROM THE WALLET BALANCE,ADD THE TRANSACTION TO TRANSACTIONS HISTORY TABLE
    }
}

export default new WalletService();