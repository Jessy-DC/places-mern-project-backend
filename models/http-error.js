class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Add a message property
        this.status = errorCode; //Add a code Property
    }
}

module.exports = HttpError;