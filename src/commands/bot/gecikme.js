const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("../../utils/style/AdvancedEmbed");

module.exports = {
    name: "gecikme",
    description: "Botun gecikme hızını gösterir.",
    /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
    async run(client, interaction) {
        const embed = new AdvancedEmbed()
            .setInteraction(interaction)
            .setDefaultColor("Green")
            .setDescription(`> Aşağıda bulunan gecikme değerleri kalıcı değil geçicidir, gecikme değerleri her an değişiklik gösterebilir.\n\n**Gecikme Bilgileri**\nWebsocket gecikmesi: \`${client.ws.ping}\` `)
            .setStyle(EmbedStyle.Default)
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Güncelle")
                    .setEmoji("🔄")
                    .setCustomId('guncelle_gecikme' + interaction.user.id)
                    .setStyle(ButtonStyle.Primary)
            )
        const reply = await interaction.reply({ embeds: [embed], components: [button] });
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
        collector.on("collect", async (interaction) => {
            if (interaction.customId === 'guncelle_gecikme' + interaction.user.id) {
                await interaction.update({ embeds: [embed] });
            };
        });
        collector.on("end", () => {
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Güncelle")
                        .setEmoji("🔄")
                        .setCustomId('guncelle_gecikme' + interaction.user.id)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
            reply.edit({ components: [button] }).catch(() => { });
        });

    }
};