import APIRequest from './APIRequest.js';


export default function (auth: string) {
    const endpoint = [ 'https://discord.com/api/v8' ];

    const handler = {
        get(target, name) {
            if (name === 'toString') return () => endpoint.join('/');

            if (['get', 'post', 'patch', 'delete'].includes(name)) return async (options: any = {}) => {
                if (!options.headers) options.headers = {};

                if (auth && !name.endsWith('callback')) options.headers['Authorization'] = auth;

                return new APIRequest(name, endpoint.join('/'), options).make();
            };

            endpoint.push(name);

            return new Proxy(() => {}, handler);
        },
        apply(target, that, args) {
            endpoint.push(...args);

            return new Proxy(() => {}, handler);
        }
    };

    return new Proxy(() => {}, handler);
}