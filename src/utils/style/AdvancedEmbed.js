"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const { EmbedBuilder } = require("discord.js");

const successColor = "#4ecf41";
const errorColor = "#fb3030";
const warnColor = "#e59c27";
const loading = "https://cdn.discordapp.com/emojis/899716841910440048.gif";
const success = "https://cdn.discordapp.com/emojis/1183410715000832052.png";
const error = "https://cdn.discordapp.com/emojis/1183410798484271224.png";
const warn = "https://cdn.discordapp.com/emojis/1173913045127409724.png";

class AdvancedEmbed extends EmbedBuilder {
    constructor() {
        super();
        this.interaction = undefined;
        this.defaultColor = "#6ea8cd";
    }

    setDefaultColor(color) {
        this.defaultColor = color;
        return this;
    }

    setInteraction(interaction) {
        this.interaction = interaction;
        return this;
    }

    setStyle(style, title) {
        this.setAuthor({
            name: `${style === "success"
                ? "Başarılı — "
                : style === "loading"
                    ? "Yükleniyor — "
                    : style === "error"
                        ? "Hata — "
                        : style === "warn"
                            ? "Uyarı — "
                            : `${title ? `${title} — ` : ""}`
                }${this.interaction?.user.username}`,
            iconURL: this.interaction?.user.displayAvatarURL() ?? "",
        });
        this.setColor(
            style === "success"
                ? successColor
                : style === "loading"
                    ? this.defaultColor
                    : style === "error"
                        ? errorColor
                        : style === "warn"
                            ? warnColor
                            : this.defaultColor,
        );
        this.setFooter({
            text: `${style === "success"
                ? "İşlem başarıyla tamamlandı."
                : style === "loading"
                    ? "Bu işlem biraz zaman alabilir."
                    : style === "error"
                        ? "Bir hata oluştu, tekrar deneyin."
                        : style === "warn"
                            ? "Bir uyarı bulunuyor."
                            : `${this.interaction?.client.user.username} © Tüm hakları saklıdır.`
                }`,
            iconURL: `${style === "success"
                ? success
                : style === "loading"
                    ? loading
                    : style === "error"
                        ? error
                        : style === "warn"
                            ? warn
                            : `${this.interaction?.client.user.displayAvatarURL()}`
                }`,
        });
        this.setTimestamp();
        return this;
    }
}

const EmbedStyle = {
    Success: "success",
    Error: "error",
    Warn: "warn",
    Default: "default",
    Loading: "loading"
};

exports.AdvancedEmbed = AdvancedEmbed;
exports.EmbedStyle = EmbedStyle;