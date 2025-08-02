import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Building2,
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Package,
  Users,
  Shield,
  UserCheck
} from 'lucide-react';  //AlertCircle,
import * as XLSX from 'xlsx';
import { ConsolidationConfigIntegration } from '../../utils/consolidation-config-integration';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

// Type Definitions
interface Company {
  id: string;
  name: string;
  code: string;
  type: 'manufacturing' | 'trading' | 'service' | 'holding';
  gstin: string;
  status: 'active' | 'inactive';
  financialYear: string;
  accessibleUsers?: string[];
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  accessibleCompanies: string[];
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

interface FinancialData {
  companyId: string;
  companyName: string;
  capitalAccount: number;
  openingBalance: number;
  sales: number;
  purchases: number;
  directExpenses: number;
  indirectExpenses: number;
  grossProfit: number;
  netProfit: number;
  stockInHand: number;
  cashInHand: number;
  bankBalance: number;
  sundryDebtors: number;
  sundryCreditors: number;
  currentAssets: number;
  currentLiabilities: number;
  fixedAssets: number;
  investments: number;
  loans: number;
  provisions: number;
  enteredBy?: string;
  lastModifiedBy?: string;
  lastModified?: string;
}

interface FilterState {
  companies: string[];
  employees: string[];
  dateRange: string;
  fromDate: string;
  toDate: string;
  financialYear: string;
  reportType: string;
  consolidationType: 'all' | 'by-user' | 'by-company';
}

type ViewType = 'summary' | 'user-access' | 'detailed' | 'comparison' | 'consolidate';

const Consolidation: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [selectedView, setSelectedView] = useState<ViewType>('summary');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showUserAccessPanel, setShowUserAccessPanel] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    employees: [],
    dateRange: 'this-month',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    financialYear: '2025-26',
    reportType: 'consolidated',
    consolidationType: 'all'
  });

  // Role-Based Access Control Integration with Config Module
  const currentUserId = 'EMP001'; // This would come from your auth system
  const userRole = ConsolidationConfigIntegration.getUserRole(currentUserId);
  const userAccessibleCompanies = ConsolidationConfigIntegration.getAccessibleCompanies(currentUserId, userRole);
  const hierarchicalReport = ConsolidationConfigIntegration.getHierarchicalReport(currentUserId);
  
  console.log(`Current User: ${currentUserId}, Role: ${userRole}`);
  console.log(`Accessible Companies: ${userAccessibleCompanies.join(', ')}`);
  console.log(`Hierarchical Report:`, hierarchicalReport);

  // Companies Data based on Real Business Structure
  const companies = useMemo((): Company[] => [
    {
      id: 'COMP001',
      name: 'R K Sales',
      code: 'RKS',
      type: 'trading',
      gstin: '29AABCT1332L1Z4',
      status: 'active',
      financialYear: '2024-25',
      accessibleUsers: ['EMP001', 'EMP002', 'EMP003', 'EMP005']
    },
    {
      id: 'COMP002',
      name: 'Sikha Sales',
      code: 'SS',
      type: 'trading',
      gstin: '27AABCT1332L1Z5',
      status: 'active',
      financialYear: '2024-25',
      accessibleUsers: ['EMP001', 'EMP002', 'EMP004']
    },
    {
      id: 'COMP003',
      name: 'M P Traders',
      code: 'MPT',
      type: 'trading',
      gstin: '19AABCT1332L1Z6',
      status: 'active',
      financialYear: '2024-25',
      accessibleUsers: ['EMP001', 'EMP003', 'EMP005', 'EMP006']
    }
  ], []);

  // Role-Based Employee Data with Real Business Roles
  const employees = useMemo((): Employee[] => [
    {
      id: 'EMP001',
      name: 'Super Admin (Owner)',
      email: 'owner@company.com',
      role: 'Super Admin',
      department: 'Management',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP002', 'COMP003'],
      permissions: ['view_all', 'edit_all', 'export_all', 'admin', 'assign_access'],
      createdAt: '2023-01-15',
      lastLogin: '2025-08-01 10:30:00'
    },
    {
      id: 'EMP002',
      name: 'Admin - Finance Head',
      email: 'finance.admin@company.com',
      role: 'Admin',
      department: 'Finance',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP002'], // Assigned by Super Admin
      permissions: ['view_assigned', 'edit_assigned', 'export_reports', 'assign_employee_access'],
      createdAt: '2023-02-20',
      lastLogin: '2025-08-01 09:15:00'
    },
    {
      id: 'EMP003',
      name: 'Admin - Operations Head',
      email: 'operations.admin@company.com',
      role: 'Admin',
      department: 'Operations',
      status: 'active',
      accessibleCompanies: ['COMP003'], // Assigned by Super Admin
      permissions: ['view_assigned', 'edit_assigned', 'export_reports', 'assign_employee_access'],
      createdAt: '2023-03-10',
      lastLogin: '2025-07-31 16:45:00'
    },
    {
      id: 'EMP004',
      name: 'Employee - Accountant',
      email: 'accountant@company.com',
      role: 'Employee',
      department: 'Accounts',
      status: 'active',
      accessibleCompanies: ['COMP001'], // Assigned by Admin EMP002
      permissions: ['view_assigned', 'edit_transactions_assigned'],
      createdAt: '2023-04-05',
      lastLogin: '2025-08-01 08:30:00'
    },
    {
      id: 'EMP005',
      name: 'Employee - Sales Executive',
      email: 'sales@company.com',
      role: 'Employee',
      department: 'Sales',
      status: 'active',
      accessibleCompanies: ['COMP002'], // Assigned by Admin EMP002
      permissions: ['view_assigned', 'edit_sales_assigned'],
      createdAt: '2023-05-12',
      lastLogin: '2025-08-01 11:20:00'
    },
    {
      id: 'EMP006',
      name: 'Employee - Data Entry Operator',
      email: 'dataentry@company.com',
      role: 'Employee',
      department: 'Operations',
      status: 'active',
      accessibleCompanies: ['COMP003'], // Assigned by Admin EMP003
      permissions: ['view_assigned', 'edit_basic_assigned'],
      createdAt: '2023-06-18',
      lastLogin: '2025-07-31 14:10:00'
    }
  ], []);

  // Real Financial Data based on Screenshots (Balance Sheet format)
  const financialData = useMemo((): FinancialData[] => [
    {
      // R K Sales Company Data
      companyId: 'COMP001',
      companyName: 'R K Sales',
      capitalAccount: 1515969, // Proprietors Capital A/C
      openingBalance: 530382, // Cash & Bank Balance
      sales: 15108770, // From Trading Account
      purchases: 3525660, // Purchase GST 18%
      directExpenses: 337560, // Gross Profit on Sales
      indirectExpenses: 346269, // Net Profit
      grossProfit: 337560,
      netProfit: 346269,
      stockInHand: 2818470, // Closing Stock
      cashInHand: 215350, // Cash-In-Hand
      bankBalance: 315032, // BOI + SBI Balance (212532 + 102500)
      sundryDebtors: 38222, // Sundry Debtors
      sundryCreditors: 305650, // Sundry Creditors
      currentAssets: 3387074, // Current Assets calculation
      currentLiabilities: 305650, // Current Liabilities
      fixedAssets: 0, // Not shown in screenshot
      investments: 0,
      loans: 1325440, // Rakhraj Finvest Co.
      provisions: 35000, // Sundry Payables
      enteredBy: 'EMP004',
      lastModifiedBy: 'EMP002',
      lastModified: '2025-07-31 15:30:00'
    },
    {
      // Sikha Sales Company Data
      companyId: 'COMP002', 
      companyName: 'Sikha Sales',
      capitalAccount: 4800062, // Proprietors Capital A/C
      openingBalance: 3053436, // Cash & Bank Balance
      sales: 59872225, // From Trading Account
      purchases: 12462574, // Purchase GST 18%
      directExpenses: 541418, // Gross Profit on Sales
      indirectExpenses: 730062, // Net Profit
      grossProfit: 541418,
      netProfit: 730062,
      stockInHand: 5187121, // Closing Stock
      cashInHand: 141281, // Cash-In-Hand
      bankBalance: 2912155, // BOI + SBI Balance (2886271 + 25884)
      sundryDebtors: 4123585, // Sundry Debtors
      sundryCreditors: 2315991, // Sundry Creditors
      currentAssets: 12363942, // Current Assets calculation
      currentLiabilities: 2315991, // Current Liabilities
      fixedAssets: 0,
      investments: 0,
      loans: 2723954, // Rakhraj Finvest Co.
      provisions: 173492, // Sundry Payables
      enteredBy: 'EMP005',
      lastModifiedBy: 'EMP002',
      lastModified: '2025-08-01 11:15:00'
    },
    {
      // M P Traders (Consolidated Total - Individual breakdown)
      companyId: 'COMP003',
      companyName: 'M P Traders',
      capitalAccount: 6316031, // Total Capital A/C
      openingBalance: 3583818, // Total Cash & Bank Balance
      sales: 74980995, // Total Trading Account Sales
      purchases: 15988234, // Total Purchases
      directExpenses: 878978, // Total Gross Profit
      indirectExpenses: 1076331, // Total Net Profit  
      grossProfit: 878978,
      netProfit: 1076331,
      stockInHand: 8005591, // Total Closing Stock
      cashInHand: 356631, // Total Cash-In-Hand
      bankBalance: 3227187, // Total Bank Balance
      sundryDebtors: 4161807, // Total Sundry Debtors
      sundryCreditors: 2621641, // Total Sundry Creditors
      currentAssets: 15751016, // Total Current Assets
      currentLiabilities: 2621641, // Total Current Liabilities
      fixedAssets: 0,
      investments: 0,
      loans: 4049394, // Total Loans
      provisions: 208492, // Total Sundry Payables
      enteredBy: 'EMP006',
      lastModifiedBy: 'EMP003',
      lastModified: '2025-07-31 16:10:00'
    }
  ], []);

  // Filtered data based on role-based access and selected filters
  const filteredFinancialData = useMemo(() => {
    // First filter by role-based access control
    let data = financialData.filter(item => userAccessibleCompanies.includes(item.companyId));
    
    if (filters.companies.length > 0) {
      data = data.filter(item => filters.companies.includes(item.companyId));
    }
    
    if (filters.employees.length > 0) {
      data = data.filter(item => 
        (item.enteredBy && filters.employees.includes(item.enteredBy)) ||
        (item.lastModifiedBy && filters.employees.includes(item.lastModifiedBy))
      );
    }
    
    return data;
  }, [financialData, filters.companies, filters.employees, userAccessibleCompanies]);

  // Role-based filtering for companies and employees
  const accessibleCompanies = useMemo(() => {
    return companies.filter(company => userAccessibleCompanies.includes(company.id));
  }, [companies, userAccessibleCompanies]);

  const accessibleEmployees = useMemo(() => {
    return employees.filter(employee => 
      employee.accessibleCompanies.some(companyId => userAccessibleCompanies.includes(companyId))
    );
  }, [employees, userAccessibleCompanies]);

  // Get employees with access to selected company
  const getCompanyUsers = (companyId: string) => {
    return accessibleEmployees.filter(emp => emp.accessibleCompanies.includes(companyId));
  };

  // Consolidated totals
  const consolidatedTotals = useMemo(() => {
    const data = filteredFinancialData;
    return {
      totalSales: data.reduce((sum, item) => sum + item.sales, 0),
      totalPurchases: data.reduce((sum, item) => sum + item.purchases, 0),
      totalGrossProfit: data.reduce((sum, item) => sum + item.grossProfit, 0),
      totalNetProfit: data.reduce((sum, item) => sum + item.netProfit, 0),
      totalAssets: data.reduce((sum, item) => sum + item.currentAssets + item.fixedAssets, 0),
      totalLiabilities: data.reduce((sum, item) => sum + item.currentLiabilities, 0),
      totalCash: data.reduce((sum, item) => sum + item.cashInHand + item.bankBalance, 0),
      totalStock: data.reduce((sum, item) => sum + item.stockInHand, 0),
      companiesCount: data.length,
      activeUsers: new Set([...data.map(item => item.enteredBy), ...data.map(item => item.lastModifiedBy)].filter(Boolean)).size
    };
  }, [filteredFinancialData]);

  // Chart data
  const salesChartData = useMemo(() => {
    return filteredFinancialData.map(item => ({
      company: item.companyName.split(' ')[0],
      sales: item.sales / 1000000,
      profit: item.netProfit / 1000000
    }));
  }, [filteredFinancialData]);

  const profitTrendData = useMemo(() => [
    { month: 'Apr', profit: 180 },
    { month: 'May', profit: 220 },
    { month: 'Jun', profit: 280 },
    { month: 'Jul', profit: 350 }
  ], []);

  // User access analysis (only for employees accessible to current user)
  const userAccessData = useMemo(() => {
    return accessibleEmployees.map(emp => ({
      ...emp,
      accessibleCompaniesData: companies.filter(comp => 
        emp.accessibleCompanies.includes(comp.id)
      ),
      totalSalesAccess: financialData
        .filter(item => emp.accessibleCompanies.includes(item.companyId))
        .reduce((sum, item) => sum + item.sales, 0),
      totalProfitAccess: financialData
        .filter(item => emp.accessibleCompanies.includes(item.companyId))
        .reduce((sum, item) => sum + item.netProfit, 0)
    }));
  }, [accessibleEmployees, companies, financialData]);

  const formatCurrency = (amount: number, symbol: string = '₹') => {
    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(1)}K`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  const handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCompanyToggle = (companyId: string) => {
    setFilters(prev => ({
      ...prev,
      companies: prev.companies.includes(companyId)
        ? prev.companies.filter(id => id !== companyId)
        : [...prev.companies, companyId]
    }));
  };

  const handleEmployeeToggle = (employeeId: string) => {
    setFilters(prev => ({
      ...prev,
      employees: prev.employees.includes(employeeId)
        ? prev.employees.filter(id => id !== employeeId)
        : [...prev.employees, employeeId]
    }));
  };

  const handleSelectAllCompanies = () => {
    setFilters(prev => ({
      ...prev,
      companies: prev.companies.length === accessibleCompanies.length ? [] : accessibleCompanies.map(c => c.id)
    }));
  };

  const handleSelectAllEmployees = () => {
    setFilters(prev => ({
      ...prev,
      employees: prev.employees.length === accessibleEmployees.length ? [] : accessibleEmployees.map(e => e.id)
    }));
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setLoading(true);
    
    if (format === 'excel') {
      const exportData = filteredFinancialData.map(item => ({
        'Company': item.companyName,
        'Sales': item.sales,
        'Purchases': item.purchases,
        'Gross Profit': item.grossProfit,
        'Net Profit': item.netProfit,
        'Assets': item.currentAssets + item.fixedAssets,
        'Liabilities': item.currentLiabilities,
        'Cash & Bank': item.cashInHand + item.bankBalance,
        'Stock': item.stockInHand,
        'Entered By': employees.find(emp => emp.id === item.enteredBy)?.name || item.enteredBy,
        'Last Modified By': employees.find(emp => emp.id === item.lastModifiedBy)?.name || item.lastModifiedBy,
        'Last Modified': item.lastModified
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Multi-Company Consolidation');
      XLSX.writeFile(wb, `Multi_Company_Consolidation_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    setTimeout(() => setLoading(false), 1000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className={`pt-[56px] px-4 min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/app/reports')}
            title="Back to Reports"
            className={`p-2 rounded-lg mr-3 transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700 shadow-sm'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center text-gray-900 dark:text-white">
              <Building2 className="mr-3 text-blue-600" size={32} />
              Multi-Company Consolidation Report
              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                userRole === 'Super Admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : userRole === 'Admin'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {userRole} Access
              </span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Role-based financial reporting with access to {accessibleCompanies.length} companies 
              ({hierarchicalReport.reportScope} scope)
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh Data"
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-700'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            title="Toggle Filters"
            className={`p-2 rounded-lg transition-colors ${
              showFilterPanel
                ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700')
            }`}
          >
            <Filter size={16} />
          </button>
          <button
            onClick={() => setShowUserAccessPanel(!showUserAccessPanel)}
            title="User Access Panel"
            className={`p-2 rounded-lg transition-colors ${
              showUserAccessPanel
                ? (theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700')
            }`}
          >
            <Users size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => handleExport('excel')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
              }`}
              title="Export to Excel"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className={`p-6 rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Consolidation Type */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                <Shield className="inline mr-2" size={16} />
                Consolidation Type
              </label>
              <select
                value={filters.consolidationType}
                onChange={(e) => handleFilterChange('consolidationType', e.target.value)}
                title="Select consolidation type"
                className={`w-full p-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 outline-none`}
              >
                <option value="all">All Companies Consolidation</option>
                <option value="by-user">By Employee</option>
                <option value="by-company">By Company</option>
              </select>
            </div>

            {/* Company Selection */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                <Building2 className="inline mr-2" size={16} />
                Select Companies
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.companies.length === accessibleCompanies.length}
                    onChange={handleSelectAllCompanies}
                    className={`rounded text-blue-600 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>All Companies ({accessibleCompanies.length})</span>
                </label>
                {accessibleCompanies.map((company) => (
                  <label key={company.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company.id)}
                      onChange={() => handleCompanyToggle(company.id)}
                      className={`rounded text-blue-600 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>{company.name} ({company.code})</span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      [{company.accessibleUsers?.length || 0} users]
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employee Selection */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                <UserCheck className="inline mr-2" size={16} />
                Select Employees
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.employees.length === accessibleEmployees.length}
                    onChange={handleSelectAllEmployees}
                    className={`rounded text-blue-600 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>All Employees ({accessibleEmployees.length})</span>
                </label>
                {accessibleEmployees.map((employee) => (
                  <label key={employee.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.employees.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className={`rounded text-blue-600 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>{employee.name}</span>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      [{employee.accessibleCompanies.length} companies]
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Financial Year */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                <Calendar className="inline mr-2" size={16} />
                Financial Year
              </label>
              <select
                value={filters.financialYear}
                onChange={(e) => handleFilterChange('financialYear', e.target.value)}
                title="Select financial year"
                className={`w-full p-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 outline-none`}
              >
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* User Access Panel */}
      {showUserAccessPanel && (
        <div className={`p-6 rounded-xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <Shield className="mr-2" size={20} />
            Employee Company Access Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className={`text-left p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Employee</th>
                  <th className={`text-left p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Role</th>
                  <th className={`text-left p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Accessible Companies</th>
                  <th className={`text-right p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Total Sales Access</th>
                  <th className={`text-right p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Total Profit Access</th>
                  <th className={`text-center p-3 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {userAccessData.map((user) => (
                  <tr key={user.id} className={`border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role.includes('Admin') 
                          ? theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                          : user.role.includes('Manager') 
                          ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                          : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {user.accessibleCompaniesData.map((company) => (
                          <span key={company.id} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                            {company.code}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium text-green-600">
                      {formatCurrency(user.totalSalesAccess)}
                    </td>
                    <td className="p-3 text-right font-medium text-blue-600">
                      {formatCurrency(user.totalProfitAccess)}
                    </td>
                    <td className="p-3 text-center text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString('hi-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Views Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {([
          { id: 'summary', label: 'Summary', icon: <BarChart3 size={16} /> },
          { id: 'user-access', label: 'User Access Analysis', icon: <Users size={16} /> },
          { id: 'detailed', label: 'Detailed', icon: <FileText size={16} /> },
          { id: 'comparison', label: 'Comparison', icon: <Package size={16} /> },
          { id: 'consolidate', label: 'Consolidate Report', icon: <Building2 size={16} /> }
        ] as const).map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedView === view.id
                ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700')
            }`}
          >
            {view.icon}
            <span className="text-sm">{view.label}</span>
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {selectedView === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(consolidatedTotals.totalSales)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {consolidatedTotals.companiesCount} companies
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(consolidatedTotals.totalNetProfit)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {formatPercentage((consolidatedTotals.totalNetProfit / consolidatedTotals.totalSales) * 100)} margin
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(consolidatedTotals.totalAssets)}
                </p>
                <p className="text-xs text-purple-600 mt-1">Active Portfolio</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {consolidatedTotals.activeUsers}
                </p>
                <p className="text-xs text-orange-600 mt-1">Data Contributors</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {selectedView === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales & Profit Chart */}
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Sales & Profit by Company
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="company" 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} 
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} 
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value * 1000000)}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}
                />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales (Cr)" />
                <Bar dataKey="profit" fill="#10b981" name="Profit (Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Trend Chart */}
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Monthly Profit Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitTrendData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value * 10000)}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Profit (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`rounded-xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
      }`}>
        {/* Summary View */}
        {selectedView === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } sticky top-0`}>
                <tr>
                  <th className={`text-left p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Company</th>
                  <th className={`text-right p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Sales</th>
                  <th className={`text-right p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Net Profit</th>
                  <th className={`text-right p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Assets</th>
                  <th className={`text-right p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Cash & Bank</th>
                  <th className={`text-center p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Entered By</th>
                  <th className={`text-center p-4 font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinancialData.map((company) => (
                  <React.Fragment key={company.companyId}>
                    <tr className={`border-b transition-colors ${
                      theme === 'dark' 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {company.companyName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Capital: {formatCurrency(company.capitalAccount)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Users: {getCompanyUsers(company.companyId).length}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(company.sales)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        <span className={company.netProfit > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(company.netProfit)}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(company.currentAssets + company.fixedAssets)}
                      </td>
                      <td className="p-4 text-right font-medium text-blue-600">
                        {formatCurrency(company.cashInHand + company.bankBalance)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-sm">
                          <div className="font-medium">
                            {employees.find(emp => emp.id === company.enteredBy)?.name.split('(')[0] || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Modified: {employees.find(emp => emp.id === company.lastModifiedBy)?.name.split('(')[0] || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {company.lastModified}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleRowExpansion(company.companyId)}
                          title="View Details"
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          {expandedRows.has(company.companyId) ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Row Content */}
                    {expandedRows.has(company.companyId) && (
                      <tr className={`${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Detailed Financial Metrics */}
                            <div className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-sm`}>
                              <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Financial Overview
                              </h6>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Purchases:</span>
                                  <span className="font-medium">{formatCurrency(company.purchases)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Gross Profit:</span>
                                  <span className="font-medium text-green-600">{formatCurrency(company.grossProfit)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Direct Expenses:</span>
                                  <span className="font-medium text-red-500">{formatCurrency(company.directExpenses)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Indirect Expenses:</span>
                                  <span className="font-medium text-red-500">{formatCurrency(company.indirectExpenses)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Assets & Liabilities */}
                            <div className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-sm`}>
                              <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Assets & Liabilities
                              </h6>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Current Assets:</span>
                                  <span className="font-medium text-green-600">{formatCurrency(company.currentAssets)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Fixed Assets:</span>
                                  <span className="font-medium text-blue-600">{formatCurrency(company.fixedAssets)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Current Liabilities:</span>
                                  <span className="font-medium text-red-500">{formatCurrency(company.currentLiabilities)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Loans:</span>
                                  <span className="font-medium text-orange-600">{formatCurrency(company.loans)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Liquidity Position */}
                            <div className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-sm`}>
                              <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Liquidity Position
                              </h6>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Stock in Hand:</span>
                                  <span className="font-medium text-purple-600">{formatCurrency(company.stockInHand)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sundry Debtors:</span>
                                  <span className="font-medium text-blue-600">{formatCurrency(company.sundryDebtors)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sundry Creditors:</span>
                                  <span className="font-medium text-red-500">{formatCurrency(company.sundryCreditors)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-1">
                                  <span className="font-semibold">Working Capital:</span>
                                  <span className={`font-bold ${
                                    (company.currentAssets - company.currentLiabilities) > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {formatCurrency(company.currentAssets - company.currentLiabilities)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Key Ratios */}
                            <div className={`p-4 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-sm`}>
                              <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Key Financial Ratios
                              </h6>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Profit Margin:</span>
                                  <span className="font-medium text-green-600">
                                    {formatPercentage((company.netProfit / company.sales) * 100)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Current Ratio:</span>
                                  <span className="font-medium text-blue-600">
                                    {(company.currentAssets / company.currentLiabilities).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ROA:</span>
                                  <span className="font-medium text-purple-600">
                                    {formatPercentage((company.netProfit / (company.currentAssets + company.fixedAssets)) * 100)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Accessible Users:</span>
                                  <span className="font-medium text-orange-600">
                                    {getCompanyUsers(company.companyId).length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Employee Access Details */}
                          <div className={`mt-4 p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          } shadow-sm`}>
                            <h6 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              Employee Access & Data Entry
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-2">Accessible Employees:</p>
                                <div className="flex flex-wrap gap-1">
                                  {getCompanyUsers(company.companyId).map((user) => (
                                    <span key={user.id} className={`px-2 py-1 rounded text-xs ${
                                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {user.name.split('(')[0].trim()} ({user.role})
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-2">Data Entry History:</p>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <span className="font-medium">Entered by:</span> {' '}
                                    {employees.find(emp => emp.id === company.enteredBy)?.name || 'Unknown'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Last Modified by:</span> {' '}
                                    {employees.find(emp => emp.id === company.lastModifiedBy)?.name || 'Unknown'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Last Modified:</span> {' '}
                                    {company.lastModified}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {/* Totals Row */}
                <tr className={`border-t-2 font-bold ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-700' 
                    : 'border-gray-300 bg-gray-100'
                }`}>
                  <td className="p-4 text-gray-900 dark:text-white">
                    TOTAL ({consolidatedTotals.companiesCount} Companies)
                  </td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">
                    {formatCurrency(consolidatedTotals.totalSales)}
                  </td>
                  <td className="p-4 text-right text-green-600">
                    {formatCurrency(consolidatedTotals.totalNetProfit)}
                  </td>
                  <td className="p-4 text-right text-gray-900 dark:text-white">
                    {formatCurrency(consolidatedTotals.totalAssets)}
                  </td>
                  <td className="p-4 text-right text-blue-600">
                    {formatCurrency(consolidatedTotals.totalCash)}
                  </td>
                  <td className="p-4 text-center text-sm text-gray-500">
                    {consolidatedTotals.activeUsers} Active Users
                  </td>
                  <td className="p-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* User Access Analysis View */}
        {selectedView === 'user-access' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Employee Access and Data Entry Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userAccessData.map((user) => (
                <div key={user.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role.includes('Admin') 
                        ? theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                        : user.role.includes('Manager') 
                        ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Accessible Companies:</span>
                      <span className="font-medium">{user.accessibleCompanies.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Sales Access:</span>
                      <span className="font-medium text-green-600">{formatCurrency(user.totalSalesAccess)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Profit Access:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(user.totalProfitAccess)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Login:</span>
                      <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Company Access:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {user.accessibleCompaniesData.map((company) => (
                        <span key={company.id} className={`px-2 py-1 rounded text-xs ${
                          theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}>
                          {company.code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed View */}
        {selectedView === 'detailed' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Detailed Financial Analysis
            </h3>
            
            {/* Company-wise Detailed Breakdown */}
            <div className="space-y-6">
              {filteredFinancialData.map((company) => (
                <div key={company.companyId} className={`p-6 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  {/* Company Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {company.companyName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        GSTIN: {companies.find(c => c.id === company.companyId)?.gstin} | 
                        Type: {companies.find(c => c.id === company.companyId)?.type?.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Capital Account</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(company.capitalAccount)}
                      </p>
                    </div>
                  </div>

                  {/* Financial Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Revenue Section */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm`}>
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Revenue Analysis
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Sales:</span>
                          <span className="text-xs font-medium text-green-600">
                            {formatCurrency(company.sales)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Gross Profit:</span>
                          <span className="text-xs font-medium text-blue-600">
                            {formatCurrency(company.grossProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Net Profit:</span>
                          <span className={`text-xs font-medium ${
                            company.netProfit > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(company.netProfit)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-xs font-semibold">Profit Margin:</span>
                          <span className="text-xs font-bold text-purple-600">
                            {formatPercentage((company.netProfit / company.sales) * 100)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expense Section */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm`}>
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Expense Breakdown
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Purchases:</span>
                          <span className="text-xs font-medium text-orange-600">
                            {formatCurrency(company.purchases)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Direct Expenses:</span>
                          <span className="text-xs font-medium text-red-500">
                            {formatCurrency(company.directExpenses)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Indirect Expenses:</span>
                          <span className="text-xs font-medium text-red-500">
                            {formatCurrency(company.indirectExpenses)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-xs font-semibold">Total Expenses:</span>
                          <span className="text-xs font-bold text-red-600">
                            {formatCurrency(company.purchases + company.directExpenses + company.indirectExpenses)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assets Section */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm`}>
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Assets Portfolio
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Current Assets:</span>
                          <span className="text-xs font-medium text-green-600">
                            {formatCurrency(company.currentAssets)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Fixed Assets:</span>
                          <span className="text-xs font-medium text-blue-600">
                            {formatCurrency(company.fixedAssets)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Investments:</span>
                          <span className="text-xs font-medium text-purple-600">
                            {formatCurrency(company.investments)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-xs font-semibold">Total Assets:</span>
                          <span className="text-xs font-bold text-green-600">
                            {formatCurrency(company.currentAssets + company.fixedAssets + company.investments)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Liquidity Section */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm`}>
                      <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                        Liquidity & Working Capital
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Cash in Hand:</span>
                          <span className="text-xs font-medium text-green-600">
                            {formatCurrency(company.cashInHand)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Bank Balance:</span>
                          <span className="text-xs font-medium text-blue-600">
                            {formatCurrency(company.bankBalance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Stock in Hand:</span>
                          <span className="text-xs font-medium text-purple-600">
                            {formatCurrency(company.stockInHand)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-xs font-semibold">Working Capital:</span>
                          <span className={`text-xs font-bold ${
                            (company.currentAssets - company.currentLiabilities) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(company.currentAssets - company.currentLiabilities)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Ratios */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                      <p className="text-xs text-gray-500 mb-1">Current Ratio</p>
                      <p className="text-lg font-bold text-blue-600">
                        {(company.currentAssets / company.currentLiabilities).toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                      <p className="text-xs text-gray-500 mb-1">ROA (Return on Assets)</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPercentage((company.netProfit / (company.currentAssets + company.fixedAssets)) * 100)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                    }`}>
                      <p className="text-xs text-gray-500 mb-1">Debt-to-Assets Ratio</p>
                      <p className="text-lg font-bold text-orange-600">
                        {formatPercentage((company.loans / (company.currentAssets + company.fixedAssets)) * 100)}
                      </p>
                    </div>
                  </div>

                  {/* Employee & Access Info */}
                  <div className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Data Entry Information
                        </p>
                        <p className="text-xs text-gray-500">
                          Entered by: <span className="font-medium">
                            {employees.find(emp => emp.id === company.enteredBy)?.name || 'Unknown'}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Last Modified: <span className="font-medium">
                            {employees.find(emp => emp.id === company.lastModifiedBy)?.name || 'Unknown'}
                          </span> on {company.lastModified}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Accessible Users
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {getCompanyUsers(company.companyId).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison View */}
        {selectedView === 'comparison' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Multi-Company Comparison Analysis
            </h3>

            {/* Performance Comparison Table */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Financial Performance Comparison
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className="text-left p-3 font-semibold">Metric</th>
                      {filteredFinancialData.map((company) => (
                        <th key={company.companyId} className="text-center p-3 font-semibold">
                          {company.companyName.split(' ')[0]}
                        </th>
                      ))}
                      <th className="text-center p-3 font-semibold bg-blue-100 dark:bg-blue-900">
                        Best Performer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sales Comparison */}
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3 font-medium">Sales Revenue</td>
                      {filteredFinancialData.map((company) => {
                        const maxSales = Math.max(...filteredFinancialData.map(c => c.sales));
                        const isMax = company.sales === maxSales;
                        return (
                          <td key={company.companyId} className={`p-3 text-center ${
                            isMax ? 'bg-green-100 dark:bg-green-900 font-bold text-green-800 dark:text-green-200' : ''
                          }`}>
                            {formatCurrency(company.sales)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center bg-blue-100 dark:bg-blue-900 font-bold">
                        {filteredFinancialData.find(c => c.sales === Math.max(...filteredFinancialData.map(c => c.sales)))?.companyName.split(' ')[0]}
                      </td>
                    </tr>

                    {/* Net Profit Comparison */}
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3 font-medium">Net Profit</td>
                      {filteredFinancialData.map((company) => {
                        const maxProfit = Math.max(...filteredFinancialData.map(c => c.netProfit));
                        const isMax = company.netProfit === maxProfit;
                        return (
                          <td key={company.companyId} className={`p-3 text-center ${
                            isMax ? 'bg-green-100 dark:bg-green-900 font-bold text-green-800 dark:text-green-200' : ''
                          }`}>
                            {formatCurrency(company.netProfit)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center bg-blue-100 dark:bg-blue-900 font-bold">
                        {filteredFinancialData.find(c => c.netProfit === Math.max(...filteredFinancialData.map(c => c.netProfit)))?.companyName.split(' ')[0]}
                      </td>
                    </tr>

                    {/* Profit Margin Comparison */}
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3 font-medium">Profit Margin (%)</td>
                      {filteredFinancialData.map((company) => {
                        const margin = (company.netProfit / company.sales) * 100;
                        const maxMargin = Math.max(...filteredFinancialData.map(c => (c.netProfit / c.sales) * 100));
                        const isMax = Math.abs(margin - maxMargin) < 0.01;
                        return (
                          <td key={company.companyId} className={`p-3 text-center ${
                            isMax ? 'bg-green-100 dark:bg-green-900 font-bold text-green-800 dark:text-green-200' : ''
                          }`}>
                            {formatPercentage(margin)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center bg-blue-100 dark:bg-blue-900 font-bold">
                        {filteredFinancialData.reduce((prev, current) => 
                          ((prev.netProfit / prev.sales) > (current.netProfit / current.sales)) ? prev : current
                        ).companyName.split(' ')[0]}
                      </td>
                    </tr>

                    {/* Total Assets Comparison */}
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3 font-medium">Total Assets</td>
                      {filteredFinancialData.map((company) => {
                        const totalAssets = company.currentAssets + company.fixedAssets;
                        const maxAssets = Math.max(...filteredFinancialData.map(c => c.currentAssets + c.fixedAssets));
                        const isMax = totalAssets === maxAssets;
                        return (
                          <td key={company.companyId} className={`p-3 text-center ${
                            isMax ? 'bg-green-100 dark:bg-green-900 font-bold text-green-800 dark:text-green-200' : ''
                          }`}>
                            {formatCurrency(totalAssets)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center bg-blue-100 dark:bg-blue-900 font-bold">
                        {filteredFinancialData.reduce((prev, current) => 
                          ((prev.currentAssets + prev.fixedAssets) > (current.currentAssets + current.fixedAssets)) ? prev : current
                        ).companyName.split(' ')[0]}
                      </td>
                    </tr>

                    {/* Current Ratio Comparison */}
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-3 font-medium">Current Ratio</td>
                      {filteredFinancialData.map((company) => {
                        const ratio = company.currentAssets / company.currentLiabilities;
                        const maxRatio = Math.max(...filteredFinancialData.map(c => c.currentAssets / c.currentLiabilities));
                        const isMax = Math.abs(ratio - maxRatio) < 0.01;
                        return (
                          <td key={company.companyId} className={`p-3 text-center ${
                            isMax ? 'bg-green-100 dark:bg-green-900 font-bold text-green-800 dark:text-green-200' : ''
                          }`}>
                            {ratio.toFixed(2)}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center bg-blue-100 dark:bg-blue-900 font-bold">
                        {filteredFinancialData.reduce((prev, current) => 
                          ((prev.currentAssets / prev.currentLiabilities) > (current.currentAssets / current.currentLiabilities)) ? prev : current
                        ).companyName.split(' ')[0]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Comparison Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Performance Comparison Chart */}
              <div className={`p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Sales vs Profit Comparison
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value * 1000000)} />
                    <Legend />
                    <Bar dataKey="sales" fill="#3b82f6" name="Sales (Cr)" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit (Cr)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Market Share Visualization */}
              <div className={`p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Company Market Share (Sales)
                </h4>
                <div className="space-y-3">
                  {filteredFinancialData.map((company, index) => {
                    const totalSales = consolidatedTotals.totalSales;
                    const percentage = (company.sales / totalSales) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500'];
                    return (
                      <div key={company.companyId}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {company.companyName.split(' ')[0]}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatPercentage(percentage)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${colors[index % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Company Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sales Ranking */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Sales Ranking
                </h5>
                <div className="space-y-2">
                  {filteredFinancialData
                    .sort((a, b) => b.sales - a.sales)
                    .map((company, index) => (
                      <div key={company.companyId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium">
                            {company.companyName.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">
                          {formatCurrency(company.sales)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Profit Ranking */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Profit Ranking
                </h5>
                <div className="space-y-2">
                  {filteredFinancialData
                    .sort((a, b) => b.netProfit - a.netProfit)
                    .map((company, index) => (
                      <div key={company.companyId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium">
                            {company.companyName.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600 font-medium">
                          {formatCurrency(company.netProfit)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Efficiency Ranking (Profit Margin) */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Efficiency Ranking
                </h5>
                <div className="space-y-2">
                  {filteredFinancialData
                    .sort((a, b) => (b.netProfit / b.sales) - (a.netProfit / a.sales))
                    .map((company, index) => (
                      <div key={company.companyId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium">
                            {company.companyName.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">
                          {formatPercentage((company.netProfit / company.sales) * 100)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Asset Utilization Ranking */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Asset Utilization
                </h5>
                <div className="space-y-2">
                  {filteredFinancialData
                    .sort((a, b) => (b.sales / (b.currentAssets + b.fixedAssets)) - (a.sales / (a.currentAssets + a.fixedAssets)))
                    .map((company, index) => (
                      <div key={company.companyId} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium">
                            {company.companyName.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-xs text-orange-600 font-medium">
                          {(company.sales / (company.currentAssets + company.fixedAssets)).toFixed(2)}x
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consolidate Report View */}
        {selectedView === 'consolidate' && (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <Building2 className="mr-3" size={24} />
              Complete Consolidation Report
              <span className="ml-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                (All Companies • All Employees • All Admin Data • CA Reports)
              </span>
            </h3>

            {/* Executive Summary Section */}
            <div className={`p-6 rounded-xl mb-6 ${
              theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200 shadow-sm'
            }`}>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Executive Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Business Overview</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Companies:</span>
                      <span className="font-semibold">{companies.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Employees:</span>
                      <span className="font-semibold">{employees.filter(emp => emp.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin Users:</span>
                      <span className="font-semibold">{employees.filter(emp => emp.role.includes('Admin')).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Sales:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(consolidatedTotals.totalSales)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Financial Performance</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Profit:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(consolidatedTotals.totalGrossProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Profit:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(consolidatedTotals.totalNetProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit Margin:</span>
                      <span className="font-semibold">{formatPercentage((consolidatedTotals.totalNetProfit / consolidatedTotals.totalSales) * 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-semibold text-purple-600">{formatPercentage((consolidatedTotals.totalNetProfit / consolidatedTotals.totalAssets) * 100)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Asset Management</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Assets:</span>
                      <span className="font-semibold">{formatCurrency(consolidatedTotals.totalAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Ratio:</span>
                      <span className="font-semibold">{(consolidatedTotals.totalAssets / consolidatedTotals.totalLiabilities).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Position:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(consolidatedTotals.totalCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory:</span>
                      <span className="font-semibold">{formatCurrency(consolidatedTotals.totalStock)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company-wise Consolidated Analysis */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Building2 className="mr-2" size={20} />
                Company-wise Consolidated Analysis
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className={`text-left p-4 font-semibold w-1/5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Company Details</th>
                      <th className={`text-right p-4 font-semibold w-1/5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Financial Performance</th>
                      <th className={`text-right p-4 font-semibold w-1/5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Assets & Position</th>
                      <th className={`text-center p-4 font-semibold w-1/5 min-w-[200px] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Employee Management</th>
                      <th className={`text-center p-4 font-semibold w-1/5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Data Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinancialData.map((company) => {
                      const companyEmployees = getCompanyUsers(company.companyId);
                      const companyInfo = companies.find(c => c.id === company.companyId);
                      
                      return (
                        <tr key={company.companyId} className={`border-b ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-lg">
                                {company.companyName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <div>Code: {companyInfo?.code} | Type: {companyInfo?.type}</div>
                                <div>GSTIN: {companyInfo?.gstin}</div>
                                <div>Status: <span className={`px-2 py-1 rounded-full text-xs ${
                                  companyInfo?.status === 'active' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>{companyInfo?.status}</span></div>
                                <div>Capital: {formatCurrency(company.capitalAccount)}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-4 text-right">
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Sales: </span>
                                <span className="font-semibold text-green-600 text-lg">{formatCurrency(company.sales)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Purchases: </span>
                                <span className="font-medium">{formatCurrency(company.purchases)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Gross Profit: </span>
                                <span className="font-semibold text-blue-600">{formatCurrency(company.grossProfit)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Net Profit: </span>
                                <span className={`font-bold text-lg ${company.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(company.netProfit)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Margin: </span>
                                <span className="font-medium">{formatPercentage((company.netProfit / company.sales) * 100)}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Assets: </span>
                                <span className="font-semibold text-purple-600">{formatCurrency(company.currentAssets + company.fixedAssets)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Cash & Bank: </span>
                                <span className="font-medium text-blue-600">{formatCurrency(company.cashInHand + company.bankBalance)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Stock: </span>
                                <span className="font-medium">{formatCurrency(company.stockInHand)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Debtors: </span>
                                <span className="font-medium">{formatCurrency(company.sundryDebtors)}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Creditors: </span>
                                <span className="font-medium text-orange-600">{formatCurrency(company.sundryCreditors)}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Users: </span>
                                <span className="font-bold text-lg">{companyEmployees.length}</span>
                              </div>
                              <div className="space-y-2">
                                {companyEmployees.map(emp => (
                                  <div key={emp.id} className="text-xs space-y-1">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {emp.name.split('(')[0].trim()}
                                    </div>
                                    <div>
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        emp.role.includes('Admin') 
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                          : emp.role.includes('Manager') 
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      }`}>
                                        {emp.role}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                Dept: {[...new Set(companyEmployees.map(emp => emp.department))].join(', ')}
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-center">
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Data Entry: </span>
                                <div className="font-medium">
                                  {employees.find(emp => emp.id === company.enteredBy)?.name.split('(')[0] || 'Unknown'}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Last Modified: </span>
                                <div className="font-medium">
                                  {employees.find(emp => emp.id === company.lastModifiedBy)?.name.split('(')[0] || 'Unknown'}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {company.lastModified}
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  company.lastModified && new Date(company.lastModified) > new Date(Date.now() - 7*24*60*60*1000)
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {company.lastModified && new Date(company.lastModified) > new Date(Date.now() - 7*24*60*60*1000) 
                                    ? 'Recent' : 'Needs Update'}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employee Consolidation Report */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Users className="mr-2" size={20} />
                Employee Consolidation Analysis
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {employees.filter(emp => emp.accessibleCompanies.some(companyId => userAccessibleCompanies.includes(companyId))).map((employee) => {
                  const employeeCompanies = employee.accessibleCompanies
                    .filter(companyId => userAccessibleCompanies.includes(companyId))
                    .map(companyId => companies.find(c => c.id === companyId))
                    .filter(Boolean);
                  
                  const employeeFinancialData = financialData.filter(item => 
                    item.enteredBy === employee.id || item.lastModifiedBy === employee.id
                  );
                  
                  const totalSalesResponsible = employeeFinancialData.reduce((sum, item) => sum + item.sales, 0);
                  const totalProfitResponsible = employeeFinancialData.reduce((sum, item) => sum + item.netProfit, 0);
                  
                  return (
                    <div key={employee.id} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {/* Employee Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                            {employee.name}
                          </h5>
                          <div className="flex flex-col space-y-2">
                            <div>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                employee.role.includes('Admin') 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : employee.role.includes('Manager') 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {employee.role}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {employee.department} Department
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {employee.status}
                          </div>
                        </div>
                      </div>

                      {/* Employee Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Access & Responsibility</h6>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Companies Access:</span>
                              <span className="font-semibold">{employeeCompanies.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Data Entries:</span>
                              <span className="font-semibold">{employeeFinancialData.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Permissions:</span>
                              <span className="font-semibold">{employee.permissions.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Login:</span>
                              <span className="text-xs">{new Date(employee.lastLogin).toLocaleDateString('hi-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Financial Impact</h6>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Sales Handled:</span>
                              <span className="font-semibold text-green-600">{formatCurrency(totalSalesResponsible)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Profit Impact:</span>
                              <span className="font-semibold text-blue-600">{formatCurrency(totalProfitResponsible)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Avg per Company:</span>
                              <span className="font-semibold">{formatCurrency(totalSalesResponsible / Math.max(employeeCompanies.length, 1))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Efficiency Score:</span>
                              <span className="font-semibold text-purple-600">
                                {totalSalesResponsible > 0 ? Math.min(100, Math.round((totalProfitResponsible / totalSalesResponsible) * 1000)) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company Access Details */}
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Company Access Details:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {employeeCompanies.map((company) => {
                            const companyData = financialData.find(item => item.companyId === company.id);
                            return (
                              <div key={company.id} className={`p-3 rounded border ${
                                theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200 shadow-sm'
                              }`}>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">{company.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({company.code})</span>
                                  </div>
                                  <div className="text-right text-sm">
                                    <div className="text-green-600 font-medium">
                                      {companyData ? formatCurrency(companyData.sales) : 'No Data'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {companyData ? formatCurrency(companyData.netProfit) : ''}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Administrative Analysis */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Shield className="mr-2" size={20} />
                Administrative & CA Analysis
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Admin Performance */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50 shadow-sm'
                }`}>
                  <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">Admin Performance</h5>
                  {employees.filter(emp => emp.role.includes('Admin')).map(admin => {
                    const adminCompanies = admin.accessibleCompanies.length;
                    const adminSales = financialData
                      .filter(item => admin.accessibleCompanies.includes(item.companyId))
                      .reduce((sum, item) => sum + item.sales, 0);
                    
                    return (
                      <div key={admin.id} className={`mb-3 p-3 rounded ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                      }`}>
                        <div className="font-medium">{admin.name.split('(')[0]}</div>
                        <div className="text-sm space-y-1 mt-1">
                          <div className="flex justify-between">
                            <span>Companies Managed:</span>
                            <span className="font-semibold">{adminCompanies}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Sales Oversight:</span>
                            <span className="font-semibold text-green-600">{formatCurrency(adminSales)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Department:</span>
                            <span>{admin.department}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Data Quality Analysis */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-green-50 shadow-sm'
                }`}>
                  <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">Data Quality Report</h5>
                  <div className="space-y-3">
                    <div className={`p-3 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex justify-between">
                        <span>Companies with Recent Updates:</span>
                        <span className="font-semibold text-green-600">
                          {financialData.filter(item => 
                            item.lastModified && new Date(item.lastModified) > new Date(Date.now() - 7*24*60*60*1000)
                          ).length}/{financialData.length}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex justify-between">
                        <span>Data Completeness:</span>
                        <span className="font-semibold text-blue-600">
                          {Math.round((financialData.filter(item => item.enteredBy && item.lastModifiedBy).length / financialData.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex justify-between">
                        <span>Active Data Contributors:</span>
                        <span className="font-semibold text-purple-600">{consolidatedTotals.activeUsers}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex justify-between">
                        <span>Average Data Age:</span>
                        <span className="font-semibold">
                          {Math.round(
                            financialData
                              .filter(item => item.lastModified)
                              .reduce((sum, item) => sum + (Date.now() - new Date(item.lastModified).getTime()), 0) 
                              / financialData.filter(item => item.lastModified).length 
                              / (24*60*60*1000)
                          )} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CA & Compliance Status */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50 shadow-sm'
                }`}>
                  <h5 className="font-semibold mb-3 text-gray-900 dark:text-white">CA & Compliance</h5>
                  <div className="space-y-3">
                    {companies.map(company => {
                      const companyData = financialData.find(item => item.companyId === company.id);
                      return (
                        <div key={company.id} className={`p-3 rounded ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'
                        }`}>
                          <div className="font-medium text-sm">{company.name}</div>
                          <div className="text-xs space-y-1 mt-1">
                            <div className="flex justify-between">
                              <span>GSTIN Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                company.gstin 
                                  ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                  : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                              }`}>
                                {company.gstin ? 'Active' : 'Missing'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Financial Year:</span>
                              <span>{company.financialYear}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Audit Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                companyData?.netProfit > 0 
                                  ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                  : theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {companyData?.netProfit > 0 ? 'Profitable' : 'Review Needed'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Compliance Score:</span>
                              <span className="font-semibold text-blue-600">
                                {company.gstin && company.status === 'active' && companyData ? '95%' : '70%'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Consolidated Summary */}
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600' : 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 shadow-lg'
            }`}>
              <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="mr-3" size={24} />
                Final Consolidated Report Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(consolidatedTotals.totalSales)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Business Volume</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Across {companies.length} Companies
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(consolidatedTotals.totalNetProfit)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Net Profit</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPercentage((consolidatedTotals.totalNetProfit / consolidatedTotals.totalSales) * 100)} Margin
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatCurrency(consolidatedTotals.totalAssets)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Assets</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Strong Portfolio
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {employees.filter(emp => emp.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Team</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {employees.filter(emp => emp.role.includes('Admin')).length} Admins + {employees.filter(emp => !emp.role.includes('Admin')).length} Staff
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Report Generated:</strong> {new Date().toLocaleDateString('hi-IN')} at {new Date().toLocaleTimeString('hi-IN')} 
                  | <strong>Generated By:</strong> {employees.find(emp => emp.id === currentUserId)?.name || 'System'} ({userRole})
                  | <strong>Access Level:</strong> {hierarchicalReport.reportScope}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <div className="flex items-center space-x-3">
              <RefreshCw className="animate-spin text-blue-600" size={24} />
              <span className="text-gray-900 dark:text-white">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-8 p-4 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50 shadow-sm'
      }`}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Tips:</span> Use filters to customize your view, 
          use the User Access Panel to see employee access, and export reports for external analysis. 
          All employee entries are tracked here automatically.
        </p>
      </div>
    </div>
  );
};

export default Consolidation;
