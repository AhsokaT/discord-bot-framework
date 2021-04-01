import fetch from 'node-fetch';

export default class APIRequest {
    public method: string;
    public url: string;
    public body: any;
    public headers: { [key: string]: string };

    constructor(method: string, url: string, options: { headers?: { [key: string]: string }; body?: any } = {}) {
        this.method = method;
        this.url = url;
        this.body = options.body;
        this.headers = options.headers ?? {};
    }

    public async make() {
        if (this.body) {
            if (typeof this.body !== 'string') this.body = JSON.stringify(this.body);

            this.headers['Content-Type'] = 'application/json';
        }

        return this.method === 'get' || this.method === 'post' ?
        await (await fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: this.body
        })).json() :
        await fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: this.body
        });
    }
}