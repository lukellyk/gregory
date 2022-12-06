import { config } from "dotenv";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";

config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in!`);
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isChatInputCommand()) {
    interaction.reply({
      content: `You ordered ${interaction.options.get("food").value} and ${
        interaction.options.get("drink").value
      }`,
    });
  }
});

async function main() {
  const orderCommand = new SlashCommandBuilder()
    .setName("order")
    .setDescription("Order your favourite meals")
    .addStringOption((option) =>
      option
        .setName("food")
        .setDescription("Select your favourite food")
        .setRequired(true)
        .setChoices(
          {
            name: "Cake",
            value: "cake",
          },
          {
            name: "Hamburger",
            value: "hamburger",
          },
          {
            name: "Pizza",
            value: "pizza",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("drink")
        .setDescription("Select your favourite drink")
        .setRequired(true)
        .setChoices(
          {
            name: "Water",
            value: "water",
          },
          {
            name: "Coke",
            value: "coke",
          },
          {
            name: "Sprite",
            value: "sprite",
          }
        )
    );

  const commands = [orderCommand.toJSON()];

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {}
}

main();
