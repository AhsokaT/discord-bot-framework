export interface CommandManagerOptions {
    /**
     * - Categories your commands can belong to
     */
    categories?: string[];
}
export declare class CommandManager {
    #private;
    constructor(options?: CommandManagerOptions);
}
