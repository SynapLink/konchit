// konchit_bot.js
const { Telegraf } = require('telegraf');
const fs = require('fs');

const bot = new Telegraf('7392591180:AAGe7BXu7tiP4hMKs0_jfvBV3w41j3rcnLc');

let userCounts = {};
let groupCounts = {};

// Load data if exists
try {
  const data = JSON.parse(fs.readFileSync('konchit_data.json'));
  userCounts = data.userCounts || {};
  groupCounts = data.groupCounts || {};
} catch (e) {
  console.log('No previous data found, starting fresh.');
}

function saveData() {
  fs.writeFileSync('konchit_data.json', JSON.stringify({ userCounts, groupCounts }, null, 2));
}

bot.command('sosi', (ctx) => {
  ctx.reply('polzovatel pososal');
});

bot.command('eblan', (ctx) => {
  ctx.reply('polzovatel eblan tupoi. fact check status: ✅ true');
});

bot.command('konchit', (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const chatId = ctx.chat.id;

  if (!userCounts[chatId]) userCounts[chatId] = {};
  if (!userCounts[chatId][userId]) userCounts[chatId][userId] = { name: username, count: 0 };

  userCounts[chatId][userId].count++;

  if (!groupCounts[chatId]) groupCounts[chatId] = 0;
  groupCounts[chatId]++;

  saveData();

  ctx.reply(`${username} konchit Count is: ${userCounts[chatId][userId].count}`);
});

bot.command('gkonchit', (ctx) => {
  const chatId = ctx.chat.id;
  const groupData = userCounts[chatId];

  if (!groupData) return ctx.reply('No konchit activity in this group yet.');

  const leaderboard = Object.entries(groupData)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([_, data], i) => `${i + 1}. ${data.name}: ${data.count}`)
    .join('\n');

  ctx.reply(`Konchit Leaderboard:\n${leaderboard}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
