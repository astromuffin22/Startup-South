const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');
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
const overallCaseCountSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    id: {type: Number, unique: true}
  });

const OverallCaseCount = mongoose.model('OverallCaseCount', overallCaseCountSchema);
async function addCountIfNoneExist(){
    const existingCount = await OverallCaseCount.findOne({id: 1})
    if (!existingCount){
        const count = new OverallCaseCount({count: 0, id: 1})
        count.save();
    }
}
addCountIfNoneExist();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));



app.get('/api/overallCaseCount', async (req, res) => {
    try {
      const countData = await OverallCaseCount.findOne({id: 1});
      res.json({ count: countData.count});
    } catch (error) {
      console.error('Error fetching overall case count:', error);
      res.status(500).json({ message: 'Error fetching overall case count' });
    }
  });

  app.post('/api/updateCaseCount', async (req, res) => {
    const {newCount} = req.body
    try {
    const countData = await OverallCaseCount.findOneAndUpdate({id: 1}, {count: newCount});
    } catch (error) {
      console.error('Error fetching overall case count:', error);
      res.status(500).json({ message: 'Error fetching overall case count' });
    }
  });


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
    res.json({ message: 'Registration successful!', token: user.token });
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

      res.json({ message: 'Logged in!', token: user.token});
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'ERROR' });
    }
});

app.post('/api/authenticate', async (req, res) => {
    const { token } = req.body;
    
    try {
      const user = await User.findOne({ token });
      
      if (!user) {
        return res.status(401).json({ message: 'No user found' });
      }

      res.json({ message: 'User found!', user: user});
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

let server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let connections = [];
const wss = new WebSocketServer({noServer: true});
server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, function done(ws, req) {
        wss.emit('connection', ws, req);
    });
}); 
wss.on('connection', (ws, req) => {
    connections.push(ws)

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'updateScoreboard') {
            scoresData = message.scores;
            updateNotificationList(scoresData);
        } else if (message.type === 'updateCounter') {
            connections.map((conn) => {
                conn.send(JSON.stringify({type: "udpateCaseCount", count: message.caseCount}));
            });
        }
    })

    ws.on('close', (data) => {
        connections = [];
    })
});
