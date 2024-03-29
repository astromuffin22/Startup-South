const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
require('dotenv').config();

const app = express();
const port = 4000;

mongoose.connect("mongodb+srv://astromuffin22:astromuffin22@cluster0.1c0kdgj.mongodb.net/case_central", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  lastLogin: { type: Date, default: Date.now },
  token: { type: String, unique: true },
});

const User = mongoose.model('User', userSchema);

let scoresData = [];

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, token: uuid.v4()});

    await user.save();
    res.json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.json({ message: 'Logged in!'});
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'ERROR' });
    }
});

// Beginnings of authenticate endpoint
// Also need to update setting the cookie and clearing the cookie in login.js
app.post('/api/authenticate', async (req, res) => {
    const { token } = req.body;
  
    try {
        // Check if User.findOne can be conigured to check token
      const user = await User.findOne({ token });
    //   If not authenticated, send back a different code and also include user info
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

    //   Send different message if successful to check
      res.json({ message: 'Logged in!'});
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'ERROR' });
    }
});


app.post('/api/addScore', (req, res) => {
    const data = req.body;
    scoresData.push(data);
    res.json({ message: 'Score added successfully!', scores: scoresData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
