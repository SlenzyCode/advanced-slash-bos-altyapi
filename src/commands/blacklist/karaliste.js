const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { AdvancedEmbed, EmbedStyle } = require("../../utils/style/AdvancedEmbed");
const { database } = require("../../utils/database/genelData");
const config = require("../../config.json");

module.exports = {
    name: "karaliste",
    description: "Bir kullanıcıyı karalisteye eklemeye/çıkarmaya yarar.",
    options: [
        {
            name: "işlem", description: "Bir kullanıcıyı karalisteye eklemeye/çıkarmaya yarar.", type: 1, options: [
                { name: "işlem", description: "Karaliste işlemini seçiniz.", type: 3, required: true, choices: [{ name: "Karaliste Ekle", value: "blacklist_add" }, { name: "Karaliste Çıkar", value: "blacklist_remove" }] },
                { name: "kullanıcı", description: "Karalisteye eklenecek/çıkarılacak kullanıcıyı seçiniz.", type: 6, required: true },
                { name: "sebep", description: "Karalisteye eklenecek/çıkarılacak kullanıcıyı seçiniz.", type: 3, required: true }
            ]
        }
    ],
    /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
    async run(client, interaction) {
        const process = interaction.options.getString("işlem");
        const user = interaction.options.getUser("kullanıcı");
        const reason = interaction.options.getString("sebep");
        if (!config.bot.owners.includes(interaction.user.id)) return interaction.reply({ embeds: [new AdvancedEmbed().setInteraction(interaction).setDescription("Bu komudu kullanabilmek için `Bot Sahibi` olmalısınız.").setStyle(EmbedStyle.Error)], ephemeral: true })
        if (user.id === database.get(`blacklist${user.id}.id`)) return interaction.reply({ embeds: [new AdvancedEmbed().setInteraction(interaction).setDescription(`${user} adlı kullanıcı zaten karalistede bulunuyor.`).setStyle(EmbedStyle.Error)], ephemeral: true })
        const basarili = new AdvancedEmbed()
            .setInteraction(interaction)
            .setDescription(`Başarıyla ${user} adlı kullanıcı **${reason}** sebebiyle **${process.replace("blacklist_add", "karaliste ekleme").replace("blacklist_remove", "karaliste çıkartma")}** işlemi uygulandı.`)
            .setStyle(EmbedStyle.Success)
        interaction.reply({ embeds: [basarili], ephemeral: true });
        if (process === "blacklist_add") {
            return database.set(`blacklist${interaction.user.id}`, reason);
        };
        if (process === "blacklist_remove") {
            return database.delete(`blacklist${interaction.user.id}`);
        };
    }
};