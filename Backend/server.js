const express = require('express')
const path = require('path');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Serve frontend static files from /client
// app.use(express.static(path.join(__dirname, 'client')));

// // Fallback to index.html for client-side routing (keep after API routes)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'index.html'));
// });
// Serve frontend static files from Frontend folder
app.use(express.static(path.join(__dirname, '../Frontend')));

// Fallback to index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});



app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})