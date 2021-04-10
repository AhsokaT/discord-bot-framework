export default class RESTClient {
    baseURL: string;
    constructor(baseURL: string);
    private endpoint;
    protected get api(): any;
}
