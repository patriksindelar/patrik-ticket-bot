const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

/* =======================
   ENV VARIABLES (Railway)
   ======================= */
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("❌ Missing ENV variables (TOKEN / CLIENT_ID / GUILD_ID)");
  process.exit(1);
}

/* =======================
   CLIENT SETUP
   ======================= */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

/* =======================
   SLASH COMMANDS
   ======================= */
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is online"),

  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Developer information"),

  new SlashCommandBuilder()
    .setName("services")
    .setDescription("Services and pricing"),
].map(cmd => cmd.toJSON());

/* =======================
   REGISTER COMMANDS
   ======================= */
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🔁 Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash commands registered");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
})();

/* =======================
   READY EVENT
   ======================= */
client.once("ready", () => {
  console.log(`🤖 Bot logged in as ${client.user.tag}`);
  client.user.setActivity("💻 Web & Discord Bots", { type: 0 });
});

/* =======================
   INTERACTIONS
   ======================= */
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {

    /* /ping */
    if (interaction.commandName === "ping") {
      return interaction.reply("🏓 Bot is online and working!");
    }

    /* /info */
    if (interaction.commandName === "info") {
      return interaction.reply({
        content:
`👋 **Hello!**

My name is **Patrik** — JavaScript & Node.js developer.

💻 **Specialization**
• Websites  
• HTML5 games  
• Discord bots  
• Bug fixing  

📦 **Portfolio**
https://lob-jidlo.netlify.app  
https://play-the-earn.netlify.app  

💬 **Contact**
Discord: **sindel23**
Server: https://discord.gg/GMAVqWjzSG`
      });
    }

    /* /services */
    if (interaction.commandName === "services") {
      return interaction.reply({
        content:
`💼 **SERVICES & PRICING**

🛠️ Bug fixing: **300 – 1500 CZK / 15 – 60 USD**  
🌐 Website: **2000 – 6000 CZK / 90 – 250 USD**  
🎮 Mini game: **1000 – 5000 CZK / 40 – 200 USD**  
🤖 Discord bot: **1000 – 10000 CZK / 40 – 400 USD**

⏱️ Delivery time: **24–72 hours**  
💬 Fast communication  

➡️ For orders, message me in **#orders** or via **DM**`
      });
    }

  } catch (error) {
    console.error("❌ Command error:", error);
    if (!interaction.replied) {
      interaction.reply({
        content: "❌ An unexpected error occurred.",
        ephemeral: true
      });
    }
  }
});

/* =======================
   LOGIN
   ======================= */
client.login(TOKEN);
