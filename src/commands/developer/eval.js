const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("../../utils/style/AdvancedEmbed");
const Konsol = require("../../utils/color");
const konsol = new Konsol();
const config = require("../../config.json");

module.exports = {
    name: "eval",
    description: "Botun üzerinde komut denersiniz dikkat!",
    /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
    async run(client, interaction) {
        if (!config.bot.owners.includes(interaction.user.id)) return interaction.reply({ embeds: [new AdvancedEmbed().setInteraction(interaction).setDescription("Bu komudu kullanabilmek için `Bot Sahibi` olmalısınız.").setStyle(EmbedStyle.Error)], ephemeral: true })
    }
};