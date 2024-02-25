const moment = require("moment");

class Konsol {
    convertHexToRgb(hex) {
        const hexValue = hex.replace("#", "");
        const red = parseInt(hexValue.substring(0, 2), 16);
        const green = parseInt(hexValue.substring(2, 4), 16);
        const blue = parseInt(hexValue.substring(4, 6), 16);
        return { red, green, blue };
    }

    log({ name, text, hex: hexColor, timeout: ms }) {
        const rgbColor = this.convertHexToRgb(hexColor);
        const white = this.convertHexToRgb("#ffffff");
        let beyaz = `\x1b[38;2;${white.red};${white.green};${white.blue}m`;
        const coloredText = `\x1b[1m\x1b[38;2;${rgbColor.red};${rgbColor.green};${rgbColor.blue}m[${moment().format("DD-MM-YYYY HH:mm:ss")}]${beyaz} - \x1b[38;2;${rgbColor.red};${rgbColor.green};${rgbColor.blue}m[${name}]\x1b[0m${beyaz} ${text}\x1b[0m`;
        if (!ms) return console.log(coloredText);
        setTimeout(() => {
            console.log(coloredText);
        }, ms);
    }
    
    error({ name, text, timeout: ms }) {
        this.log({ name, text, hex: "#ff0000", timeout: ms });
    }
}

module.exports = Konsol;