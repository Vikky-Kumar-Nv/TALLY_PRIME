const express = require('express');
const router = express.Router();
const db = require('../db'); // your DB instance

router.post('/', async (req, res) => {
  const { type, date, number, narration, entries } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [voucherResult] = await conn.execute(
      `INSERT INTO voucher_main (voucher_type, voucher_number, date, narration) VALUES (?, ?, ?, ?)`,
      [type, number || null, date, narration]
    );

    const voucherId = voucherResult.insertId;

    const entryValues = entries.map(entry => [
      voucherId,
      entry.ledgerId,
      entry.amount,
      entry.type
    ]);

    await conn.query(
      `INSERT INTO voucher_entries (voucher_id, ledger_id, amount, entry_type) VALUES ?`,
      [entryValues]
    );

    await conn.commit();
    conn.release();

    res.status(200).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} voucher saved successfully!` });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error(err);
    res.status(500).json({ message: 'Failed to save voucher', error: err });
  }
});

module.exports = router;
