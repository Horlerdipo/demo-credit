class Helpers {

    getErrorMessage(error: unknown) {
        if (error instanceof Error) return error.message
        return String(error)
    }

    generateAccountNumber(length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
    }
}

export default new Helpers();