import  { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import CompanyForm from './components/company/CompanyForm';

// // Masters Components
import MastersIndex from './components/masters/MastersIndex';
import LedgerList from './components/masters/ledger/LedgerList';
import LedgerForm from './components/masters/ledger/LedgerForm';
import GroupList from './components/masters/group/GroupList';
import GroupForm from './components/masters/group/GroupForm';
import BudgetList from './components/masters/budget/BudgetList';
import BudgetForm from './components/masters/budget/BudgetForm';
import CurrencyList from './components/masters/currency/CurrencyList';
import CurrencyForm from './components/masters/currency/CurrencyForm';
import CostCenterList from './components/masters/costcenter/CostCenterList';
import CostCenterForm from './components/masters/costcenter/CostCnterForm';
import StockCategoryList from './components/masters/stock/StockCategoryList';
import StockCategoryForm from './components/masters/stock/StockCategoryForm';
import StockItemList from './components/masters/stock/StockItemList';
import StockItemForm from './components/masters/stock/StockItemForm';
import StockGroupList from './components/masters/stock/StockGroupList';
import StockGroupForm from './components/masters/stock/StockGroupForm';
import UnitList from './components/masters/unit/UnitList';
import UnitForm from './components/masters/unit/UnitForm';
import GodownList from './components/masters/godown/GodownList';
import GodownForm from './components/masters/godown/GodownForm';




// // Vouchers Components
import VouchersIndex from './components/vouchers/VouchersIndex';
import PaymentVoucher from './components/vouchers/payment/PaymentVouchers';
import ContraVoucher from './components/vouchers/Contra/ContraVoucher';
import CreditNoteVoucher from './components/vouchers/creditnote/CreditNoteVoucher';
import DebitNoteVoucher from './components/vouchers/debitnote/DebitNoteVoucher';
import DeliveryNoteVoucher from './components/vouchers/deliverynote/DeliveryNoteVoucher';
import JournalVoucher from './components/vouchers/journal/JournalVoucher';
import SalesVoucher from './components/vouchers/sales/SalesVoucher';
import PurchaseVoucher from './components/vouchers/purches/PurcheseVoucher';
import ReceiptVoucher from './components/vouchers/receipt/ReceiptVoucher';


// // Reports Components
import ReportsIndex from './components/reports/ReportsIndex';
import TrialBalance from './components/reports/TrialBalance';

// Other Modules
import AccountingModule from './components/modules/AccountingModule';
import InventoryModule from './components/modules/InventoryModule';
import GSTModule from './components/modules/GSTModul';
import TDSModule from './components/modules/TDSModule';
import AuditModule from './components/modules/AuditModule';
import ConfigModule from './components/modules/ConfigModule';



function App() {
  // Add keyboard shortcut listener for Alt+F1 for company selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+F1 for company selection
      if (e.altKey && e.key === 'F1') {
        e.preventDefault();
        window.location.href = '/company';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="company" element={<CompanyForm />} />
            
            {/* Masters Routes */}
            <Route path="masters" element={<MastersIndex />} />
            <Route path="masters/ledger" element={<LedgerList />} />
            <Route path="masters/ledger/create" element={<LedgerForm />} />
            <Route path="masters/ledger/edit/:id" element={<LedgerForm />} />
            <Route path="masters/group" element={<GroupList />} />
            <Route path="masters/group/create" element={<GroupForm />} />
            <Route path="masters/group/edit/:id" element={<GroupForm />} />
            <Route path="masters/budgets" element={<BudgetList />} />
            <Route path="masters/budget/create" element={<BudgetForm />} />
            <Route path="masters/budget/edit/:id" element={<BudgetForm />} />
            <Route path="masters/currency" element={<CurrencyList />} />
            <Route path="masters/currency/create" element={<CurrencyForm />} />
            <Route path="masters/currency/edit/:id" element={<CurrencyForm />} />
            <Route path="masters/cost-centers" element={<CostCenterList />} />
            <Route path="masters/cost-center/create" element={<CostCenterForm />} />
            <Route path="masters/cost-center/edit/:id" element={<CostCenterForm />} />
            <Route path="masters/stock-categories" element={<StockCategoryList />} />
            <Route path="masters/stock-category/create" element={<StockCategoryForm />} />
            <Route path="masters/stock-category/edit/:id" element={<StockCategoryForm />} />
            <Route path="masters/stock-item" element={<StockItemList />} />
            <Route path="masters/stock-item/create" element={<StockItemForm />} />
            <Route path="masters/stock-item/edit/:id" element={<StockItemForm />} />
            <Route path="masters/stock-group" element={<StockGroupList />} />
            <Route path="masters/stock-group/create" element={<StockGroupForm />} />
            <Route path="masters/stock-group/edit/:id" element={<StockGroupForm />} />
            <Route path="masters/units" element={<UnitList />} />
            <Route path="masters/unit/create" element={<UnitForm />} />
            <Route path="masters/unit/edit/:id" element={<UnitForm />} />
             <Route path="masters/godowns" element={<GodownList />} />
            <Route path="masters/godown/create" element={<GodownForm />} />
            <Route path="masters/godown/edit/:id" element={<GodownForm />} />
            
            {/* Vouchers Routes */}
            <Route path="vouchers" element={<VouchersIndex />} />
            <Route path="vouchers/payment/create" element={<PaymentVoucher />} />
            <Route path="vouchers/receipt/create" element={<ReceiptVoucher />} />
            <Route path="vouchers/contra/create" element={<ContraVoucher />} />
            <Route path="vouchers/credit-note/create" element={<CreditNoteVoucher />} />
            <Route path="vouchers/debit-note/create" element={<DebitNoteVoucher />} />
            <Route path="vouchers/delivery-note/create" element={<DeliveryNoteVoucher />} />
            <Route path="vouchers/journal/create" element={<JournalVoucher />} />
            <Route path="vouchers/purchase/create" element={<PurchaseVoucher />} />
            <Route path="vouchers/sales/create" element={<SalesVoucher />} />
            
            {/* Reports Routes */}
            <Route path="reports" element={<ReportsIndex />} />
            <Route path="reports/trial-balance" element={<TrialBalance />} />


               {/* Other Module Routes */}
            <Route path="accounting" element={<AccountingModule />} />
            <Route path="inventory" element={<InventoryModule />} />
            <Route path="gst" element={<GSTModule />} />
            <Route path="tds" element={<TDSModule />} />
            <Route path="audit" element={<AuditModule />} />
            <Route path="config" element={<ConfigModule />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;