"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointConstructor = void 0;
const APIRequest_js_1 = require("./APIRequest.js");
function endpointConstructor(auth) {
    const endpoint = ['https://discord.com/api/v8'];
    const handler = {
        get(target, name) {
            if (name === 'toString')
                return () => endpoint.join('/');
            if (['get', 'post', 'patch', 'delete'].includes(name))
                return async (options = {}) => {
                    if (!options.headers)
                        options.headers = {};
                    if (auth && !name.endsWith('callback'))
                        options.headers['Authorization'] = auth;
                    return new APIRequest_js_1.default(name, endpoint.join('/'), options).make();
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
exports.endpointConstructor = endpointConstructor;
