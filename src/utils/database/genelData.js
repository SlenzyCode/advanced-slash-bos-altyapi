const { JsonDatabase } = require("wio.db");
const path = require("path");
const databasePath = path.resolve("src/database", 'main.json');
const db = new JsonDatabase({ databasePath });
module.exports = { database: db };