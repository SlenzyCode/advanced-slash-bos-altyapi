const { Client, IntentsBitField, Partials, EmbedBuilder } = require("discord.js");
const config = require("./config.json");
const path = require("path");
const fs = require("fs");
const Konsol = require("./utils/color");
const konsol = new Konsol();
require("dotenv").config({ path: path.resolve("example.env") });

const client = new Client({
    intents: Object.values(IntentsBitField.Flags),
    partials: Object.values(Partials),
});

global.client = client;
client.commands = global.commands = [];
const commandsDir = path.join(__dirname, 'commands');
const eventsDir = path.join(__dirname, 'events');

fs.readdirSync(commandsDir).forEach((category) => {
    fs.readdirSync(path.join(commandsDir, category)).forEach(async (file) => {
        if (!file.endsWith('.js')) return;

        const commands = require(path.join(commandsDir, category, file));

        client.commands.push({
            name: commands.name.toLowerCase(),
            description: commands.description,
            options: commands.options,
            dm_permission: false,
            type: 1,
        });
        konsol.log({ name: "COMMANDS", text: `${commands.name} adlı komudu yükledim!`, hex: "#c22f2f", timeout: 1000 });
    });
});

fs.readdirSync(eventsDir).forEach((category) => {
    fs.readdirSync(path.join(eventsDir, category)).forEach(async (file) => {
        if (!file.endsWith('.js')) return;

        const eve = require(path.join(eventsDir, category, file));
        const name = file.split('.')[0];

        client.on(name, (...args) => {
            eve(client, ...args);
        });
        konsol.log({ name: "EVENTS", text: `${name} adlı eventi yükledim!`, hex: "#112561", timeout: 1000 });
    });
});

process.on("uncaughtException", (err) => { konsol.error({ name: "ERROR", text: err.stack, timeout: 1000 }); client.channels.cache.get(config.error_log.channel_id).send({ embeds: [new EmbedBuilder().setColor("Red").setTitle(`${client.user.username} - Hata`).setDescription(`**${client.user.username}** adlı botda bir hata ile karşılaşıldı.`).addFields([{ name: "⚠️Hata", value: err.message, inline: true }])] }) });
process.on("unhandledRejection", (err) => { konsol.error({ name: "ERROR", text: err.stack, timeout: 1000 }); client.channels.cache.get(config.error_log.channel_id).send({ embeds: [new EmbedBuilder().setColor("Red").setTitle(`${client.user.username} - Hata`).setDescription(`**${client.user.username}** adlı botda bir hata ile karşılaşıldı.`).addFields([{ name: "⚠️Hata", value: err.message, inline: true }])] }) });

client.login(process.env.TOKEN);