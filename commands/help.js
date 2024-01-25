const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display the command list."),

  async execute(interaction) {
    const commandListEmbed = new MessageEmbed()
      .setColor(config.color.default)
      .setTitle("**Help Panel Overview:**")
      .setDescription(`Hello **${interaction.user}**`)
      .setImage(config.banner)
      .setThumbnail(config.avatar)
      .addFields({
        name: `Commands`,
        value:
          "`/help`   **Displays the help command**\n`/create` **Create a new service**\n`/free`   **Generate free reward**\n`/premium` **Generate premium reward**\n`/riot` **Generate riot reward**\n`/add`    **Add a reward to the stock**\n`/stock`  **View the current stock**",
      })
      .setFooter(
        interaction.user.tag,
        interaction.user.displayAvatarURL({ dynamic: true, size: 64 }),
      )
      .setTimestamp();

    await interaction.reply({ embeds: [commandListEmbed] });
  },
};
