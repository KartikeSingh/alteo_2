// Load enviroment variables
require('dotenv').config();

// Imports
const telegram = require('./utility/telegram');

// HTTP server setup
const app = (require('express'))();

app.get('/', (req, res) => res.sendStatus(200));

app.listen(process.env.PORT || 3001);

telegram()