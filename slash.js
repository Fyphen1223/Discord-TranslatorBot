var start = new Date();
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const config = require("./config.json");
const commands = [
    new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Settings translation')
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription('Add')
                .addStringOption(option =>
                    option.setName('languages')
                        .setDescription('The language to translate')
                        .setRequired(true)
                        .addChoices(
                            { name: 'English', value: 'en' },
                            { name: 'Japanese', value: 'ja' },
                            { name: 'Chinese', value: 'zh' },
                            { name: 'Spanish', value: 'es' },
                            { name: 'French', value: 'fr' },
                            { name: 'German', value: 'de' },
                            { name: 'Italian', value: 'it' },
                            { name: 'Portuguese', value: 'pt' },
                            { name: 'Russian', value: 'ru' },
                            { name: 'Korean', value: 'ko' },
                            { name: 'Arabic', value: 'ar' },
                            { name: 'Hindi', value: 'hi' },
                            { name: 'Thai', value: 'th' },
                            { name: 'Turkish', value: 'tr' },
                            { name: 'Ukrainian', value: 'uk' },
                            { name: 'Vietnamese', value: 'vi' },
                            { name: 'Malay', value: 'ms' },
                            { name: 'Czech', value: 'cs' },
                            { name: 'Hungarian', value: 'hu' },
                            { name: 'Indonesian', value: 'id' },
                            { name: 'Bengali', value: 'bn' },
                            { name: 'Romanian', value: 'ro' },
                            { name: 'Greek', value: 'el' },
                            { name: 'Hebrew', value: 'he' },
                            { name: 'Bulgarian', value: 'bg' },
                        ))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription('Remove')
                .addStringOption(option =>
                    option.setName('languages')
                        .setDescription('The language to remove')
                        .setRequired(true)
                        .addChoices(
                            { name: 'English', value: 'en' },
                            { name: 'Japanese', value: 'ja' },
                            { name: 'Chinese', value: 'zh' },
                            { name: 'Spanish', value: 'es' },
                            { name: 'French', value: 'fr' },
                            { name: 'German', value: 'de' },
                            { name: 'Italian', value: 'it' },
                            { name: 'Portuguese', value: 'pt' },
                            { name: 'Russian', value: 'ru' },
                            { name: 'Korean', value: 'ko' },
                            { name: 'Arabic', value: 'ar' },
                            { name: 'Hindi', value: 'hi' },
                            { name: 'Thai', value: 'th' },
                            { name: "Turkish", value: 'tr' },
                            { name: 'Vietnamese', value: 'vi' },
                            { name: 'Malay', value: 'ms' },
                            { name: 'Czech', value: 'cs' },
                            { name: 'Hungarian', value: 'hu' },
                            { name: 'Indonesian', value: 'id' },
                            { name: 'Bengali', value: 'bn' },
                            { name: 'Romanian', value: 'ro' },
                            { name: 'Greek', value: 'el' },
                            { name: 'Hebrew', value: 'he' },
                            { name: 'Bulgarian', value: 'bg' },
                        ))

        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("list")
                .setDescription('list')
        )
].map(command => command.toJSON());
const rest = new REST({ version: '10' }).setToken(config.bot.token);
const reset = [];
rest.put(Routes.applicationCommands(config.bot.applicationId), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands with ${(new Date() - start) / 1000}s`))
    .catch(console.error);