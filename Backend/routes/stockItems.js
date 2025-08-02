const express = require('express');
const router = express.Router();
const db = require('../db'); // your mysql2 pool connection

// GET all stock items with optional joins
router.get('/', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        s.id,
        s.name,
        s.stockGroupId,
        sg.name AS stockGroupName,
        s.unit,
        u.name AS unitName,
        s.openingBalance,
        s.hsnCode,
        s.gstRate,
        s.taxType
      FROM stock_items s
      LEFT JOIN stock_groups sg ON s.stockGroupId = sg.id
      LEFT JOIN stock_units u ON s.unit = u.id
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("🔥 Error fetching stock items:", err);
    res.status(500).json({ success: false, message: 'Error fetching stock items' });
  } finally {
    connection.release();
  }
});



router.post('/', async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      name, stockGroupId, unit, openingBalance, openingValue,
      hsnCode, gstRate, taxType, standardPurchaseRate, standardSaleRate,
      enableBatchTracking, allowNegativeStock, maintainInPieces, secondaryUnit,
      godownAllocations = [],
      batches = [] // Expects array of batch objects with batchNumber, expiryDate, manufacturingDate, quantity, costPrice, mrp
    } = req.body;

    // Insert stock item without batch columns
    const values = [
      name, stockGroupId ?? null, unit ?? null,
      openingBalance ?? 0, openingValue ?? 0, hsnCode ?? null, gstRate ?? 0,
      taxType ?? 'Taxable', standardPurchaseRate ?? 0, standardSaleRate ?? 0,
      enableBatchTracking ? 1 : 0, allowNegativeStock ? 1 : 0,
      maintainInPieces ? 1 : 0, secondaryUnit ?? null

    ];

    const [result] = await connection.execute(`
      INSERT INTO stock_items (
        name, stockGroupId, unit, openingBalance, openingValue,
        hsnCode, gstRate, taxType, standardPurchaseRate, standardSaleRate,
        enableBatchTracking, allowNegativeStock, maintainInPieces, secondaryUnit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, values);

    const stockItemId = result.insertId;

    // Insert batches separately to stock_item_batches
    for (const batch of batches) {
      await connection.execute(`
        INSERT INTO stock_item_batches (
          batchName, stockItemId, batchNumber, manufacturingDate, expiryDate, quantity, availableQuantity, costPrice, mrp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        batch.batchName || null,
        stockItemId,
        batch.batchName,
        batch.batchManufacturingDate || null,
        batch.batchExpiryDate || null,
        batch.quantity || 0,
        batch.availableQuantity || batch.quantity || 0,
        batch.costPrice || 0,
        batch.mrp || 0
      ]);
    }

    // Insert godown allocations if any
    for (const alloc of godownAllocations) {
      await connection.execute(`
        INSERT INTO godown_allocations (stockItemId, godownId, quantity, value)
        VALUES (?, ?, ?, ?)
      `, [
        stockItemId,
        alloc.godownId ?? null,
        alloc.quantity ?? 0,
        alloc.value ?? 0
      ]);
    }

    await connection.commit();

    res.json({ success: true, message: 'Stock item and batches saved successfully' });

  } catch (err) {
    console.error("🔥 Error saving stock item:", err);
    await connection.rollback();
    res.status(500).json({ success: false, message: 'Error saving stock item' });
  } finally {
    connection.release();
  }
});


module.exports = router;
