// Load enviroment variables
require('dotenv').config();

// Imports
const telegram = require('./utility/telegram');
const { join } = require('path');

// HTTP server setup
const app = (require('express'))();

app.get('/', (req, res) => res.sendStatus(200));

app.get('/img', (req, res) => res.sendFile(join(__dirname, "./utility/image.jpg")))

app.listen(process.env.PORT || 3001);

telegram()