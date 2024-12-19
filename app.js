const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the 'Client' folder
app.use(express.static(path.join(__dirname, 'Client')));

// Serve static files from the 'Images' folder
app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.get('/api/random-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'Assets', 'destinations.json'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data file:', err);  // Log the error
        return res.status(500).json({ error: 'Error reading data file' });  // Send a JSON error response
      }
  
      try {
        const jsonData = JSON.parse(data);  // Parse the JSON data
  
        // Get 2-3 random elements from the jsonData
        const randomData = getRandomItems(jsonData, 3);
        
        res.json(randomData);  // Send the random data to the frontend
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);  // Log any JSON parsing errors
        return res.status(500).json({ error: 'Error parsing data file' });  // Send a JSON error response
      }
    });
  });
  
  // Function to get random items from an array
  function getRandomItems(arr, num) {
    const shuffled = arr.sort(() => 0.5 - Math.random());  // Shuffle the array
    return shuffled.slice(0, num);  // Return the first 'num' items
  }
module.exports = app;