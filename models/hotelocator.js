const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String 
});

imageSchema.virtual('thumbnail').get(function() {
   return this.url.replace('/upload', '/upload/w_200');
    });

const hotelSchema = new Schema({
    title: String,
    price: String,
    rating: Number,
    image: [imageSchema],
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

