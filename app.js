// This is my app written in nodejs to provide JSON through rest API
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'client')));
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
    )
    travelDestinations;
    res.json(filteredDestinations);
    if (ids.some(id => isNaN(id))) {
      return res.status(400).json({ error: "Invalid 'ids' query parameter" });
  }
  });
//--------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------------------------
// Build the destination list for the specified options selected by the user
  app.get('/api/destinationsRead', (req, res) => {
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
app.use(express.json());
let destinationInteractive = require('./Assets/destinations.json');





// ------------------------------------------------------------------------------------------------
// Endpoint to update the rating of a destination
app.post('/api/update-rating', (req, res) => {
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

// --------------------------------------------------------------------------------------------------------------------
// Get request for the question.json file to get the destinations
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'Assets/questions.json'), 'utf-8'));
app.get('/api/questions', (req, res) => {
  try {
  res.status(200).json(questions);
} catch (err) {
  res.status(500).json({ error: 'Error reading or parsing questions file' });
}
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// This would update the count of each option in the question.json file. 
// I have implemented this because I can use it for future research 
app.post('/api/update-count', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }
  const filePath = './Assets/questions.json';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading file' });
    }
    let jsonData;
    try {
      jsonData = JSON.parse(data); 
    } catch (parseErr) {
      return res.status(500).json({ message: 'Error parsing JSON' });
    }
    const question = jsonData.find(q => q.id === id);
    if (question) {
      question.count = (question.count || 0) + 1; 
    } else {
      return res.status(404).json({ message: 'Question not found' });
    }
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', writeErr => {
      if (writeErr) {
        return res.status(500).json({ message: 'Error writing file' });
      }
      res.status(200).json({ message: 'Count updated successfully', question });
    });
  });
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Get the count and option name
app.get('/api/get-option-info', (req, res) => {
  const { id } = req.query;

  const question = questions.find(q => q.id === id);

  if (question) {
    res.status(200).json({
      message: `Option: ${question.question}, Count: ${question.count}`
    });
  } else {
    res.status(404).json({ message: 'Option not found' });
  }
});

module.exports = app;  // Export the app object
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------