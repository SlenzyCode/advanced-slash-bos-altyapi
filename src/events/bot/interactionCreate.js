const { AdvancedEmbed, EmbedStyle } = require("../../utils/style/AdvancedEmbed");
const { userMention, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../../config.json");
const path = require("path");
const fs = require("fs");
const { database } = require("../../utils/database/genelData");

/** @param {import("discord.js").ChatInputCommandInteraction} interaction */
module.exports = async (client, interaction) => {
    let link = config.bot.destek_sunucusu;
    if (!link.includes("https://")) { link = "https://discord.com" };
    const blacklistEmbed = new AdvancedEmbed()
        .setInteraction(interaction)
        .setDescription(`${config.blacklist.message.replace("{user}", userMention(interaction.user.id)).replace("{reason}", `**${database.get(`blacklist${interaction.user.id}`)}**`)}`)
        .setStyle(EmbedStyle.Error)
    const premiumEmbed = new AdvancedEmbed()
        .setInteraction(interaction)
        .setDescription(`${config.premium.message.replace("{user}", userMention(interaction.user.id))}`)
        .setStyle(EmbedStyle.Error)
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Ban Kaldırma Talebi")
                .setEmoji("🔗")
                .setStyle(ButtonStyle.Link)
                .setURL(link)
        )
    if (database.has(`blacklist${interaction.user.id}`)) return interaction.reply({ embeds: [blacklistEmbed], components: [button], ephemeral: true });
    if (interaction.isChatInputCommand()) {
        if (!interaction.guildId) return;
        const embed = new AdvancedEmbed()
            .setInteraction(interaction)
            .setDefaultColor("Green")
            .setTitle("Komut Log")
            .setDescription(`> ** ${interaction.user.globalName} ** adlı kullanıcı komut kullandı.`)
            .addFields([
                { name: `Komut Kullanım`, value: `${interaction}`, inline: true }
            ])
            .setThumbnail(interaction.user.displayAvatarURL())
            .setStyle(EmbedStyle.Default);
        client.channels.cache.get(config.command_log.channel_id).send({ embeds: [embed] });
        const userPremium = database.get(`premium${interaction.user.id}`)

        const commandsDir = path.join(__dirname, '..', '..', 'commands');
        fs.readdirSync(commandsDir).forEach((category) => {
            fs.readdirSync(path.join(commandsDir, category)).forEach(async (file) => {
                const cmd = require(`../../commands/${category}/${file}`);
                if (interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
                    if (config.premium.commands.includes(cmd.name.toLowerCase()) && !userPremium) {
                        await interaction.reply({ embeds: [premiumEmbed], components: [button], ephemeral: true });
                        return;
                    };
                    await cmd.run(client, interaction);
                }
            });
        });
    }
};
