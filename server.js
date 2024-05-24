const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('netflix-clone'));
app.use(bodyParser.json());

// Mock user database
const users = [];

// Secret key for JWT
const SECRET_KEY = 'your_secret_key';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'netflix-clone', 'index.html'));
});

app.get('/api/movies', (req, res) => {
    const movies = [
        { title: 'Movie 1', description: 'Description of Movie 1', image: 'image1.jpg' },
        { title: 'Movie 2', description: 'Description of Movie 2', image: 'image2.jpg' },
        { title: 'Movie 3', description: 'Description of Movie 3', image: 'image3.jpg' }
    ];
    res.json(movies);
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { username, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

app.get('/api/profile', verifyToken, (req, res) => {
    res.json({ username: req.user.username });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
