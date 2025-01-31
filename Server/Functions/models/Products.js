const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    Products: [{
        productId: Number,
        uniqueId: String,
        ProductName: String,
        Quantity: Number,
        ImagePath: String,
        rating: {
            type: Number,
            default: 0
        },
        review: [{
            by : String,
            review : String
        }],
        sold: {
            type: Number,
            default: 0
        },
        Price: Number,
        NightCharge: Number,
        Extra: String,
        SoldUnits: [{
            Units: Number,
            buyer: String,
            time: String
        }],
        InProgress: [{
            Units: Number,
            buyer: String,
            time: String,
            ChatId: mongoose.Schema.Types.ObjectId
        }],
        DateTime: Date
    }]
});

module.exports = mongoose.model('Product', productSchema);
