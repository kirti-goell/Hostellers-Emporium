const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true
    },
    InProgressBuying: [{
        ProductName: String,
        Units: Number,
        Seller: String,
        time: String,
        ChatId: mongoose.Schema.Types.ObjectId
    }],
    Bought: [{
        ProductName: String,
        Units: Number,
        Seller: String,
        time: Date,
        ChatId: mongoose.Schema.Types.ObjectId
    }]
});

module.exports = mongoose.model('User', userSchema);
