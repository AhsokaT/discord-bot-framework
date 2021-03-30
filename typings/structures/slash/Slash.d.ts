import { ApplicationCommandOption, SlashCommandOptions, SlashCallback } from './SlashTypes';
export declare class SlashCommand {
    #private;
    constructor(options?: SlashCommandOptions);
    private checkOptions;
    /**
     * @param name The name of your slash command.
     */
    setName(name: string): this;
    /**
     * @param description The description of your slash command.
     */
    setDescription(description: string): this;
    /**
     * @param callback The function to be executed when the command is run.
     */
    setCallback(callback: SlashCallback): this;
    /**
     * Add a user input option
     */
    addOption(...options: ApplicationCommandOption[]): this;
    /**
     * @returns A JSON representation of this slash command.
     */
    toJSON(): string;
    get name(): string | undefined;
    get description(): string | undefined;
    get options(): ApplicationCommandOption[] | undefined;
    get id(): import("./SlashTypes").Snowflake | undefined;
    get callback(): SlashCallback | undefined;
}
