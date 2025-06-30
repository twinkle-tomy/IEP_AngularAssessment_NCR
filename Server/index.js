
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow Angular to connect
app.use(express.json()); // Parse JSON bodies

// Login route
app.post('/api/login', (req, res) => {
 const filePath = path.join(__dirname, 'Data', 'users.json');
  const { username, password } = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(0).send({ error: 'User data not found' });

    const users = JSON.parse(data);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) 
    {
      return res.json({
      success: true,
      email: user.email,
      fullName: user.fullName
    });
    } 
    else 
    {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  });
});

// Get tabular data
app.get('/api/categories', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'Categories.json');

  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(500).send({ error: 'Could not load Categories data' });
    }

    const categories = JSON.parse(jsonData);
    res.send(categories);
  });
});

// Read Advance filter
app.get('/api/advanceFilter', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'AdvanceFilter.json');
  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(0).json({ error: 'Failed to load advance filter data' });
    }
    const parsed = JSON.parse(jsonData);
    res.json(parsed.data);
  });
});

// Read Project Contracts
app.get('/api/projectContracts', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'ProjectContracts.json');
  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(0).json({ error: 'Failed to load Contracts' });
    }
    const parsed = JSON.parse(jsonData);
    res.json(parsed.data);
  });
});

// Read NCR Tabular columns
app.get('/api/ncrColumns', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'NCRTabularColumns.json');
  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(0).json({ error: 'Failed to load NCR columns.' });
    }
    const parsed = JSON.parse(jsonData);
    res.json(parsed.data);
  });
});

// POST API — for chart data
app.post('/api/ncrChart', (req, res) => {
  const { viewType, scope } = req.body;

  if (viewType === 'Chart' && scope === 'Individual') {
    const filePath = path.join(__dirname, 'Data', 'NCRChartIndividual.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(file);
    res.json(parsed.data);
  }
  else if (viewType === 'Chart' && scope === 'Project') {
    const filePath = path.join(__dirname, 'Data', 'NCRChartProject.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(file);
    res.json(parsed.data);
  }  
  else {
    res.status(400).json({ message: 'Unsupported viewType or scope' });
  }
});

// POST API — for NCR Tabular data
app.post('/api/ncrTabular', (req, res) => {
  const { viewType, scope } = req.body;

  if (viewType === 'Tabular' && scope === 'Individual') {
    const filePath = path.join(__dirname, 'Data', 'NCRTabIndividual.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(file);
    res.json(parsed.data);
  }
  else if (viewType === 'Tabular' && scope === 'Project') {
    const filePath = path.join(__dirname, 'Data', 'NCRTabProject.json');
    const file = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(file);
    res.json(parsed.data);
  }  
  else {
    res.status(400).json({ message: 'Unsupported viewType or scope' });
  }
});

// Read All Contracts columns
app.get('/api/allContractsColumns', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'AllContractsColumns.json');
  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(0).json({ error: 'Failed to load All Contracts columns.' });
    }
    const parsed = JSON.parse(jsonData);
    res.json(parsed.data);
  });
});

// Read All Contracts Data
app.get('/api/allContractsData', (req, res) => {
  const filePath = path.join(__dirname, 'Data', 'AllContractsData.json');
  fs.readFile(filePath, 'utf8', (err, jsonData) => {
    if (err) {
      return res.status(0).json({ error: 'Failed to read All Contracts Data.' });
    }
    const parsed = JSON.parse(jsonData);
    res.json(parsed.data.Item);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});