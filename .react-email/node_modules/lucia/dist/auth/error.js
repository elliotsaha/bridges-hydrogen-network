export class LuciaError extends Error {
    constructor(errorMsg, detail) {
        super(errorMsg);
        this.message = errorMsg;
        this.detail = detail ?? "";
    }
    detail;
    message;
}
