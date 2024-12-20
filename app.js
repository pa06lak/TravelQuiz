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
  { id: 1, name: 'Paris', description: 'City of Lights', image: '/destImages/Paris.jpeg' },
  { id: 2, name: 'New York', description: 'The Big Apple', image: '/destImages/NYC.jpeg' },
  { id: 3, name: 'Tokyo', description: 'The Capital of Japan', image: '/destImages/Tokyo.jpeg' },
  // Add more destinations as necessary
];

// API endpoint to get data by ID(s)
app.get('/api/destinations', (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(',') : [];
  const filteredDestinations = travelDestinations.filter(dest => ids.includes(dest.id.toString()));
  res.json(filteredDestinations);
});

module.exports = app;  // Export the app object
