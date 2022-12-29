const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("glock").setDescription("in my rari"),
  async execute(interaction) {
    return interaction.reply({ files: ["./assets/videos/glock.mp4"] });
  },
};
