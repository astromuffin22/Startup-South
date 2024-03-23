const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 4000;

const uri = "mongodb+srv://astromuffin22:astromuffin22@cluster0.1c0kdgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update with your MongoDB URI

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then(() => {
  console.log('Connected to MongoDB');

  const db = client.db('case_central');
  const usersCollection = db.collection('users');

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.static('public'));

  app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
      console.log('Received registration request:', req.body);

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await usersCollection.insertOne({ name, email, password: hashedPassword });
      console.log('User registered successfully:', { name, email });
      res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log('Received login request:', req.body);

      const user = await usersCollection.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      console.log('Login successful for user:', email);
      res.json({ message: 'Login successful!', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Add other routes as needed

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
