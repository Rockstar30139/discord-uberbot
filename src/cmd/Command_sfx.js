const voiceService = require("../VoiceService");
const chatService = require("../ChatService");
const streamSourceService = require("../StreamSourceService");
const ttsService = require("../TTSService");
const voiceLines = require("../../voiceLines.json");
const {createAudioPlayer, createAudioResource} = require("@discordjs/voice");
const {SlashCommandBuilder} = require("discord.js");

const getSfxUrl = (json, payload) => {
  const sfxUrls = [];
  for (const topic in json) {
    if (topic) {
      for (const element in json[topic]) {
        if (element) {
          sfxUrls.push(json[topic][element].url);
        }
      }
    }
  }
  const sfxUrl = sfxUrls[payload];
  return (sfxUrl);
};

const getSfx = (index) => new Promise((resolve, reject) => {
  streamSourceService.rawFileService.getStream(getSfxUrl(voiceLines.sfx, index)).
    then(resolve).
    catch(reject);
});


const playSfx = (stream, interaction) => {
  const audioPlayer = createAudioPlayer();
  const audioResource = createAudioResource(stream, {"inlineVolume": true});
  audioResource.volume.setVolume(voiceService.volume / 100);
  voiceService.getVoiceConnection(interaction).
    then((voiceConnection) => {
      voiceConnection.subscribe(audioPlayer);
      audioPlayer.play(audioResource);
    });
};

// eslint-disable-next-line max-lines-per-function
const run = (interaction) => {
  let parameter = [
    interaction.options.getInteger("kev"),
    interaction.options.getInteger("tobi"),
    interaction.options.getInteger("meme"),
    interaction.options.getInteger("wc3"),
    interaction.options.getInteger("portal")
  ];
  parameter = parameter.filter((item) => item !== null);
  if (parameter.length > 1) {
    interaction.reply("shame on you!");
    voiceService.getVoiceConnection(interaction).
      then((voiceConnection) => {
        const line = "Having issues to decide? Then I will decide foor you.";
        ttsService.announceMessage(line, voiceConnection).
          then((player) => {
            player.on("idle", () => {
              const sfxCount = Object.keys(voiceLines.sfx).reduce((sum, key) => sum + voiceLines.sfx[key].length, 0);
              const randomSfxIndex = Math.floor(Math.random() * sfxCount);
              getSfx(randomSfxIndex).then((sfx) => playSfx(sfx, interaction));
            });
          });
        // eslint-disable-next-line max-len
        parameter = [Math.floor(Math.random() * Object.keys(voiceLines.sfx).reduce((sum, key) => sum + voiceLines.sfx[key].length, 0))];
      }).
      catch((err) => console.log(err));
    return;
  } else if (parameter.length < 1) {
    voiceService.getVoiceConnection(interaction).
      then((voiceConnection) => {
        const line = "Just pick one silly. Here, let me help you.";
        ttsService.announceMessage(line, voiceConnection);
        parameter = [Math.floor(Math.random() * 49)];
      }).
      catch((err) => console.log(err));
  }
  const index = parameter[0];
  chatService.simpleNote(interaction, "Playing sfx.", chatService.msgType.Error, true);
  streamSourceService.rawFileService.getStream(getSfxUrl(voiceLines.sfx, index)).
    then((sfx) => {
      voiceService.getVoiceConnection(interaction).
        then((voiceConnection) => {
          const audioPlayer = createAudioPlayer();
          const audioResource = createAudioResource(sfx, {"inlineVolume": true});
          audioResource.volume.setVolume(voiceService.volume / 100);
          voiceConnection.subscribe(audioPlayer);
          audioPlayer.play(audioResource);
        });
    }).
    catch(((err) => console.log(err)));

};

module.exports = {
  "data": new SlashCommandBuilder().
    setName("sfx").
    setDescription("make the bot play dumb stuff").
    // eslint-disable-next-line max-lines-per-function
    addIntegerOption((option) => option.setName("kev").
      setDescription("Kevins sfx").
      setRequired(false).
      addChoices(
        {"name": "SpaßSpaßSpaß", "value": 0},
        {"name": "WTFBoom", "value": 1},
        {"name": "Weildasjaklarist", "value": 2},
        {"name": "Schadenfreude", "value": 3},
        {"name": "Schuing", "value": 4},
        {"name": "NO!", "value": 5},
        {"name": "Wololoo", "value": 6},
        {"name": "JibJib", "value": 7},
        {"name": "Over9000", "value": 8},
        {"name": "Schande", "value": 9}
      )).
    addIntegerOption((option) => option.setName("tobi").
      setDescription("Tobis sfx").
      setRequired(false).
      addChoices(
        {"name": "Babylaugh", "value": 10},
        {"name": "Arrow", "value": 11},
        {"name": "Hallelujah", "value": 12},
        {"name": "Araara", "value": 13},
        {"name": "Karate", "value": 14},
        {"name": "Botlaaane", "value": 15},
        {"name": "Ooouuuhhhh", "value": 16},
        {"name": "Chookity", "value": 17}
      )).
    addIntegerOption((option) => option.setName("meme").
      setDescription("meme sfx").
      setRequired(false).
      addChoices(
        {"name": "Nice!", "value": 18},
        {"name": "Aulos", "value": 19},
        {"name": "MedievalCoffin", "value": 20},
        {"name": "Nice!", "value": 21},
        {"name": "Yasss!", "value": 22},
        {"name": "Hello!", "value": 23},
        {"name": "Wow!", "value": 24},
        {"name": "Yoooo!", "value": 25},
        {"name": "Whatthehell?", "value": 26},
        {"name": "YeahBoy", "value": 27},
        {"name": "Ok...", "value": 28},
        {"name": "GreatSuccess!", "value": 29}
      )).
    addIntegerOption((option) => option.setName("wc3").
      setDescription("wc3 sfx").
      setRequired(false).
      addChoices(
        {"name": "ArbeitArbeit", "value": 30},
        {"name": "MehrArbeit?", "value": 31},
        {"name": "Ichgehdannmal", "value": 32},
        {"name": "Hilfe", "value": 33},
        {"name": "Daskannich", "value": 34},
        {"name": "KeineLust", "value": 35},
        {"name": "Richtig", "value": 36},
        {"name": "Arbeitistvollbracht", "value": 37},
        {"name": "Daswars", "value": 38},
        {"name": "TazdingoMann!", "value": 39}
      )).
    addIntegerOption((option) => option.setName("portal").
      setDescription("glados sfx").
      setRequired(false).
      addChoices(
        {"name": "Youbrokeit", "value": 40},
        {"name": "Didyousaysth?", "value": 41},
        {"name": "Ihateyou", "value": 42},
        {"name": "Quitewell", "value": 43},
        {"name": "Exellentwork", "value": 44},
        {"name": "Ikillyou", "value": 45},
        {"name": "Goodbye", "value": 46},
        {"name": "Ulistening?", "value": 47},
        {"name": "Donereasoning", "value": 48}
      )),
  async execute(interaction) {
    await run(interaction);
  },
  "scope": "A"
};
