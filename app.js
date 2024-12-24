const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
 
// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Serve static files (such as images) from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));
// Serve static files from the 'Assets' folder
app.use(express.static(path.join(__dirname, 'Assets')));
// Middleware to parse JSON
app.use(express.json());
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

  app.get('/api/destinationsTwo', (req, res) => {
    const filePath = path.join(__dirname, 'Assets/destinations.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading destinations file');
      }
      res.json(JSON.parse(data));
    });
  });



// Load the destinations data from the JSON file
const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8'));

// Sample route to serve all destinations
app.get('/api/destinations', (req, res) => {
  res.json(destinations);
});



// Middleware to parse JSON
app.use(express.json());

let destinationInteractive = require('./Assets/destinations.json');

// Endpoint to update the rating of a destination
app.post('/update-rating', (req, res) => {
    const { destinationName, userRating } = req.body;

    if (!destinationName || userRating === undefined) {
        return res.status(400).json({ error: 'Invalid request payload' });
    }

    const destination = destinationInteractive.find(dest => dest.name === destinationName);

    if (!destination) {
        return res.status(404).json({ error: 'Destination not found' });
    }

    // Ensure the destination has a rating and count initialized
    if (!destination.rating) destination.rating = 0;
    if (!destination.count) destination.count = 0;

    // Calculate the new average rating
    const newRating = parseFloat(userRating);
    const newCount = destination.count + 1;
    const newAverageRating = ((destination.rating * destination.count) + newRating) / newCount;

    // Update the destination object
    destination.rating = newAverageRating;
    destination.count = newCount;

    // Write the updated destinations back to the JSON file
    fs.writeFile('./Assets/destinations.json', JSON.stringify(destinationInteractive, null, 2), (err) => {
        if (err) {
            console.error('Error updating destinations file:', err);
            return res.status(500).json({ error: 'Internal server error occurred' });
        }

        res.json({ message: 'Rating updated successfully', destination });
    });
});
  

module.exports = app;  // Export the app object