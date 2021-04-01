"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
class APIRequest {
    constructor(method, url, options = {}) {
        this.method = method;
        this.url = url;
        this.body = options.body;
        this.headers = options.headers ?? {};
    }
    async make() {
        if (this.body) {
            if (typeof this.body !== 'string')
                this.body = JSON.stringify(this.body);
            this.headers['Content-Type'] = 'application/json';
        }
        return this.method === 'get' || this.method === 'post' ?
            await (await node_fetch_1.default(this.url, {
                method: this.method,
                headers: this.headers,
                body: this.body
            })).json() :
            await node_fetch_1.default(this.url, {
                method: this.method,
                headers: this.headers,
                body: this.body
            });
    }
}
exports.default = APIRequest;
