const mongoose = require('mongoose');
const Hotel = require('../models/hotelocator');
const cities = require('./in');

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
    for (let i = 0; i < 250; i++) {
        random150 = Math.floor(Math.random() * cities.length);
    const hotel = new Hotel({
        author: '661c14bf4e822cd2724e7750',
        title: `${hotelPrefixes[Math.floor(Math.random() * prelength)]} ${hotelSuffixes[Math.floor(Math.random() * sufflength)]}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatumm.',
        location: `${cities[random150].city}, ${cities[random150].state}`,
        price: Number(Math.floor(Math.random() * 20) + 10),
        rating: Number(Math.floor(Math.random() * 5) + 1),
        image: [
            
            {
              url: 'https://res.cloudinary.com/hotelocator/image/upload/v1713966410/Hotelocator/vxoqa7q4bczhgcvbgh3y.jpg',
              filename: 'Hotelocator/vxoqa7q4bczhgcvbgh3y',
            },
            {
              url: 'https://res.cloudinary.com/hotelocator/image/upload/v1713966411/Hotelocator/atsrzw50kpsiprcqhuoi.jpg',
              filename: 'Hotelocator/atsrzw50kpsiprcqhuoi',
            },
            {
                url: 'https://res.cloudinary.com/hotelocator/image/upload/v1713966407/Hotelocator/a1ndjtyppvs9dgahwbsd.jpg',
                filename: 'Hotelocator/a1ndjtyppvs9dgahwbsd',
            }
          ],
        geometry: {
            type: 'Point',
            coordinates: [
                Number(cities[random150].longitude),
                Number(cities[random150].latitude)
            ]
        }
    });
await hotel.save();

    }
}
seedDB();
console.log('Seeded database');


