import winston from 'winston'

const FLOOD_TIME = 10000;
const FLOOD_MAX = 100;

const flood = {
  floods: {},
  lastFloodClear: new Date(),
  protect: (socket) => {

    if (Math.abs( new Date() -  flood.lastFloodClear) > FLOOD_TIME){
      flood.floods = {};
      flood.lastFloodClear = new Date()
    }

    flood.floods[socket.id] == undefined ? flood.floods[socket.id] = {} : flood.floods[socket.id];
    flood.floods[socket.id].count == undefined ? flood.floods[socket.id].count = 0 : flood.floods[socket.id].count;
    flood.floods[socket.id].count++;

    if(flood.floods[socket.id].count > FLOOD_MAX){
      winston.error('FLOODPROTECTION ', socket.id)
      socket.disconnect();
      return false
    }
    return true;
  }
}

export default flood;


// http://stackoverflow.com/questions/22110010/node-socket-io-anything-to-prevent-flooding
