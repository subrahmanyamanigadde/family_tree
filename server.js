const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for family members
let familyMembers = [
  {
    id: uuidv4(),
    name: 'John Doe',
    phone: '+1-555-0001',
    relationship: 'Self',
    parentId: null,
    spouse: null,
    imageUrl: null
  },
  {
    id: uuidv4(),
    name: 'Jane Doe',
    phone: '+1-555-0002',
    relationship: 'Spouse',
    parentId: null,
    spouse: familyMembers[0]?.id || null,
    imageUrl: null
  }
];

// Routes

// Get all family members
app.get('/api/members', (req, res) => {
  res.json(familyMembers);
});

// Get a specific family member
app.get('/api/members/:id', (req, res) => {
  const member = familyMembers.find(m => m.id === req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  res.json(member);
});

// Add a new family member
app.post('/api/members', (req, res) => {
  const { name, phone, relationship, parentId, spouse } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const newMember = {
    id: uuidv4(),
    name,
    phone,
    relationship: relationship || 'Family Member',
    parentId: parentId || null,
    spouse: spouse || null,
    imageUrl: null
  };

  familyMembers.push(newMember);
  res.status(201).json(newMember);
});

// Update a family member
app.put('/api/members/:id', (req, res) => {
  const { name, phone, relationship, parentId, spouse } = req.body;
  const member = familyMembers.find(m => m.id === req.params.id);
  
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  if (name) member.name = name;
  if (phone) member.phone = phone;
  if (relationship) member.relationship = relationship;
  if (parentId !== undefined) member.parentId = parentId;
  if (spouse !== undefined) member.spouse = spouse;

  res.json(member);
});

// Delete a family member
app.delete('/api/members/:id', (req, res) => {
  const index = familyMembers.findIndex(m => m.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const deleted = familyMembers.splice(index, 1);
  res.json(deleted[0]);
});

// Get family tree structure (parents, children, spouse)
app.get('/api/tree/:id', (req, res) => {
  const member = familyMembers.find(m => m.id === req.params.id);
  
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  const treeStructure = {
    member: member,
    parent: member.parentId ? familyMembers.find(m => m.id === member.parentId) : null,
    children: familyMembers.filter(m => m.parentId === member.id),
    spouse: member.spouse ? familyMembers.find(m => m.id === member.spouse) : null
  };

  res.json(treeStructure);
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Family Tree Server running on http://localhost:${PORT}`);
});
