require('http').createServer((req,res)=>res.end('Bot running!')).listen(3000);

const mineflayer = require('mineflayer');

const config = {
  host: 'thatpiece.minefort.com',
  port: 25565,
  username: 'AFKBot',
  version: '26.1.2',
  auth: 'offline',
  reconnectDelay: 1000,
};

let bot;

function createBot() {
  console.log('Connecting...');
  bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log('Connected!');
    startHuman();
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
    stopHuman();
    setTimeout(createBot, config.reconnectDelay);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
    stopHuman();
    setTimeout(createBot, config.reconnectDelay);
  });

  bot.on('end', () => {
    console.log('Disconnected. Reconnecting...');
    stopHuman();
    setTimeout(createBot, config.reconnectDelay);
  });
}

let intervals = [];

function startHuman() {
  // Random movement every 5-10 seconds
  intervals.push(setInterval(() => {
    if (!bot || !bot.entity) return;
    const dirs = ['forward', 'back', 'left', 'right'];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    ['forward','back','left','right'].forEach(d => bot.setControlState(d, false));
    bot.setControlState(dir, true);
    setTimeout(() => { try { bot.setControlState(dir, false); } catch(e){} }, Math.random() * 2000 + 500);
  }, Math.random() * 5000 + 5000));

  // Jump randomly
  intervals.push(setInterval(() => {
    if (!bot || !bot.entity) return;
    bot.setControlState('jump', true);
    setTimeout(() => { try { bot.setControlState('jump', false); } catch(e){} }, 500);
  }, Math.random() * 20000 + 15000));

  // Look around randomly
  intervals.push(setInterval(() => {
    if (!bot || !bot.entity) return;
    bot.look(
      (Math.random() * Math.PI * 2) - Math.PI,
      (Math.random() * 0.5) - 0.25,
      true
    );
  }, Math.random() * 8000 + 4000));

  // Swing arm
  intervals.push(setInterval(() => {
    if (!bot || !bot.entity) return;
    bot.swingArm();
  }, Math.random() * 15000 + 10000));

  // Sneak randomly
  intervals.push(setInterval(() => {
    if (!bot || !bot.entity) return;
    bot.setControlState('sneak', true);
    setTimeout(() => { try { bot.setControlState('sneak', false); } catch(e){} }, Math.random() * 2000 + 1000);
  }, Math.random() * 30000 + 20000));

  console.log('Human-like behavior started!');
}

function stopHuman() {
  intervals.forEach(i => clearInterval(i));
  intervals = [];
  try {
    ['forward','back','left','right','jump','sneak'].forEach(d => bot.setControlState(d, false));
  } catch(e) {}
}

createBot();
