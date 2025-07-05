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
import StockItemEdit from './components/masters/stock/StockItemEdit'; 
import StockGroupList from './components/masters/stock/StockGroupList';
import StockGroupForm from './components/masters/stock/StockGroupForm';
import UnitList from './components/masters/unit/UnitList';
import UnitForm from './components/masters/unit/UnitForm';
import GodownList from './components/masters/godown/GodownList';
import GodownForm from './components/masters/godown/GodownForm';
import ScenarioList from './components/masters/scenario/ScenarioList';
import ScenarioForm from './components/masters/scenario/ScenarioForm';







// // Vouchers Components
import VouchersIndex from './components/vouchers/VouchersIndex';
import PaymentVoucher from './components/vouchers/payment/PaymentVouchers';
import ContraVoucher from './components/vouchers/Contra/ContraVoucher';
import CreditNoteVoucher from './components/vouchers/creditnote/CreditNoteVoucher';
import DebitNoteVoucher from './components/vouchers/debitnote/DebitNoteVoucher';
import DeliveryNoteVoucher from './components/vouchers/deliverynote/DeliveryNoteVoucher';
import JournalVoucher from './components/vouchers/journal/JournalVoucher';
import SalesVoucher1 from './components/vouchers/sales/SalesVoucher1';
import PurchaseVoucher1 from './components/vouchers/purches/PurcheseVoucher1';
import StockJournalVoucher1 from './components/vouchers/stockjournal/StockJournalVoucher1';
import ReceiptVoucher from './components/vouchers/receipt/ReceiptVoucher';

// Voucher Register Components
import VoucherRegisterIndex from './components/voucherRegister/VoucherRegisterIndex';
import PaymentRegister from './components/voucherRegister/PaymentRegister';
import ReceiptRegister from './components/voucherRegister/ReceiptRegister';
import ContraRegister from './components/voucherRegister/ContraRegister';
import JournalRegister from './components/voucherRegister/JournalRegister';
import SalesRegister from './components/voucherRegister/salesVoucherRegister/SalesRegister';
import PurchaseRegister from './components/voucherRegister/purchaseVoucherRegister/PurchaseRegister';
import CreditNoteRegister from './components/voucherRegister/CreditNoteRegister';
import DebitNoteRegister from './components/voucherRegister/DebitNoteRegister';
import SalesOrderRegister from './components/voucherRegister/SalesOrderRegister';
import PurchaseReturnRegister from './components/voucherRegister/PurchaseReturnRegister';
import StockJournalRegister from './components/voucherRegister/StockJournalRegister';
import DeliveryNoteRegister from './components/voucherRegister/DeliveryNoteRegister';
import QuotationRegister from './components/voucherRegister/QuotationRegister';
import SalesReturnRegister from './components/voucherRegister/SalesReturnRegister';

//Accounting



//inventry 






// // Reports Components
import ReportsIndex from './components/reports/ReportsIndex';
import DayBook from './components/reports/DayBook';
import LedgerReport from './components/reports/LedgerReport';
import TrialBalance from './components/reports/TrialBalance';
import TradingAccount from './components/reports/TradingAccount';
// import ProfitLoss from './components/accounting/ProfitLoss';
import ProfitLoss from './components/reports/ProfitLoss';
import BalanceSheet from './components/reports/BalanceSheet';
import GroupSummary from './components/reports/GroupSummary';
import CashFlow from './components/reports/CashFlow';
import StockSummary from './components/reports/StockSummary';
import MovementAnalysis from './components/reports/MovementAnalysis';
import AgeingAnalysis from './components/reports/AgeingAnalysis';
import GodownSummary from './components/reports/GodownSummary';
import GSTAnalysis from './components/reports/GSTAnalysis';



// GST Module Components

import GSTModule from './components/modules/gst/GSTModul';
import GSTCalculator from './components/modules/gst/GSTCalculator';
import GSTRates from './components/modules/gst/GSTRates';
import HSNCodes from './components/modules/gst/HSNCode';
import GSTR1 from './components/modules/gst/GSTR1';
import GSTR3B from './components/modules/gst/GSTR3B';
import GSTRegistration from './components/modules/gst/GSTRegistration';
import ComplianceCheck from './components/modules/gst/ComplianceCheck';
import ImportData from './components/modules/gst/ImportData';
import Reconciliation from './components/modules/gst/Reconciliation';
import ExportReturns from './components/modules/gst/ExportReturns';
import GSTSummary from './components/modules/gst/GSTSummary';
import EWayBill from './components/modules/gst/EWayBill';
import TDSSummary from './components/modules/tds/TDSSummary';



//TDSvModules
import TDSModule from './components/modules/tds/TDSModule';
import Form24Q from './components/modules/tds/Form24Q';
import Form26Q from './components/modules/tds/Form26Q';
import Form27Q from './components/modules/tds/Form27Q';
import TDSRates from './components/modules/tds/TDSRates';
import Form16 from './components/modules/tds/Form16';
import ComplianceCheck2 from './components/modules/tds/ComplianceCheck';
import DeducteeMaster from './components/modules/tds/DeducteeMaster';
import TANRegistration from './components/modules/tds/TANRegistration';
import AuditCompliance from './components/audit/ComplianceCheck';
import FraudDetection from './components/audit/FraudDetection';



