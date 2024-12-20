const express = require('express');
const app = express();
const path = require('path');

// Serve static files (such as images) from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));

// Serve static files (images) from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));  // Adjust this if your images are in a different folder
app.use('/destImages', express.static(path.join(__dirname, 'destImages')));

// Route to serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));  // Ensure index.html exists inside the 'client' folder
});

// Example travel destinations data
const travelDestinations = [
    { id: 1, name: 'London', description: 'A bustling city known for its rich history, iconic landmarks, and vibrant culture.', image: '/destImages/london.jpeg' },
    { id: 2, name: 'New York', description: 'City of Lights', image: '/destImages/NYC.jpeg' },
    { id: 3, name: 'Bali', description: 'An ancient city rich in history, art, and architecture.', image: '/destImages/Bali.jpeg' },
    { id: 4, name: 'Paris', description: 'A picturesque island known for its whitewashed buildings and stunning sunsets.', image: '/destImages/Paris.jpeg' },
    { id: 5, name: 'Tokyo', description: 'A city that straddles Europe and Asia, rich in history and culture.', image: '/destImages/Tokyo.jpeg' },
    { id: 6, name: 'Cape Town', description: 'A city known for its well-preserved medieval architecture and vibrant atmosphere.', image: '/destImages/Capetown.jpeg' },
    { id: 7, name: 'Rio de Janeiro', description: 'A charming city with canals, bicycles, and art museums.', image: '/destImages/Rio.jpeg' },
    { id: 8, name: 'Sydney', description: 'A city of classical music, imperial palaces, and coffee houses.', image: '/destImages/Sydney.jpeg' },
    { id: 9, name: 'Marrakech', description: 'A city known for its historic Kremlin and Red Square.', image: '/destImages/Marrakech.jpeg' },
    { id: 10, name: 'Bangkok', description: 'A city known for its financial district, museums, and lakeside views.', image: '/destImages/Bangkok.jpeg' },
    { id: 11, name: 'Athens', description: 'The cradle of Western civilization with ancient ruins and vibrant streets.', image: '/destImages/Athens.jpeg' },
    { id: 12, name: 'Edinburgh', description: 'A historic city known for its castle, festivals, and charming streets.', image: '/destImages/Edinburgh.jpeg' },
    { id: 13, name: 'Florence', description: 'The birthplace of the Renaissance, with incredible art and architecture.', image: '/destImages/Florence.jpeg' },
    { id: 14, name: 'New York', description: 'The city that never sleeps, famous for its skyline, Broadway shows, and diverse cuisine.', image: '/destImages/NYC.jpeg' },
    { id: 15, name: 'Los Angeles', description: 'A sprawling city known for Hollywood, beaches, and entertainment.', image: '/destImages/LA.jpeg' },
    { id: 16, name: 'Hawaii', description: 'A tropical paradise known for its beaches, volcanoes, and unique culture.', image: '/destImages/Hawaii.jpeg' },
    { id: 17, name: 'San Francisco', description: 'Known for its iconic Golden Gate Bridge, cable cars, and tech scene.', image: '/destImages/SF.jpeg' },
    { id: 18, name: 'Mexico City', description: 'A sprawling city with rich history, culture, and cuisine.', image: '/destImages/Mexico.jpeg' },
    { id: 19, name: 'Bali', description: 'A tropical paradise known for its beaches, temples, and vibrant culture.', image: '/destImages/Bali.jpeg' },
    { id: 20, name: 'Tokyo', description: 'A vibrant city blending traditional culture with cutting-edge technology.', image: '/destImages/Tokyo.jpeg' },
    { id: 21, name: 'Bangkok', description: 'A city known for its vibrant street life and ornate temples.', image: '/destImages/Bangkok.jpeg' },
    { id: 22, name: 'Dubai', description: 'A modern city known for luxury shopping, ultramodern architecture, and nightlife.', image: '/destImages/Dubai.jpeg' },
    { id: 23, name: 'Singapore', description: 'A modern city-state known for its cleanliness, gardens, and skyline.', image: '/destImages/Singapore.jpeg' },
    { id: 24, name: 'Seoul', description: 'A vibrant city blending modern technology with traditional temples.', image: '/destImages/Seoul.jpeg' },
    { id: 25, name: 'Hong Kong', description: 'A dynamic city known for its skyline, food, and bustling markets.', image: '/destImages/HK.jpeg' },
    { id: 26, name: 'Kyoto', description: 'A city known for its classical Buddhist temples, gardens, and traditional geisha culture.', image: '/destImages/Kyoto.jpeg' },
    { id: 27, name: 'Mumbai', description: 'Vibrant metropolis where modernity meets tradition. A city that never sleeps.', image: '/destImages/Mumbai.jpeg' },
    { id: 28, name: 'Cape Town', description: 'A coastal city with stunning landscapes and a rich cultural heritage.', image: '/destImages/Capetown.jpeg' },
    { id: 29, name: 'Marrakech', description: 'A bustling city known for its markets, palaces, and historic sites.', image: '/destImages/Marrakech.jpeg' },
    { id: 30, name: 'Cairo', description: 'Home to the Pyramids of Giza and a city steeped in history.', image: '/destImages/Cairo.jpeg' },
    { id: 31, name: 'Sydney', description: 'A city known for its stunning harbor, opera house, and beaches.', image: '/destImages/Sydney.jpeg' },
    { id: 32, name: 'Buenos Aires', description: 'A vibrant city known for its European-style architecture, tango music, and cuisine.', image: '/destImages/BuenosAires.jpeg' },
    { id: 33, name: 'Rio de Janeiro', description: 'A city famous for its beaches, carnival, and the iconic Christ the Redeemer statue.', image: '/destImages/Rio.jpeg' },
    { id: 34, name: 'Lagos', description: 'A bustling metropolis that is the cultural and economic hub of Nigeria.', image: '/destImages/Lagos.jpeg' },
    { id: 35, name: 'Kuala Lumpur', description: 'A modern city known for its skyscrapers, shopping malls, and diverse culture.', image: '/destImages/KL.jpeg' },
    { id: 36, name: 'Berlin', description: 'A city rich in history, art, and culture, known for its vibrant nightlife.', image: '/destImages/Berlin.jpeg' },
    { id: 37, name: 'Barcelona', description: 'A city known for its architecture, Mediterranean beaches, and lively atmosphere.', image: '/destImages/Barcelona.jpeg' },
    { id: 38, name: 'Madrid', description: 'A city with a rich cultural heritage, famous for its art, architecture, and food.', image: '/destImages/Madrid.jpeg' },
    { id: 39, name: 'Lisbon', description: 'A city known for its historic neighborhoods, scenic views, and delicious food.', image: '/destImages/Lisbon.jpeg' },
    { id: 40, name: 'Stockholm', description: 'A beautiful city built on islands, known for its design, museums, and vibrant life.', image: '/destImages/Stockholm.jpeg' },
    { id: 41, name: 'Oslo', description: 'A city surrounded by nature with a rich cultural heritage and modern attractions.', image: '/destImages/Oslo.jpeg' },
    { id: 42, name: 'Helsinki', description: 'A modern city with a stunning archipelago, rich history, and innovative design.', image: '/destImages/Helsinki.jpeg' },
    { id: 43, name: 'Tallinn', description: 'A medieval city with cobblestone streets and a beautifully preserved old town.', image: '/destImages/Tallinn.jpeg' },
    { id: 44, name: 'Reykjavik', description: 'The capital of Iceland, known for its stunning landscapes and unique culture.', image: '/destImages/Reykjavik.jpeg' },
    { id: 45, name: 'Monaco', description: 'A small, glamorous city-state known for its luxurious lifestyle and casinos.', image: '/destImages/Monaco.jpeg' },
    { id: 46, name: 'Copenhagen', description: 'A city known for its canals, cycling culture, and modern architecture.', image: '/destImages/Copenhagen.jpeg' },
    { id: 47, name: 'Luxembourg', description: 'A small but beautiful country with a rich history and stunning landscapes.', image: '/destImages/Luxembourg.jpeg' },
    { id: 48, name: 'Geneva', description: 'A city known for its international organizations, luxury shops, and stunning lake views.', image: '/destImages/Geneva.jpeg' },
    { id: 49, name: 'Brussels', description: 'The capital of the EU, known for its architecture, museums, and delicious chocolate.', image: '/destImages/Brussels.jpeg' },
    { id: 50, name: 'Lagos', description: 'A bustling metropolis that is the cultural and economic hub of Nigeria.', image: '/destImages/Lagos.jpeg' }
    
];

// API endpoint to get data by ID(s)
app.get('/api/destinations', (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  const filteredDestinations = travelDestinations.filter(dest => ids.includes(dest.id.toString()));
  res.json(filteredDestinations);
});

module.exports = app;  // Export the app object
