class ErrorHandler extends Error{
    constructor(statusCode, message = "issue in here") {
        super(message);
        // console.log(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = false;
    }
}

export default ErrorHandler;