//Audit Modules
import AuditModule from './components/modules/AuditModule';
import AuditSummary from './components/audit/AuditSummary';
import TransactionLog from './components/audit/TransactionLog';
import UserActivity from './components/audit/UserActivity'; 
import LoginHistory from './components/audit/LoginHistory';
import DataChanges from './components/audit/DataChanges';
import SecuritySettings from './components/audit/SecuritySettings';
import RiskAssessment from './components/audit/RiskAssessment';
import ExceptionReports from './components/audit/ExceptionReports';
import PeriodAnalysis from './components/audit/PeriodAnalysis';
import UserReports from './components/audit/UserReports';

// Other Modules
// import AccountingModule from './components/accounting/AccountingModule';
// import InventoryModule from './components/inventory/InventoryModule';

// Home Pages
import HomePage from './home/pages/HomePage';
import PricingPage from './home/pages/PricingPage';
import PurchasePage from './home/pages/PurchasePage';
import AboutUsPage from './home/pages/AboutUsPage';
import CareersPage from './home/pages/CareersPage';
import ContactPage from './home/pages/ContactPage';
import PrivacyPolicyPage from './home/pages/PrivacyPolicyPage';
import LoginPage from './home/auth/LoginPage';
import Register from './home/auth/Register';
import { AuthProvider } from './home/context/AuthContext';

//config module
import ConfigModule from './components/modules/ConfigModule';
import GeneralSettings from './components/config/GeneralSettings';
import DatabaseSettings from './components/config/DatabaseSettings';
import BackupRestore from './components/config/BackupRestore';
import DisplaySettings from './components/config/DisplaySettings';
import UserAccounts from './components/config/UserAccounts';
import Permissions from './components/config/Permissions';
import RoleManagement from './components/config/RoleManagement';
import AccessControl from './components/config/AccessControl';





