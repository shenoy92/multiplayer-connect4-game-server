const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv=require('dotenv');
dotenv.config();
const { addUser, removeUser, getUser} = require('./users');
const router = require('./router');

const app = express();
const server = http.createServer(app);

const io = socketio(server, { cors: { origin:'*' } });

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });
      const payload = { data: null, errorMsg: null };
      if(error) {
        payload.errorMsg = error;
        return callback(payload);
      }
      payload.data = user;
      socket.join(user.room);
      callback(payload);
    });
  
    socket.on('player', (gameState) => {
      const user = getUser(socket.id);
      io.to(user.room).emit('play', gameState);
    });
  
    socket.on('disconnect', () => {
      removeUser(socket.id);
    })
  });

server.listen(process.env.PORT || 3200, () => console.log(`Server has started.`));