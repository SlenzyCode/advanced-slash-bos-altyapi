const { AdvancedEmbed, EmbedStyle } = require("../../utils/style/AdvancedEmbed");
const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const Konsol = require("../../utils/color");
const konsol = new Konsol();
const { database } = require("../../utils/database/genelData");
/** @param {import("discord.js").ChatInputCommandInteraction} interaction */
module.exports = async (client, interaction) => {
    let sonuc;
    if (interaction.commandName === "eval") {
        const modal = new ModalBuilder()
            .setCustomId('evalForm')
            .setTitle("Eval Formu")
        const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel("Kodu Giriniz")
            .setPlaceholder("console.log(true);")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        const row = new ActionRowBuilder().addComponents(code);
        modal.addComponents(row);
        await interaction.showModal(modal);
    };
    if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'evalForm') {
            const code = interaction.fields.getTextInputValue("code");
            try {
                sonuc = eval(client);
                if (!sonuc) {
                    konsol.log({ name: "EVAL", text: `Eval kullanıldı kullanan ${interaction.user.username} (${interaction.user.id}) ${code}`, hex: "#FFB02F" });
                } else {
                    konsol.log({ name: "EVAL", text: `Çıkış:\n${sonuc}`, hex: "#FFB02F" });
                };
            } catch (e) {
                sonuc = e.message;
            };
            const embed = new AdvancedEmbed()
                .setInteraction(interaction)
                .setDescription("> Kod çalıştırıldı!")
                .addFields([
                    { name: "🤙 Çıktı", value: ` \`\`\`js\n${sonuc}\`\`\` `, inline: true }
                ])
                .setStyle(EmbedStyle.Success)
            interaction.reply({ embeds: [embed] });
        };
    };
};
