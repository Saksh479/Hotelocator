const mongoose = require('mongoose');
const Hotel = require('../models/hotelocator');
const cities = require('./cities');
const {hotelPrefixes, hotelSuffixes} = require('./seed-helper');
main().catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hotelocator', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to database');

    } catch (error) {
        handleError(error);
      }
}
const prelength = hotelPrefixes.length;
const sufflength = hotelSuffixes.length;
const seedDB = async () => {
    await Hotel.deleteMany({});
    for (let i = 0; i < 50; i++) {
        random1000 = Math.floor(Math.random() * 1000);
    const hotel = new Hotel({
        author:'661c14bf4e822cd2724e7750',
        title: `${hotelPrefixes[Math.floor(Math.random() * prelength)]} ${hotelSuffixes[Math.floor(Math.random() * sufflength)]}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatumm.',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        price: Math.floor(Math.random() * 20) + 10,
        rating: Math.floor(Math.random() * 5) + 1
        })
await hotel.save();

    }
}
seedDB();
console.log('Seeded database');
