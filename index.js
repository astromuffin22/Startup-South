const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Change as needed

app.use(bodyParser.json());

// Serve up your frontend code using Express static middleware
app.use(express.static('public'));

// Placeholder for user data (in-memory storage, not suitable for production)
let users = [];
let scores = [];

// Provide service endpoints
app.post('/api/register', (req, res) => {
    const user = req.body;
    
    // Check if the email already exists (simple validation, replace with a database check)
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

    // Placeholder logic for adding scores to an in-memory array
    // Replace this with your actual logic for handling scores (e.g., store in a database)
    scores.push({ playerName, pet });
    
    res.json({ message: 'Score added successfully!' });
});

app.post('/api/dogImage', (req, res) => {
    const { imageUrl } = req.body;

    // Placeholder logic for handling dog image URL
    // Replace this with your actual logic for processing the image URL
    res.json({ message: 'Dog image URL received successfully!' });
});

app.get('/api/getScores', (req, res) => {
    // Placeholder logic for getting scores
    // Replace this with your actual logic for retrieving scores (e.g., from a database)
    res.json(scores);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
