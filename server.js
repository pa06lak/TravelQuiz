const app = require('./app');  // Import the app from app.js

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
