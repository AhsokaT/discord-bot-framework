import APIRequest from './APIRequest.js';

class RESTClient {
    public baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private endpoint() {
        const endpoint = [ this.baseURL ];

        const handler = {
            get(target, name) {
                if (name === 'toString') return () => endpoint.join('/');

                if (['get', 'post', 'patch', 'delete'].includes(name)) {
                    return async (options: any = {}) => {
                        if (options instanceof APIRequest) return options.make();

                        return new APIRequest(name, endpoint.join('/'), options).make();
                    }
                }

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

    protected get api() {
        return this.endpoint();
    }
}