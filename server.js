const app = require('./app');  // Import the app from app.js
const cors = require('cors');
app.use(cors());
// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://192.168.1.246:3000');
});
