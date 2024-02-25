const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const config = require("../../config.json");
const Konsol = require("../../utils/color");
const konsol = new Konsol();
require("dotenv").config();

const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});
/** @param {import("discord.js").Client} client */
module.exports = async (client) => {
    let idle;
    if (config.bot.idles !== "online" || config.bot.idles !== "idle" || config.bot.idles !== "dnd" || config.bot.idles !== "invisible") { idle = "idle" };
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: client.commands,
        });
    } catch (e) {
        console.error(e);
    }
    konsol.log({ name: "START", text: `${client.user.tag} adlı bot aktif edildi!`, hex: "#32d124", timeout: 5000 });

    setInterval(async () => {
        const randomPresenceIndex = Math.floor(Math.random() * config.bot.presences.length);
        const selectedPresence = config.bot.presences[randomPresenceIndex].replace("{botName}", client.user.username);

        client.user.setPresence({
            activities: [{ name: `${selectedPresence}`, type: ActivityType.Listening }],
            status: idle
        });
    }, 10000);
};