const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.user,
     required: true
     },
  receiver: { type: mongoose.Schema.user,
     required: true 
    },
  message: { type: String,
     required: true 
    },
 
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
