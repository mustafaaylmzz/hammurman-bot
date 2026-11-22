require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Eksik .env ayarı! .env.example dosyasını .env olarak kopyalayıp doldur.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// Kanal listesi: Her kategori kendi içinde sırayla oluşturulur.
// Aynı isimli kategoriler Discord'da kullanılabildiği için ayrı ayrı tutulmuştur.
const layout = [
  {
    category: "BİLGİ",
    text: ["📢・duyurular", "💸・fiyat-listesi", "⭐・müşteri-yorumları"]
  },
  {
    category: "PORTFOLYO",
    text: ["💼・çalışmalar"]
  },
  {
    category: "SİPARİŞ",
    text: ["💳・sipariş-oluştur"]
  },
  {
    category: "ETKİNLİKLER",
    text: ["🎲・etkinlikler", "💸・ses-hediye", "🏷️・tag-alma", "🤖・komutlar"]
  },
  {
    category: "WolfPrime",
    text: [
      "💬・sohbet",
      "📸・medya",
      "🤖・bot",
      "⚠️・hata-bildirimi",
      "💡・fikirler",
      "📊・oylama"
    ]
  },
  {
    category: "WolfPrime",
    text: ["🛡️・klan-paylaşımı", "⚔️・klan-savaşları"]
  },
  {
    category: "WolfPrime",
    text: [
      "🌍・resmi-kanallar",
      "🤖・kavren-dev",
      "📜・bilgi",
      "📢・duyurular",
      "💵・nakit-fiyatları",
      "🔄・güncellemeler",
      "❓・sss",
      "🛠️・hata-çözümleri",
      "🎥・yayın-video-paylaşım"
    ]
  },
  {
    category: "TOPLULUK",
    text: ["⚽・skor-tahmini", "💰・destekçiler"]
  },
  {
    category: "SES KANALLARI",
    voice: [
      "🔊・Genel-Sohbet",
      "🎮・Oyun-Odası-1",
      "🎮・Oyun-Odası-2",
      "🎮・Oyun-Odası-3",
      "🎵・Müzik",
      "💤・AFK",
      "🎙️・Toplantı-Odası"
    ]
  }
];

const command = new SlashCommandBuilder()
  .setName("kurulum")
  .setDescription("Sunucunun kategori, yazı ve ses kanallarını otomatik oluşturur.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: [command.toJSON()] }
  );
  console.log("/kurulum komutu sunucuya kaydedildi.");
}

async function createLayout(guild) {
  let createdCategories = 0;
  let createdChannels = 0;
  let skippedChannels = 0;

  for (const section of layout) {
    // Aynı isimli kategoriler olabileceğinden yalnızca bu çalıştırmada
    // oluşturulan kategori referansı kullanılır.
    const category = await guild.channels.create({
      name: section.category,
      type: ChannelType.GuildCategory
    });
    createdCategories++;

    for (const channelName of (section.text || [])) {
      const exists = guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildText &&
              ch.name === channelName &&
              ch.parentId === category.id
      );
      if (exists) {
        skippedChannels++;
        continue;
      }

      await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: category.id
      });
      createdChannels++;
    }

    for (const channelName of (section.voice || [])) {
      const exists = guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildVoice &&
              ch.name === channelName &&
              ch.parentId === category.id
      );
      if (exists) {
        skippedChannels++;
        continue;
      }

      await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: category.id
      });
      createdChannels++;
    }
  }

  return { createdCategories, createdChannels, skippedChannels };
}

client.once("ready", () => {
  console.log(`${client.user.tag} hazır!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "kurulum") return;

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: "Bu komutu yalnızca sunucu yöneticileri kullanabilir.",
      ephemeral: true
    });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const result = await createLayout(interaction.guild);
    await interaction.editReply(
      `✅ Kurulum tamamlandı!\n` +
      `• Oluşturulan kategoriler: **${result.createdCategories}**\n` +
      `• Oluşturulan kanallar: **${result.createdChannels}**\n` +
      `• Atlanan kanallar: **${result.skippedChannels}**`
    );
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      "❌ Kurulum sırasında hata oluştu. Botun **Kanalları Yönet** yetkisini ve rol sırasını kontrol et."
    );
  }
});

(async () => {
  try {
    await registerCommand();
    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error("Bot başlatılamadı:", error);
    process.exit(1);
  }
})();
