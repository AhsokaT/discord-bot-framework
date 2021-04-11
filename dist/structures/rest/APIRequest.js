"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class APIRequest {
    constructor(method, url, options = {}) {
        this.headers = {};
        if (!method)
            throw new Error('You must provide a valid HTTP request method; either \'get\', \'post\', \'delete\' or \'patch\'');
        if (!url)
            throw new Error('You must provide a valid URL');
        this.method = method;
        this.url = new URL(url);
        const { query, headers = {}, body } = options;
        if (body)
            this.send(body);
        if (query)
            Object.keys(query).forEach(key => this.query(key, query[key]));
        for (const index in headers)
            this.set(index, headers[index]);
    }
    query(field, value) {
        if (typeof field === 'string' && typeof value === 'string')
            this.url.searchParams.set(field, value);
        return this;
    }
    set(field, value) {
        if (typeof field === 'string' && typeof value === 'string')
            this.headers[field] = value;
        return this;
    }
    send(data) {
        this.body = data;
        return this;
    }
    make() {
        if (this.body) {
            if (typeof this.body !== 'string')
                this.body = JSON.stringify(this.body);
            this.headers['Content-Type'] = 'application/json';
        }
        return node_fetch_1.default(this.url, {
            method: this.method,
            headers: this.headers,
            body: this.body
        });
    }
}
exports.default = APIRequest;
