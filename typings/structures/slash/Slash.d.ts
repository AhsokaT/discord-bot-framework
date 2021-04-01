import { ApplicationCommandOption, SlashCommandOptions, SlashCallback, ApplicationCommandOptionTypeResolvable, ApplicationCommandOptionChoice } from './SlashTypes';
export declare class SlashCommand {
    #private;
    constructor(options?: SlashCommandOptions);
    private checkOptions;
    /**
     * @param name The name of your slash command
     */
    setName(name: string): this;
    /**
     * @param description The description of your slash command
     */
    setDescription(description: string): this;
    /**
     * @param callback The function to be executed when this command is invoked
     */
    setCallback(callback: SlashCallback): this;
    /**
     * Add a user input option
     * @param name 1-32 character name matching `^[\w-]{1,32}$`
     * @param description 1-100 character description
     * @param type Value of ApplicationCommandOptionTypeResolvable
     * @param required If the parameter is required or optional --default `false`
     * @param choices Choices for `string` and `number` types for the user to pick from
     * @param options If the option is a subcommand or subcommand group type, this nested options will be the parameters
     * @returns {this}
     */
    addOption(name: string, description: string, type: ApplicationCommandOptionTypeResolvable, required?: boolean, choices?: ApplicationCommandOptionChoice[], options?: ApplicationCommandOption[]): this;
    /**
     * Add user input option(s)
     */
    addOptions(...options: ApplicationCommandOption[]): this;
    /**
     * @returns A JSON representation of this slash command
     */
    toJSON(): {
        name: string | undefined;
        description: string | undefined;
        options: ApplicationCommandOption[] | undefined;
    };
    get name(): string | undefined;
    get description(): string | undefined;
    get options(): ApplicationCommandOption[] | undefined;
    get id(): import("./SlashTypes").Snowflake | undefined;
    get callback(): SlashCallback | undefined;
}
