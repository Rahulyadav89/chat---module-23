const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');


const app = express();

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server);


app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/realtime-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


const PORT =  8085;


server.listen(8085, () => {
  console.log(`Server running on 8085`);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
//update server
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

//for real time communication
//this was not working i have issue i written with chatgpt

const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle sending messages
  socket.on('send_message', async (data) => {
    const { sender, receiver, message } = data;

    // Save message to MongoDB
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();

    // Emit message to the receiver
    io.to(receiver).emit('receive_message', {
      sender,
      message,
      timestamp: newMessage.timestamp,
    });
  });

  // Handle joining a room (optional for scoped chats)
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
