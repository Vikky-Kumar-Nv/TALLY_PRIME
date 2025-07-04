const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Routes
const ledgerGroupRoutes = require('./routes/ledgerGroups');
app.use('/api/ledger-groups', ledgerGroupRoutes);
// Ledger Routes
const ledgerRoutes = require('./routes/ledger');
app.use('/api/ledger', ledgerRoutes);
// Routes for Ledger Groups
const GroupRoutes = require('./routes/group');
app.use('/api/group', GroupRoutes);
// Routes for currency
const currencyRoutes = require('./routes/currency');
app.use('/api/currencies', currencyRoutes);

const budgetRoutes = require('./routes/budgets');
app.use('/api/budgets', budgetRoutes);
// Routes for vouchers
const voucherRoutes = require('./routes/vouchers');
app.use('/api/vouchers', voucherRoutes);

// Routes for sale vouchers
// Import and use Sales Voucher routes
const saleVoucherRoutes = require('./routes/salevoucher');
app.use('/api/sale-vouchers', saleVoucherRoutes);
// Routes for purchase vouchers
const purchaseVoucherRoutes = require('./routes/purchasevoucher');  
app.use('/api/purchase-vouchers', purchaseVoucherRoutes);
const scenarioRoutes = require('./routes/scenarioRoutes');
app.use('/api/scenario', scenarioRoutes);
// Routes for cost centers
const costCenterRoutes = require('./routes/costCenterRoutes');  
app.use('/api/cost-centers', costCenterRoutes);


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbEnegix',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected!');
});
console.log("✅ POST /api/company HIT line 1");


// Routes
app.post('/api/company', (req, res) => {
    console.log("✅ POST /api/company HIT line 2");

  const {
    name,
    financialYear,
    booksBeginningYear,
    address,
    pin,
    phoneNumber,
    email,
    panNumber,
    gstNumber,
    vatNumber, // contains either GST or VAT number
    state,
    country,
    taxType,
    employeeId
  } = req.body;

 
console.log("✅ POST /api/company HIT line 3");

  let gst_number = null;
let vat_number = null;
console.log("✅ POST /api/company HIT line 4");

if (req.body.taxType === 'GST') {
  gst_number = req.body.gstNumber;
} else if (req.body.taxType === 'VAT') {
  vat_number = req.body.vatNumber;
}



  const sql = `INSERT INTO tbCompanies 
    (name, financial_year, books_beginning_year, address, pin, phone_number, email, pan_number, gst_number, vat_number, state, country, tax_type, employee_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name, financialYear, booksBeginningYear, address, pin,
    phoneNumber, email, panNumber, gst_number, vat_number,
    state, country, taxType, employeeId
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ message: 'Error inserting data' });
    }

    res.status(201).json({ message: 'Company added', id: result.insertId });
    console.log("Incoming request body:", req.body);


  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
