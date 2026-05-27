const mineflayer = require('mineflayer');
const config = {
  host: 'thatpiece.minefort.com',
  port: 25565,
  username: 'AFKBot',
  version: '1.21.1',
  auth: 'offline',
  reconnectDelay: 5000,
};
let bot;
let startTime = Date.now();
function createBot() {
  console.log(`Connecting to ${config.host}...`);
  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: config.auth,
  });
  bot.once('spawn', () => {
    console.log('Connected!');
    startAntiAFK();
  });
  bot.on('kicked', (reason) => { console.log('Kicked:', reason); stopAntiAFK(); scheduleReconnect(); });
  bot.on('error', (err) => { console.error('Error:', err.message); stopAntiAFK(); scheduleReconnect(); });
  bot.on('end', () => { console.log('Disconnected.'); stopAntiAFK(); scheduleReconnect(); });
}
let afkInterval, jumpInterval, lookInterval;
function startAntiAFK() {
  jumpInterval = setInterval(() => { if(bot&&bot.entity){bot.setControlState('jump',true);setTimeout(()=>bot.setControlState('jump',false),500);} }, 30000);
  let d=0;
  afkInterval = setInterval(() => { if(!bot||!bot.entity)return; ['forward','back','left','right'].forEach(x=>bot.setControlState(x,false)); const dirs=['forward','back','left','right']; d=(d+1)%4; bot.setControlState(dirs[d],true); setTimeout(()=>{if(bot&&bot.entity)bot.setControlState(dirs[d],false);},1500); }, 8000);
  lookInterval = setInterval(() => { if(bot&&bot.entity)bot.look((Math.random()*Math.PI*2)-Math.PI,(Math.random()*Math.PI/2)-Math.PI/4,true); }, 10000);
}
function stopAntiAFK() { clearInterval(afkInterval); clearInterval(jumpInterval); clearInterval(lookInterval); }
function scheduleReconnect() { setTimeout(()=>{startTime=Date.now();createBot();},config.reconnectDelay); }
createBot();
