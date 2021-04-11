export default class RESTClient {
    private baseURL;
    constructor(baseURL: string);
    private endpoint;
    protected get api(): any;
}
