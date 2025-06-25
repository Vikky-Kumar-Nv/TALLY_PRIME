const express = require('express');
const router = express.Router();
const db = require('../db'); // your db connection
const app = express();
const cors = require("cors");
app.use(cors());
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
  SELECT 
    l.id, 
    l.name, 
    l.group_id AS groupId, 
    l.opening_balance AS openingBalance, 
    l.balance_type AS balanceType,
    l.address, 
    l.email, 
    l.phone, 
    l.gst_number AS gstNumber, 
    l.pan_number AS panNumber,
    g.name AS groupName
  FROM ledgers l
  LEFT JOIN ledger_groups g ON l.group_id = g.id
`);


    res.json(rows);
  }  catch (err) {
  console.error("Error fetching ledgers:", err);
  res.status(500).json({ message: "Failed to fetch ledgers" });
}
});

// Create new ledger
router.post('/', async (req, res) => {
  const {
    name,
    groupId,
    openingBalance,
    balanceType,
    address,
    email,
    phone,
    gstNumber,
    panNumber
  } = req.body;

  try {
    const sql = `INSERT INTO ledgers 
      (name, group_id, opening_balance, balance_type, address, email, phone, gst_number, pan_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.execute(sql, [
      name,
      groupId,
      openingBalance,
      balanceType,
      address,
      email,
      phone,
      gstNumber,
      panNumber
    ]);

    res.status(201).json({ message: 'Ledger created successfully!' });
  } catch (err) {
    console.error('Ledger insert error:', err);
    res.status(500).json({ message: 'Failed to create ledger' });
  }
});

module.exports = router;
