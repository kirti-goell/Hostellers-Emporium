const mongoose = require('mongoose');

const chatGroupSchema = new mongoose.Schema({
    Chats: [{
        sender: String,
        message: String,
        timestamp: String
    }]
});

module.exports = mongoose.model('ChatGroup', chatGroupSchema);
