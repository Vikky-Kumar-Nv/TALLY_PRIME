const express = require('express');
const router = express.Router();
const pool = require('../db'); // your mysql2 connection pool

// Helper function to calculate days difference between two dates
function daysBetween(date1, date2) {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

router.get('/api/ageing-analysis', async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      stockItemId,
      stockGroupId,
      godownId,
      batchId,
      basis = 'Quantity',
      showProfit = false,
    } = req.query;

    if (!toDate) {
      return res.status(400).json({ error: "'toDate' is required" });
    }

    // Build query filters for SQL
    const filters = [];
    const params = [];

    filters.push('transaction_date <= ?');
    params.push(toDate);

    if (stockItemId) {
      filters.push('item_id = ?');
      params.push(stockItemId);
    }

    if (stockGroupId) {
      // Need to join with items table to filter by group (implement if needed)
      // For now, assuming you can filter frontend-side or enhance later
    }

    if (godownId) {
      filters.push('godown_id = ?');
      params.push(godownId);
    }

    if (batchId) {
      filters.push('batch_number = ?');
      params.push(batchId);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    // Fetch distinct item details with transaction batches
    const sql = `
      SELECT 
        item_id,
        item_name,
        batch_number,
        expiry_date,
        transaction_date,
        quantity,
        remaining_quantity,
        rate
      FROM fifo_stock_transactions
      ${whereClause}
      ORDER BY item_id, transaction_date ASC
    `;

    const [rows] = await pool.query(sql, params);

    // Group by item and compute ageing buckets in-memory
    const today = new Date(toDate);
    const ageingBuckets = [
      { label: '0-30 Days', from: 0, to: 30 },
      { label: '31-60 Days', from: 31, to: 60 },
      { label: '61-90 Days', from: 61, to: 90 },
      { label: '91-180 Days', from: 91, to: 180 },
      { label: 'Above 180 Days', from: 181, to: Infinity },
    ];

    const result = {};

    for (const row of rows) {
      if (!result[row.item_id]) {
        result[row.item_id] = {
          item: {
            id: row.item_id,
            name: row.item_name,
            // You can add more from items table if required
          },
          ageing: ageingBuckets.map(b => ({ label: b.label, qty: 0, value: 0 })),
          totalQty: 0,
          totalValue: 0,
        };
      }

      const ageDays = daysBetween(new Date(row.transaction_date), today);

      const bucket = ageingBuckets.find(b => ageDays >= b.from && ageDays <= b.to);
      if (bucket) {
        const index = ageingBuckets.indexOf(bucket);
        const qty = +row.remaining_quantity;
        const val = basis === 'cost' ? qty * row.rate : qty * row.rate; // modify if using sale rate

        result[row.item_id].ageing[index].qty += qty;
        result[row.item_id].ageing[index].value += val;
        result[row.item_id].totalQty += qty;
        result[row.item_id].totalValue += val;
      }
    }

    res.json(Object.values(result));
  } catch (err) {
    console.error('Error fetching ageing analysis:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
