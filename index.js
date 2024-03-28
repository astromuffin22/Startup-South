const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
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
  lastLogin: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

let scoresData = [];
let totalCasesOpened = 1437;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected to WebSocket');

  ws.send(JSON.stringify({ totalCasesOpened }));

  ws.on('message', message => {
    console.log('Received message from client:', message);
  });
});

function updateScoreboard(data) {
  scoresData.push(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ scoresData }));
    }
  });
}

function updateTotalCasesOpened() {
  totalCasesOpened++;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ totalCasesOpened }));
    }
  });
}

app.post('/api/addScore', (req, res) => {
  const data = req.body;
  updateScoreboard(data);
  updateTotalCasesOpened();
  res.json({ message: 'Score added successfully!', scores: scoresData });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  