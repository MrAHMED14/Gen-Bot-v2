const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const fs = require("fs").promises;
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Display the service stock."),

  async execute(interaction) {
    const freeStock = await getStock(`${__dirname}/../free/`);
    const premiumStock = await getStock(`${__dirname}/../premium/`);
    const roitStock = await getStock(`${__dirname}/../riot/`);

    const embed = new MessageEmbed()
      //Stock layout
      .setColor(config.color.default)
      .setTitle("**ksgenrator Service Stock**") 
      .setDescription(`Hello **${interaction.user}** 👋`) 
      .setImage(config.banner)
      .setFooter(`${config.footer}`);

    if (freeStock.length > 0) {
      const freeStockInfo = await getServiceInfo(
        `${__dirname}/../free/`,
        freeStock
      );
      embed.addFields({
        name: "Free Services",
        value: freeStockInfo,
        inline: true,
      });
    }

    if (premiumStock.length > 0) {
      const premiumStockInfo = await getServiceInfo(
        `${__dirname}/../premium/`,
        premiumStock
      );
      embed.addFields({
        name: "Premium Services",
        value: premiumStockInfo,
        inline: true,
      });
    }

    if (roitStock.length > 0) {
      const roitStockInfo = await getServiceInfo(
        `${__dirname}/../riot/`,
        roitStock
      );
      embed.addFields({
        name: "Riot Services",
        value: roitStockInfo,
        inline: true,
      });
    }

    interaction.reply({ embeds: [embed] });
  },
};

async function getStock(directory) {
  try {
    const files = await fs.readdir(directory);

    const stock = files.filter((file) => file.endsWith(".txt"));
    return stock;
  } catch (err) {
    console.error("Unable to scan directory: " + err);
    return [];
  }
}

async function getServiceInfo(directory, stock) {
  let info = [];
  for (const service of stock) {
    const serviceContent = await fs.readFile(
      `${directory}/${service}`,
      "utf-8"
    );

    let lines = serviceContent.split(/\r?\n/);
    const numServices = lines.filter(line => line.trim() !== '' && line.length > 0);
    info.push(`**${service.replace(".txt", "")}:** \`${numServices.length}\``);
  }
  return info.join("\n");
}
