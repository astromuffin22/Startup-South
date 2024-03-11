const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('.'));

let users = [];
let scores = [];

app.post('/api/register', (req, res) => {
    const user = req.body;

    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
        existingUser.lastLogin = new Date();
        res.json({ message: 'Registration successful!' });
    } else {
        users.push(user);
        res.json({ message: 'Login successful!' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.cookie('userEmail', user.email, { maxAge: 900000, httpOnly: true });
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/api/addScore', (req, res) => {
    const { playerName, pet } = req.body;

    if (!playerName || !pet) {
        return res.status(400).json({ message: 'Invalid data. Both playerName and pet are required.' });
    }

    scores.push({ playerName, pet });

    res.json({ message: 'Score added successfully!', scores });
});

app.post('/api/dogImage', (req, res) => {
    const { imageUrl } = req.body;

    res.json({ message: 'Dog image URL received successfully!' });
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: '.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
