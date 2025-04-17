
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;


app.use(bodyParser.json());


const JWT_SECRET = 'your-secret-key'; 


const users = [
  { id: 1, username: 'user1', password: 'pass123' },
  { id: 2, username: 'user2', password: 'pass456' }
];

const companies = [
  { id: 1, name: 'Acme Corp', matchScore: 85, status: 'Prospect' },
  { id: 2, name: 'Globex', matchScore: 92, status: 'Prospect' },
  { id: 3, name: 'Initech', matchScore: 67, status: 'Not Interested' },
  { id: 4, name: 'Umbrella Corp', matchScore: 78, status: 'Target' }
];


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '2h'
  });
  
  res.json({
    message: 'Login successful',
    token
  });
});


app.get('/accounts', authenticateToken, (req, res) => {
  res.json({
    accounts: companies
  });
});


app.post('/accounts/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const companyIndex = companies.findIndex(c => c.id === parseInt(id));
  
  if (companyIndex === -1) {
    return res.status(404).json({ error: 'Company not found' });
  }
  

  const validStatuses = ['Prospect', 'Target', 'Not Interested'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  

  companies[companyIndex].status = status;
  
  res.json({
    message: 'Status updated successfully',
    company: companies[companyIndex]
  });
});


app.listen(port, () => {
  console.log(`Target Account Matching API running on port ${port}`);
});