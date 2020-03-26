export class Response {

    public success(data: any, message = "successful", code = 200) {
        return this.buildReponse(data, true, message, code);
    }

    public error(data: any, message = "failed", code = 400) {
        return this.buildReponse(data, false, message, code);
    }

    public buildReponse(data: any, success: boolean, message: string, code: number) {
        return {
            code,
            data,
            message,
            success,
        };
    }
}