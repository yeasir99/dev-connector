const express = require("express");
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//init Midleware
app.use(express.json({
    extended: false
}))

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));