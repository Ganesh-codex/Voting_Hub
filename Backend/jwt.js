const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
        // Verify the JWT token
        const secret = process.env.JWT_SECRET || 'dev_secret';
        const decoded = jwt.verify(token, secret);

        // Attach user information to the request object
        req.user = decoded
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}


// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    const secret = process.env.JWT_SECRET || 'dev_secret';
    return jwt.sign(userData, secret, {expiresIn: '30d'});
}

module.exports = {jwtAuthMiddleware, generateToken};