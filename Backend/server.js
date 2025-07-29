// ✅ server.js (Updated without express-session)
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Routes
const ledgerGroupRoutes = require('./routes/ledgerGroups');
app.use('/api/ledger-groups', ledgerGroupRoutes);

const ledgerRoutes = require('./routes/ledger');
app.use('/api/ledger', ledgerRoutes);

const GroupRoutes = require('./routes/group');
app.use('/api/group', GroupRoutes);

const currencyRoutes = require('./routes/currency');
app.use('/api/currencies', currencyRoutes);

const budgetRoutes = require('./routes/budgets');
app.use('/api/budgets', budgetRoutes);

const voucherRoutes = require('./routes/vouchers');
app.use('/api/vouchers', voucherRoutes);

const saleVoucherRoutes = require('./routes/salevoucher');
app.use('/api/sale-vouchers', saleVoucherRoutes);

const purchaseVoucherRoutes = require('./routes/purchasevoucher');  
app.use('/api/purchase-vouchers', purchaseVoucherRoutes);

const scenarioRoutes = require('./routes/scenarioRoutes');
app.use('/api/scenario', scenarioRoutes);

const costCenterRoutes = require('./routes/costCenterRoutes');
app.use('/api/cost-centers', costCenterRoutes);

const stockCategoriesRoutes = require('./routes/stockCategories');
app.use('/api/stock-categories', stockCategoriesRoutes);

const stockUnitsRoutes = require('./routes/stockUnits');  
app.use('/api/stock-units', stockUnitsRoutes);

const stockGroupRoutes = require('./routes/stockGroupRoutes');    
app.use('/api/stock-groups', stockGroupRoutes);

const godownRoutes = require('./routes/godownRoutes');
app.use('/api/godowns', godownRoutes);

const stockItemRoutes = require('./routes/stockItems');
app.use('/api/stock-items', stockItemRoutes);

const signupRoute = require('./routes/SignUp');
app.use('/api/SignUp', signupRoute);

const loginRoute = require('./routes/login');
app.use('/api/login', loginRoute);

const companyRoutes = require('./routes/company');
app.use('/api/company', companyRoutes);

const adminloginRoute = require('./routes/adminlogin');
app.use('/api/admin/login', adminloginRoute);

const ledgerDropdown = require("./routes/ledgerDropdown");
app.use("/api/ledger-dropdown", ledgerDropdown);

const salesOrders = require('./routes/salesOrders');
app.use('/api/sales-orders', salesOrders);

const DebitNoteVoucher = require('./routes/DebitNoteVoucher');
app.use('/api/DebitNoteVoucher', DebitNoteVoucher);

const CreditNotevoucher = require('./routes/CreditNotevoucher');
app.use('/api/CreditNotevoucher', CreditNotevoucher);

const StockJournal = require('./routes/StockJournal');
app.use('/api/StockJournal', StockJournal);

const DeliveryItem = require('./routes/DeliveryItem');
app.use('/api/DeliveryItem', DeliveryItem);

const DayBookCards = require('./routes/DayBookCards');
app.use('/api/DayBookCards', DayBookCards);

const daybookTable = require('./routes/daybookTable');
app.use('/api/daybookTable', daybookTable);

const gstRoutes = require("./routes/gst");
app.use("/api/gst", gstRoutes);

const gstr3bRoutes = require("./routes/gstr3b");
app.use("/api/gstr3b", gstr3bRoutes);

const gstRatesRoutes = require("./routes/gstRates");
app.use("/api/gst-rates", gstRatesRoutes);


const tds24qRoutes = require("./routes/tds_24q");
app.use("/api/tds24q", tds24qRoutes);
const tds26qRouter = require("./routes/tds_26q");
app.use(tds26qRouter);



// ✅ MySQL Connection
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

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
