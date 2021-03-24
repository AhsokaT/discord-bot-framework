import { ApplicationCommandOption, SlashCommandOptions, SlashCallback } from './SlashTypes';
export declare class SlashCommand {
    #private;
    constructor(options?: SlashCommandOptions);
    private checkOptions;
    /**
     * @param name The name of your slash command.
     */
    setName(name: string): void;
    /**
     * @param description The description of your slash command.
     */
    setDescription(description: string): void;
    /**
     * @param callback The function to be executed when the command is run.
     */
    setCallback(callback: SlashCallback): void;
    /**
     * Add a user input option
     */
    addOption(option: ApplicationCommandOption): void;
    /**
     * @returns A JSON representation of this slash command.
     */
    toJSON(): string;
    get name(): string | undefined;
    get description(): string | undefined;
    get options(): ApplicationCommandOption[] | undefined;
    get id(): import("./SlashTypes").Snowflake | undefined;
}
