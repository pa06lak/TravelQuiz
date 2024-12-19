const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the 'Client' folder
app.use(express.static(path.join(__dirname, 'Client')));

// Serve static files from the 'Images' folder
app.use('/Images', express.static(path.join(__dirname, 'Images')));


module.exports = app;