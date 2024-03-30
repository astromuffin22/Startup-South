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
//let totalCasesOpened = 1437;
//---------------------------
const overallCaseCountSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
  });

const OverallCaseCount = mongoose.model('OverallCaseCount', overallCaseCountSchema);
//----------------------------

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));


//---------------------------------------------------
app.get('/api/overallCaseCount', async (req, res) => {
    try {
      // Find the overall case count from the database
      const countData = await OverallCaseCount.findOne();
      res.json({ count: countData ? countData.count : 0 });
    } catch (error) {
      console.error('Error fetching overall case count:', error);
      res.status(500).json({ message: 'Error fetching overall case count' });
    }
  });

    function updateOverallCaseCount(count) {
    OverallCaseCount.findOneAndUpdate({}, { count: count }, { upsert: true })
      .then(() => {
        // Broadcast the updated count to all connected clients
        connections.forEach(conn => {
          conn.send(JSON.stringify({ type: "updateOverallCaseCount", count: count }));
        });
      })
      .catch(error => {
        console.error('Error updating overall case count:', error);
      });
  }
  
  if (message.type === 'updateCounter') {
    totalCasesOpened = message.caseCount;
    updateOverallCaseCount(totalCasesOpened);
  }
  
  wss.on('connection', (ws, req) => {
    // Send the current overall case count to the client when it connects
    OverallCaseCount.findOne().then(countData => {
      const count = countData ? countData.count : 0;
      ws.send(JSON.stringify({ type: "updateOverallCaseCount", count: count }));
    }).catch(error => {
      console.error('Error fetching overall case count:', error);
    });
});

//----------------------------------------------------------------

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
        // see if passing in token will work or if User.findOne needs to be configured to accept token as an arg
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

// Create a WebSocket server that listens on the specified path
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
            totalCasesOpened = message.caseCount;
            connections.map((conn) => {
                conn.send(JSON.stringify({type: "udpateCaseCount", count: totalCasesOpened}));
            });
        }
    })

    ws.on('close', (data) => {
        connections = [];
    })
});




//------------


// const mongoose = require('mongoose');

// // Define a schema for the overall case count
// const overallCaseCountSchema = new mongoose.Schema({
//   count: { type: Number, default: 0 }
// });

// // Create a model for the overall case count
// const OverallCaseCount = mongoose.model('OverallCaseCount', overallCaseCountSchema);

// // Add a route to get the overall case count
// app.get('/api/overallCaseCount', async (req, res) => {
//   try {
//     // Find the overall case count from the database
//     const countData = await OverallCaseCount.findOne();
//     res.json({ count: countData ? countData.count : 0 });
//   } catch (error) {
//     console.error('Error fetching overall case count:', error);
//     res.status(500).json({ message: 'Error fetching overall case count' });
//   }
// });

// // Update the overall case count in the database and broadcast it to all clients
// function updateOverallCaseCount(count) {
//   OverallCaseCount.findOneAndUpdate({}, { count: count }, { upsert: true })
//     .then(() => {
//       // Broadcast the updated count to all connected clients
//       connections.forEach(conn => {
//         conn.send(JSON.stringify({ type: "updateOverallCaseCount", count: count }));
//       });
//     })
//     .catch(error => {
//       console.error('Error updating overall case count:', error);
//     });
// }

// // Modify the 'updateCounter' event handler to update the overall case count
// if (message.type === 'updateCounter') {
//   totalCasesOpened = message.caseCount;
//   updateOverallCaseCount(totalCasesOpened);
// }

// // WebSocket connection event handler
// wss.on('connection', (ws, req) => {
//   // Send the current overall case count to the client when it connects
//   OverallCaseCount.findOne().then(countData => {
//     const count = countData ? countData.count : 0;
//     ws.send(JSON.stringify({ type: "updateOverallCaseCount", count: count }));
//   }).catch(error => {
//     console.error('Error fetching overall case count:', error);
//   });


//------------



// function broadcastCounter() {
//     const counterData = { type: 'counter', totalCasesOpened };
//     wss.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(counterData));
//       }
//     });
//   }

// wss.on('connection', function connection(ws) {
//     ws.on('message', function incoming(message) {
//       const data = JSON.parse(message);
//       switch(data.type) {
//         case 'spin':
//           console.log('Spin data received:', data);
//           break;
//         case 'counter':
//           totalCasesOpened = data.totalCasesOpened;
//           console.log('Counter data received:', data);
//           broadcastCounter();
//           break;
//         default:
//           console.log('Unknown message type:', data.type);
//       }
//     });
//   });