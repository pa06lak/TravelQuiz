const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
 
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'client')));
// Serve static files from the 'Assets' folder
app.use(express.static(path.join(__dirname, 'Assets')));
app.use(express.json());
const travelDestinations = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8')
  );
app.use('/images', express.static(path.join(__dirname, 'images')));  // Adjust this if your images are in a different folder
app.use('/destImages', express.static(path.join(__dirname, 'destImages')));





//--------------------------------------------------------------------------------------------------------------------------------
// Public Interface 
app.get('/api/destinations', (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    const filteredDestinations = travelDestinations.filter(dest =>
      ids.includes(dest.id.toString())
    );
    res.json(filteredDestinations);
  });
//--------------------------------------------------------------------------------------------------------------------------------





// --------------------------------------------------------------------------------------------------------------------
// Build the destination list for the specified options selected by the user
  app.get('/api/destinationsTwo', (req, res) => {
    const filePath = path.join(__dirname, 'Assets/destinations.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading destinations file');
      }
      res.json(JSON.parse(data));
    });
  });
// --------------------------------------------------------------------------------------------------------------------








// Load the destinations data from the JSON file
const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'Assets/destinations.json'), 'utf-8'));
app.use(express.json());
let destinationInteractive = require('./Assets/destinations.json');



// ------------------------------------------------------------------------------------------------
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
    if (!destination.rating) destination.rating = 0;
    if (!destination.count) destination.count = 0;
    const newRating = parseFloat(userRating);
    const newCount = destination.count + 1;
    const newAverageRating = ((destination.rating * destination.count) + newRating) / newCount;
    const roundedAverageRating = parseFloat(newAverageRating.toFixed(2));
    destination.rating = roundedAverageRating;
    destination.count = newCount;
    fs.writeFile('./Assets/destinations.json', JSON.stringify(destinationInteractive, null, 2), (err) => {
        if (err) {
            console.error('Error updating destinations file:', err);
            return res.status(500).json({ error: 'Internal server error occurred' });
        }
        res.status(200).json({
          message: 'Rating updated successfully',
          destination
        });
    });
});
  

module.exports = app;  // Export the app object