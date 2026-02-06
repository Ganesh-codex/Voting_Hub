require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');          
const app = express();
const db = require('./db');


const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});


app.use((req, res, next) => {
    req.io = io;
    next();
});




app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());               
const PORT = process.env.PORT || 3000; // fallback port

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send current client count
    io.emit('clientCount', io.engine.clientsCount);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        io.emit('clientCount', io.engine.clientsCount);
    });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../Frontend')));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
