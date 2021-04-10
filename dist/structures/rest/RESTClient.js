"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const APIRequest_js_1 = require("./APIRequest.js");
class RESTClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    endpoint() {
        const endpoint = [this.baseURL];
        const handler = {
            get(target, name) {
                if (name === 'toString')
                    return () => endpoint.join('/');
                if (['get', 'post', 'patch', 'delete'].includes(name)) {
                    return async (options = {}) => {
                        if (options instanceof APIRequest_js_1.default)
                            return options.make();
                        return new APIRequest_js_1.default(name, endpoint.join('/'), options).make();
                    };
                }
                endpoint.push(name);
                return new Proxy(() => { }, handler);
            },
            apply(target, that, args) {
                endpoint.push(...args);
                return new Proxy(() => { }, handler);
            }
        };
        return new Proxy(() => { }, handler);
    }
    get api() {
        return this.endpoint();
    }
}
exports.default = RESTClient;
