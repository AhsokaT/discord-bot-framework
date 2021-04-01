import fetch from 'node-fetch';

export default function (token: string | null) {
    const route = [ 'https://discord.com/api/v8' ];
    const auth = 'Bot ' + token;

    const handler = {
        get(target, name) {
            if (name === 'toString') return () => route.join('/');

            if (['get', 'post', 'patch', 'delete'].includes(name)) return async options => {
                let { headers = new Object(), body } = options ?? new Object();

                headers['Authorization'] = auth;

                if (body) {
                    if (typeof body !== 'string') body = JSON.stringify(body);

                    headers['Content-Type'] = 'application/json';
                }

                return name === 'get' || name === 'post' ?
                await (await fetch(route.join('/'), {
                    method: name,
                    headers,
                    body
                })).json() :
                await fetch(route.join('/'), {
                    method: name,
                    headers,
                    body
                });
            };

            route.push(name);

            return new Proxy(() => {}, handler);
        },
        apply(target, that, args) {
            route.push(...args);

            return new Proxy(() => {}, handler);
        }
    };

    return new Proxy(() => {}, handler);
}