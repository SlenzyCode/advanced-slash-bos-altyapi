const { ShardingManager, WebhookClient } = require("discord.js");
const path = require("path");
const Konsol = require("./utils/color");
const konsol = new Konsol();
const webhook = new WebhookClient({ url: process.env.WEBHOOK })
require("dotenv").config({ path: path.resolve("example.env") });

const manager = new ShardingManager(path.join(__dirname, "app.js"), {
    totalShards: "auto",
    token: process.env.TOKEN,
});

manager.on("shardCreate", async (shard) => {
    shard.on("ready", async () => {
        konsol.log({ name: `SHARD ${shard.id}`, text: `${shard.id} numaralı shard başarıyla çalıştırıldı!`, hex: "#32d124", timeout: 5000 });
        webhook.send({ content: `🟩 **${shard.id}** numaralı shard başarıyla çalıştırıldı!` });
    });
    shard.on("reconnecting", async () => {
        konsol.log({ name: `SHARD ${shard.id}`, text: `${shard.id} numaralı shard yeniden başlatıldı!`, hex: "#FFB02F", timeout: 5000 });
        webhook.send({ content: `🟨 **${shard.id}** numaralı shard yeniden başlatıldı!` });
    });
    shard.on("death", async () => {
        konsol.error({ name: "ERROR", text: `${shard.id} numaralı shard çöktü, yeniden başlatılıyor!`, timeout: 1000 });
        webhook.send({ content: `🟥 **${shard.id}** numaralı shard çöktü, yeniden başlatılıyor!` });
    });
    shard.on("disconnect", async () => {
        konsol.error({ name: "ERROR", text: `${shard.id} numaralı shard çöktü, yeniden başlatılıyor!`, timeout: 1000 });
        webhook.send({ content: `🟥 **${shard.id}** numaralı shard çöktü, yeniden başlatılıyor!` });
    });
    shard.on("error", async () => {
        konsol.error({ name: `SHARD ${shard.id}`, text: `${shard.id} numaralı shard hata!`, timeout: 1000 });
        webhook.send({ content: `🟥 **${shard.id}** numaralı shard hata!` });
    });
});

manager.spawn();