export default class APIRequest {
    method: string;
    url: string;
    body: any;
    headers: {
        [key: string]: string;
    };
    constructor(method: string, url: string, options?: {
        headers?: {
            [key: string]: string;
        };
        body?: any;
    });
    make(): Promise<any>;
}
