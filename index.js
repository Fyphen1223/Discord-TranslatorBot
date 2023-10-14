const config = require('./config.json');
const discord = require('discord.js');
const fs = require('fs');
const translate = require('google-translate-api-x');
var queue = require('./queue.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.GuildEmojisAndStickers,
        discord.GatewayIntentBits.GuildIntegrations,
        discord.GatewayIntentBits.GuildInvites,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildMessageReactions,
        discord.GatewayIntentBits.GuildMessageTyping,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildPresences,
        discord.GatewayIntentBits.GuildScheduledEvents,
        discord.GatewayIntentBits.GuildVoiceStates,
        discord.GatewayIntentBits.GuildWebhooks,
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.MessageContent,
    ],
    partials: [discord.Partials.Channel, discord.Partials.GuildMember, discord.Partials.GuildScheduledEvent, discord.Partials.Message, discord.Partials.Reaction, discord.Partials.ThreadMember, discord.Partials.User],
});

client.on('ready', async (u) => {
    console.log(`Logged in as ${u.user.tag}`);
    return;
});

client.on('interactionCreate', async (interaction) => {
    const channelId = interaction.channel.id;
    if (interaction.commandName === "translate" && interaction.options.getSubcommand() === "add") {
        const target = interaction.options.getString('languages');
        if (!queue[channelId]) {
            let temp = {
                [channelId]: {
                    target: [target]
                }
            }
            queue = { ...queue, ...temp };
        } else {
            if (queue[channelId].target.indexOf(target) !== -1) {
                interaction.reply("Language already added.");
                return;
            }
            queue[channelId].target.push(target);
        }
        await fs.writeFileSync("./queue.json", JSON.stringify(queue));
        await interaction.reply("Added language to translate.");
        return;
    }
    if (interaction.commandName === "translate" && interaction.options.getSubcommand() === "remove") {
        const target = interaction.options.getString('languages');
        if (!queue[channelId]) {
            await interaction.reply("No languages for this channel have been added.");
            return;
        } else {
            const num = queue[channelId].target.indexOf(target);
            if (num === -1) {
                await interaction.reply("The language has not been added.");
                return;
            }
            queue[channelId].target.splice(num, 1);
            await fs.writeFileSync("./queue.json", JSON.stringify(queue));
        }
        await fs.writeFileSync("./queue.json", JSON.stringify(queue));
        await interaction.reply("Removed language to translate.");
        return;
    }
    if (interaction.commandName === "translate" && interaction.options.getSubcommand() === "list") {
        if (!queue[channelId]) {
            await interaction.reply("No languages for this channel have been added.");
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle("Languages to translate")
            .setColor(0x00FFFF)
            .setTimestamp()
            .setAuthor({
                name: ` | 📕 Translation`,
                iconURL: `${interaction.user.avatarURL({})}`,
            });
        for (const target of queue[channelId].target) {
            embed.addFields({ name: `To`, value: target, inline: true });
        }
        await interaction.reply({ embeds: [embed] });
        return;
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const channelId = message.channel.id;
    if (!queue[channelId]) return;
    if (queue[channelId].target == []) return;
    const embed = new EmbedBuilder()
        .setTitle("Results")
        .setColor(0x00FFFF)
        .setTimestamp()
        .setAuthor({
            name: ` | 📕 Translation`,
            iconURL: `${message.author.avatarURL({})}`,
        });
    for (const target of queue[channelId].target) {
        const res = await translate(message.content, { to: target })
        embed.addFields({ name: `To ${target}`, value: res.text, inline: true });
    }
    await message.reply({ embeds: [embed] });
});

client.login(config.bot.token);
process.on("uncaughtException", function (err) {
    console.log(err.stack);
});