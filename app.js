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

// Middleware to parse JSON
app.use(express.json());

// Load the destinations data from the JSON file
const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8'));

// Sample route to serve all destinations
app.get('/api/destinations', (req, res) => {
  res.json(destinations);
});

app.post('/update-rating', (req, res) => {
  try {
    const { destinationName, userRating } = req.body;

    if (!destinationName || isNaN(userRating)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Load destinations from JSON file
    const destinations = require('Assets/destinations.json');

    // Find the destination
    const destination = destinations.find(dest => dest.name === destinationName);
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Update the rating
    destination.ratings.push(userRating); // Assuming an array of ratings exists
    const total = destination.ratings.reduce((sum, r) => sum + r, 0);
    destination.rating = total / destination.ratings.length;

    // Save updated destinations back to file
    const fs = require('fs');
    fs.writeFileSync('./destinations.json', JSON.stringify(destinations, null, 2));

    res.json({ destination });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error occurred' });
  }
});

  

module.exports = app;  // Export the app object
