const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandle = require('./middleware/error');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//init Midleware
app.use(express.json());

// sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent xss attacks
app.use(xss());

// Rate limiting
const limitter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limitter);

// prevent http param polution
app.use(hpp());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));
// handle error
app.use(errorHandle);

// Serve static assets in production

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
