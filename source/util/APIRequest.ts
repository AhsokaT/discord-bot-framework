import fetch from 'node-fetch';

type APIObject = { [key: string]: string };

type APIRequestMethod = 'get' | 'post' | 'delete' | 'patch';

interface APIRequestOptions {
    headers?: APIObject;
    query?: APIObject;
    body?: any;
}

export default class APIRequest {
    public method: APIRequestMethod;
    public url: URL;
    public body: any;
    public headers: APIObject = {};

    constructor(method: APIRequestMethod, url: string, options: APIRequestOptions = {}) {
        if (!method) throw new Error('You must provide a valid HTTP request method; either \'get\', \'post\', \'delete\' or \'patch\'');
        if (!url) throw new Error('You must provide a valid URL');

        this.method = method;
        this.url = new URL(url);

        const { query, headers = {}, body } = options;

        if (body) this.send(body);
        if (query) Object.keys(query).forEach(key => this.query(key, query[key]));
        for (const index in headers) this.set(index, headers[index]);
    }

    public query(field: string, value: string) {
        if (typeof field === 'string' && typeof value === 'string') this.url.searchParams.set(field, value); 

        return this;
    }

    public set(field: string, value: string) {
        if (typeof field === 'string' && typeof value === 'string') this.headers[field] = value;

        return this;
    }

    public send(data?: object | string) {
        this.body = data;

        return this;
    }

    public make() {
        if (this.body) {
            if (typeof this.body !== 'string') this.body = JSON.stringify(this.body);

            this.headers['Content-Type'] = 'application/json';
        }

        return fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: this.body
        });
    }
}