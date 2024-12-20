const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the 'Client' folder
app.use(express.static(path.join(__dirname, 'Client')));

// Serve static files from the 'Images' folder
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// Route to fetch locations based on the answer (e.g., 'Tropical' or 'Snowy')
app.get('/api/locations/', (req, res) => {
    const { answer } = req.params.toLowerCase(); // Normalize to lowercase
  
    // Define the mapping between answer and location IDs
    const answerMap = {
      tropical: [1, 2, 3],
      snowy: [4, 5, 6]

    };
  
    const ids = answerMap[answer];
    if (!ids) {
      console.error('Invalid answer:', answer);
      return res.status(400).send('Invalid answer');
    }
  
    // Read the JSON file containing location data
    fs.readFile(path.join(__dirname, 'data', 'locations.json'), 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading JSON file:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      // Parse the JSON data
      const locations = JSON.parse(data);
  
      // Filter locations based on the IDs
      const filteredLocations = locations.filter(location => ids.includes(location.id));
  
      if (filteredLocations.length > 0) {
        res.json(filteredLocations); // Send the filtered locations as JSON response
      } else {
        res.status(404).send('No locations found for the given answer');
      }
    });
  });
  

module.exports = app;
