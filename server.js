const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the 'Client' folder
app.use(express.static(path.join(__dirname, 'Client')));

// Serve static files from the 'Images' folder
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// API endpoint to fetch quiz data from JSON
// app.get('/api/quiz-data', (req, res) => {
//   fs.readFile(path.join(__dirname, 'Assets/destinations.json'), 'utf8', (err, data) => {
//     if (err) {
//       res.status(500).send('Error reading data file');
//     } else {
//       res.json(JSON.parse(data));
//     }
//   });
// });
app.get('/api/quiz-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'Assets', 'destinations.json'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading data file');
      } else {
        res.json(JSON.parse(data));  // Send JSON data to the frontend
      }
    });
  });
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