function App() {
  // Add keyboard shortcut listener for Alt+F1 for company selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+F1 for company selection
      if (e.altKey && e.key === 'F1') {
        e.preventDefault();
        window.location.href = '/app/company';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Home/Marketing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            
            {/* App Routes */}
            <Route path="/app" element={<MainLayout />}>
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
            <Route path="masters/stock-item/edit-stock/:id" element={<StockItemEdit />} />
            <Route path="masters/stock-group" element={<StockGroupList />} />
            <Route path="masters/stock-group/create" element={<StockGroupForm />} />
            <Route path="masters/stock-group/edit/:id" element={<StockGroupForm />} />
            <Route path="masters/units" element={<UnitList />} />
            <Route path="masters/unit/create" element={<UnitForm />} />
            <Route path="masters/unit/edit/:id" element={<UnitForm />} />            <Route path="masters/godowns" element={<GodownList />} />
            <Route path="masters/godown/create" element={<GodownForm />} />
            <Route path="masters/godown/edit/:id" element={<GodownForm />} />
            <Route path="masters/scenarios" element={<ScenarioList />} />
            <Route path="masters/scenario/create" element={<ScenarioForm />} />
            <Route path="masters/scenario/edit/:id" element={<ScenarioForm />} />
            <Route path="scenarios" element={<ScenarioList />} />
            <Route path="scenarios/create" element={<ScenarioForm />} />
            <Route path="scenarios/edit/:id" element={<ScenarioForm />} />
            
            
            
            {/* Vouchers Routes */}
            <Route path="vouchers" element={<VouchersIndex />} />
            <Route path="vouchers/payment/create" element={<PaymentVoucher />} />
            <Route path="vouchers/receipt/create" element={<ReceiptVoucher />} />
            <Route path="vouchers/contra/create" element={<ContraVoucher />} />
            <Route path="vouchers/credit-note/create" element={<CreditNoteVoucher />} />
            <Route path="vouchers/debit-note/create" element={<DebitNoteVoucher />} />
            <Route path="vouchers/delivery-note/create" element={<DeliveryNoteVoucher />} />
            <Route path="vouchers/journal/create" element={<JournalVoucher />} />
            <Route path="vouchers/purchase/create" element={<PurchaseVoucher1 />} />
            <Route path="vouchers/stock-journal/create" element={<StockJournalVoucher1 />} />
            <Route path="vouchers/sales/create" element={<SalesVoucher1 />} />
           
            {/* Voucher Register Routes */}
            <Route path="voucher-register" element={<VoucherRegisterIndex />} />
            <Route path="voucher-register/payment" element={<PaymentRegister />} />
            <Route path="voucher-register/receipt" element={<ReceiptRegister />} />
            <Route path="voucher-register/contra" element={<ContraRegister />} />
            <Route path="voucher-register/journal" element={<JournalRegister />} />
            <Route path="voucher-register/sales" element={<SalesRegister />} />
            <Route path="voucher-register/purchase" element={<PurchaseRegister />} />
            <Route path="voucher-register/credit-note" element={<CreditNoteRegister />} />
            <Route path="voucher-register/debit-note" element={<DebitNoteRegister />} />
            <Route path="voucher-register/sales-order" element={<SalesOrderRegister />} />
            <Route path="voucher-register/purchase-return" element={<PurchaseReturnRegister />} />
            <Route path="voucher-register/stock-journal" element={<StockJournalRegister />} />
            <Route path="voucher-register/delivery-note" element={<DeliveryNoteRegister />} />
            <Route path="voucher-register/quotation" element={<QuotationRegister />} />
            <Route path="voucher-register/sales-return" element={<SalesReturnRegister />} />

           //Accounting Routes
           {/* <Route path="accounting" element={<AccountingModule />} /> */}
            <Route path="reports/day-book" element={<DayBook />} />
            <Route path="reports/ledger" element={<LedgerReport />} />
            <Route path="reports/trial-balance" element={<TrialBalance />} />
             <Route path="reports/trading-account" element={<TradingAccount />} />
            <Route path="reports/profit-loss" element={<ProfitLoss />} />
            <Route path="reports/balance-sheet" element={<BalanceSheet />} />
            <Route path="reports/group-summary/:groupType" element={<GroupSummary />} />
            <Route path="reports/cash-flow" element={<CashFlow />} />

           //inventory Routes
           <Route path="reports/stock-summary" element={<StockSummary />} />
            <Route path="reports/movement-analysis" element={<MovementAnalysis />} />
            <Route path="reports/ageing-analysis" element={<AgeingAnalysis />} />
             <Route path="reports/godown-summary" element={<GodownSummary />} />
            
            {/* Reports Routes */}
            <Route path="reports" element={<ReportsIndex />} />
            <Route path="reports/trading-account" element={<TradingAccount />} />
            


            {/* GST Module Routes */}
            
            <Route path="gst/gstr-1" element={<GSTR1 />} />
            <Route path="gst/gstr-3b" element={<GSTR3B />} />
            <Route path="gst/gst-analysis" element={<GSTAnalysis />} />
            <Route path="gst" element={<GSTModule />} />
             <Route path="gst/calculator" element={<GSTCalculator />} />
            <Route path="gst/hsn-codes" element={<HSNCodes />} />
            <Route path="gst/compliance" element={<ComplianceCheck />} />
            <Route path="gst/rates" element={<GSTRates />} />
            <Route path="gst/registration" element={<GSTRegistration />} />
            <Route path="gst/import" element={<ImportData />} />
            <Route path="gst/reconciliation" element={<Reconciliation />} />
            <Route path="gst/export" element={<ExportReturns />} />
            <Route path="gst/e-way-bill" element={<EWayBill />} />
            <Route path="gst/summary" element={<GSTSummary />} />

            {/* TDS Module Routes */}
            <Route path="tds" element={<TDSModule />} />
               <Route path='tds/form-24q' element={<Form24Q />} />
               <Route path='tds/form-26q' element={<Form26Q />} />
               <Route path='tds/form-27q' element={<Form27Q />} />
               <Route path='tds/summary' element={<TDSSummary />} />
               <Route path='tds/rates' element={<TDSRates />} />
               <Route path='tds/form-16' element={<Form16 />} />
               <Route path='tds/compliance' element={<ComplianceCheck2 />} />
               <Route path='tds/deductees' element={<DeducteeMaster />} />
               <Route path="tds/tan" element={<TANRegistration />} />

            {/* Audit Module Routes */}
                <Route path="audit" element={<AuditModule />} />
                <Route path='audit/summary' element={<AuditSummary />} />
                <Route path='audit/transaction-log' element={<TransactionLog />} />
                <Route path='audit/user-activity'   element= {<UserActivity />} />
                <Route path='audit/login-history'  element={<LoginHistory />} />
                <Route path='audit/data-changes' element={<DataChanges />} />
                <Route path='audit/security'  element={<SecuritySettings />} />
                <Route path='audit/compliance' element={<AuditCompliance />} />
                <Route path='audit/risk' element={<RiskAssessment />} />
                <Route path='audit/fraud' element={<FraudDetection />} />
                <Route path='audit/exceptions' element={<ExceptionReports />} />
                <Route path='audit/period-analysis' element={<PeriodAnalysis />} />
                <Route path='audit/user-reports' element={<UserReports />} />










               {/* Other Module Routes */}
            
            {/* <Route path="inventory" element={<InventoryModule />} /> */}
            <Route path="gst" element={<GSTModule />} />
            
            {/* Config Module Routes */}
            <Route path="config" element={<ConfigModule />} />
            <Route path='config/general' element={<GeneralSettings />} />
            <Route path='config/database' element={<DatabaseSettings />} />
            <Route path='config/backup' element={<BackupRestore />} />
            <Route path='config/display' element={<DisplaySettings />} />
            <Route path='config/backup' element={<BackupRestore />} />
            <Route path='config/users' element={<UserAccounts />} />
            <Route path='config/permissions' element={<Permissions />} />
            <Route path='config/roles' element={<RoleManagement />} />
            <Route path='config/access' element={<AccessControl />} />
           




          </Route>
        </Routes>
      </Router>
    </AppProvider>
    </AuthProvider>
  );
}

export default App;