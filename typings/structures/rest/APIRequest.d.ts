declare type APIObject = {
    [key: string]: string;
};
declare type APIRequestMethod = 'get' | 'post' | 'delete' | 'patch';
interface APIRequestOptions {
    headers?: APIObject;
    query?: {
        field: string;
        value: string;
    };
    body?: any;
}
export default class APIRequest {
    method: APIRequestMethod;
    url: URL;
    body: any;
    headers: APIObject;
    constructor(method: APIRequestMethod, url: string, options?: APIRequestOptions);
    query(field: string, value: string): this;
    set(field: string, value: string): this;
    send(data?: object | string): this;
    make(): Promise<import("node-fetch").Response>;
}
export {};
