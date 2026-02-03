require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');          
const app = express();
const db = require('./db');


app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());               // better than bodyParser
const PORT = process.env.PORT || 3000; // fallback port

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../Frontend')));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
