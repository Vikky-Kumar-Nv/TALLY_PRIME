const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path

// Insert new group
router.post('/', async (req, res) => {
  try {
    const { name, type, parent } = req.body;
    await db.execute(
      'INSERT INTO ledger_groups (name, type, parent) VALUES (?, ?, ?)',
      [name, type, parent || null]
    );
    res.json({ message: 'Group created successfully' });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ message: 'Failed to create group' });
  }
});

module.exports = router;
