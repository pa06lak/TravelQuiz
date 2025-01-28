const app = require('./app'); 
const cors = require('cors');
app.use(cors());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
