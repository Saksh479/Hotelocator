const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const hotelSchema = new Schema({
    title: String,
    price: String,
    rating: Number,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
hotelSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
module.exports = mongoose.model('Hotel', hotelSchema);

