const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

let users = [];
let scores = [];

app.post('/api/register', (req, res) => {
    const user = req.body;

    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
        res.status(400).json({ message: 'User with this email already exists' });
    } else {
        users.push(user);
        res.json({ message: 'Registration successful!' });
    }
});

app.post('/api/addScore', (req, res) => {
    const { playerName, pet } = req.body;

    if (!playerName || !pet) {
        return res.status(400).json({ message: 'Invalid data. Both playerName and pet are required.' });
    }

    scores.push({ playerName, pet });

    res.json({ message: 'Score added successfully!' });
});

app.post('/api/dogImage', (req, res) => {
    const { imageUrl } = req.body;

    res.json({ message: 'Dog image URL received successfully!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
