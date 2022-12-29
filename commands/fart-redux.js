const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  generateDependencyReport,
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fart-redux")
    .setDescription("Join a VC, trust me"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return await interaction.reply({
        content: "You need to enter a voice channel before using the command",
        ephemeral: true,
      });
    }

    //get the voice channel ids
    const voiceChannelId = interaction.member.voice.channel.id;
    const guildId = interaction.guild.id;

    //create audio player
    const player = createAudioPlayer();

    player.on("error", (error) => {
      console.error(`Error: ${error.message} with resource`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    //create and play audio
    const resource = createAudioResource("./assets/audio/fart.mp3");
    player.play(resource);

    //create the connection to the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    interaction.reply({
      content: "Pushing one out x",
      ephemeral: true,
    });

    // Subscribe the connection to the audio player (will play audio on the voice connection)
    const subscription = connection.subscribe(player);

    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => subscription.unsubscribe(), 30_000);
    }
  },
};
