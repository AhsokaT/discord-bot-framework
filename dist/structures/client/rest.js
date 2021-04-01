"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTClient = void 0;
const node_fetch_1 = require("node-fetch");
function default_1(token) {
    const endpoint = ['https://discord.com/api/v8'];
    const auth = 'Bot ' + token;
    const handler = {
        get(target, name) {
            if (name === 'toString')
                return () => endpoint.join('/');
            if (['get', 'post', 'patch', 'delete'].includes(name))
                return async (options) => {
                    let { headers = new Object(), body } = options ?? new Object();
                    headers['Authorization'] = auth;
                    if (body) {
                        if (typeof body !== 'string')
                            body = JSON.stringify(body);
                        headers['Content-Type'] = 'application/json';
                    }
                    return name === 'get' || name === 'post' ?
                        await (await node_fetch_1.default(endpoint.join('/'), {
                            method: name,
                            headers,
                            body
                        })).json() :
                        await node_fetch_1.default(endpoint.join('/'), {
                            method: name,
                            headers,
                            body
                        });
                };
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
exports.default = default_1;
class RESTClient {
    constructor(token) {
        this.token = token;
        this.discord = this.api();
        this.discord.channels('756209732926308433').get().then(console.log);
    }
    api() {
        const endpoint = ['https://discord.com/api/v8'];
        const request = this.request;
        const token = this.token;
        const handler = {
            get(target, name) {
                if (name === 'toString')
                    return () => endpoint.join('/');
                if (['get', 'post', 'patch', 'delete'].includes(name))
                    return async (options) => {
                        return request(token, name, endpoint.join('/'), options);
                    };
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
    async request(token, method, endpoint, options = new Object()) {
        let { headers = {}, body } = options;
        headers['Authorization'] = 'Bot ' + token;
        if (body) {
            if (typeof body !== 'string')
                body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }
        return method === 'get' || method === 'post' ?
            await (await node_fetch_1.default(endpoint, {
                method: method,
                headers,
                body
            })).json() :
            await node_fetch_1.default(endpoint, {
                method: method,
                headers,
                body
            });
    }
}
exports.RESTClient = RESTClient;
