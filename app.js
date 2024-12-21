const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Serve static files (such as images) from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));
// Serve static files from the 'Assets' folder
app.use(express.static(path.join(__dirname, 'Assets')));

const travelDestinations = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8')
  );

// Serve static files (images) from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));  // Adjust this if your images are in a different folder
app.use('/destImages', express.static(path.join(__dirname, 'destImages')));

// Route to serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));  // Ensure index.html exists inside the 'client' folder
});

// API endpoint to fetch destinations by IDs
app.get('/api/destinations', (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const filteredDestinations = travelDestinations.filter(dest =>
      ids.includes(dest.id.toString())
    );
    res.json(filteredDestinations);
  });

// Middleware to parse JSON
app.use(express.json());

// Load the destinations data from the JSON file
const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8'));

// Sample route to serve all destinations
app.get('/api/destinations', (req, res) => {
  res.json(destinations);
});
  

module.exports = app;  // Export the app object
