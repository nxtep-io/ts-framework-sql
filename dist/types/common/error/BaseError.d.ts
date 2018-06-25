export declare class BaseErrorDetails {
    [key: string]: any;
    constructor(data?: {});
}
export default class BaseError extends Error {
    stackId: string;
    details: BaseErrorDetails;
    constructor(message: any, details?: any);
    toObject(): {
        message: string;
        stackId: string;
        details: BaseErrorDetails;
        stack: any;
    };
    toJSON(stringify?: boolean): object | string;
}
