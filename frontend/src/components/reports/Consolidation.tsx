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

type ViewType = 'summary' | 'user-access' | 'detailed' | 'comparison';

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

  // Mock Companies Data with Employee Access
  const companies = useMemo((): Company[] => [
    {
      id: 'COMP001',
      name: 'TechCorp Industries Ltd',
      code: 'TCI',
      type: 'manufacturing',
      gstin: '29AABCT1332L1Z4',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP002', 'EMP003', 'EMP005']
    },
    {
      id: 'COMP002',
      name: 'Global Trading Co',
      code: 'GTC',
      type: 'trading',
      gstin: '27AABCT1332L1Z5',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP002', 'EMP004']
    },
    {
      id: 'COMP003',
      name: 'Service Solutions Pvt Ltd',
      code: 'SSPL',
      type: 'service',
      gstin: '19AABCT1332L1Z6',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP003', 'EMP005', 'EMP006']
    },
    {
      id: 'COMP004',
      name: 'Digital Innovations Hub',
      code: 'DIH',
      type: 'service',
      gstin: '09AABCT1332L1Z7',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP002', 'EMP007']
    },
    {
      id: 'COMP005',
      name: 'Manufacturing Enterprises',
      code: 'ME',
      type: 'manufacturing',
      gstin: '07AABCT1332L1Z8',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP004', 'EMP006', 'EMP008']
    },
    {
      id: 'COMP006',
      name: 'Retail Network Ltd',
      code: 'RNL',
      type: 'trading',
      gstin: '29AABCT1332L1Z9',
      status: 'active',
      financialYear: '2025-26',
      accessibleUsers: ['EMP001', 'EMP005', 'EMP007', 'EMP008']
    }
  ], []);

  // Mock Employees Data with Company Access
  const employees = useMemo((): Employee[] => [
    {
      id: 'EMP001',
      name: 'Rajesh Kumar (Super Admin)',
      email: 'rajesh.kumar@company.com',
      role: 'Super Admin',
      department: 'Management',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP002', 'COMP003', 'COMP004', 'COMP005', 'COMP006'],
      permissions: ['view_all', 'edit_all', 'export_all', 'admin'],
      createdAt: '2023-01-15',
      lastLogin: '2025-07-31 10:30:00'
    },
    {
      id: 'EMP002',
      name: 'Priya Sharma (Finance Manager)',
      email: 'priya.sharma@company.com',
      role: 'Finance Manager',
      department: 'Finance',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP002', 'COMP004'],
      permissions: ['view_financial', 'edit_vouchers', 'export_reports'],
      createdAt: '2023-02-20',
      lastLogin: '2025-07-31 09:15:00'
    },
    {
      id: 'EMP003',
      name: 'Amit Verma (Operations Head)',
      email: 'amit.verma@company.com',
      role: 'Operations Manager',
      department: 'Operations',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP003'],
      permissions: ['view_operations', 'edit_inventory', 'export_reports'],
      createdAt: '2023-03-10',
      lastLogin: '2025-07-30 16:45:00'
    },
    {
      id: 'EMP004',
      name: 'Sunita Patel (Accountant)',
      email: 'sunita.patel@company.com',
      role: 'Senior Accountant',
      department: 'Accounts',
      status: 'active',
      accessibleCompanies: ['COMP002', 'COMP005'],
      permissions: ['view_accounting', 'edit_transactions', 'export_basic'],
      createdAt: '2023-04-05',
      lastLogin: '2025-07-31 08:30:00'
    },
    {
      id: 'EMP005',
      name: 'Vikash Singh (Sales Manager)',
      email: 'vikash.singh@company.com',
      role: 'Sales Manager',
      department: 'Sales',
      status: 'active',
      accessibleCompanies: ['COMP001', 'COMP003', 'COMP006'],
      permissions: ['view_sales', 'edit_orders', 'export_sales'],
      createdAt: '2023-05-12',
      lastLogin: '2025-07-31 11:20:00'
    },
    {
      id: 'EMP006',
      name: 'Kavita Joshi (HR Manager)',
      email: 'kavita.joshi@company.com',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'active',
      accessibleCompanies: ['COMP003', 'COMP005'],
      permissions: ['view_hr', 'edit_employees', 'export_hr'],
      createdAt: '2023-06-18',
      lastLogin: '2025-07-30 14:10:00'
    },
    {
      id: 'EMP007',
      name: 'Deepak Agarwal (IT Head)',
      email: 'deepak.agarwal@company.com',
      role: 'IT Manager',
      department: 'Information Technology',
      status: 'active',
      accessibleCompanies: ['COMP004', 'COMP006'],
      permissions: ['view_system', 'edit_config', 'export_technical'],
      createdAt: '2023-07-25',
      lastLogin: '2025-07-31 07:45:00'
    },
    {
      id: 'EMP008',
      name: 'Neha Gupta (Junior Accountant)',
      email: 'neha.gupta@company.com',
      role: 'Junior Accountant',
      department: 'Accounts',
      status: 'active',
      accessibleCompanies: ['COMP005', 'COMP006'],
      permissions: ['view_basic', 'edit_limited'],
      createdAt: '2023-08-15',
      lastLogin: '2025-07-30 17:30:00'
    }
  ], []);

  // Mock Financial Data with Extended Companies and Employee Tracking
  const financialData = useMemo((): FinancialData[] => [
    {
      companyId: 'COMP001',
      companyName: 'TechCorp Industries Ltd',
      capitalAccount: 10000000,
      openingBalance: 2500000,
      sales: 15000000,
      purchases: 8500000,
      directExpenses: 1200000,
      indirectExpenses: 2800000,
      grossProfit: 5300000,
      netProfit: 2500000,
      stockInHand: 3500000,
      cashInHand: 250000,
      bankBalance: 1750000,
      sundryDebtors: 2200000,
      sundryCreditors: 1800000,
      currentAssets: 7700000,
      currentLiabilities: 3200000,
      fixedAssets: 12000000,
      investments: 500000,
      loans: 4500000,
      provisions: 800000,
      enteredBy: 'EMP002',
      lastModifiedBy: 'EMP003',
      lastModified: '2025-07-30 15:30:00'
    },
    {
      companyId: 'COMP002',
      companyName: 'Global Trading Co',
      capitalAccount: 5000000,
      openingBalance: 1200000,
      sales: 12000000,
      purchases: 7200000,
      directExpenses: 800000,
      indirectExpenses: 2200000,
      grossProfit: 3800000,
      netProfit: 1600000,
      stockInHand: 2800000,
      cashInHand: 180000,
      bankBalance: 1320000,
      sundryDebtors: 1800000,
      sundryCreditors: 1400000,
      currentAssets: 6100000,
      currentLiabilities: 2600000,
      fixedAssets: 8000000,
      investments: 300000,
      loans: 3000000,
      provisions: 500000,
      enteredBy: 'EMP004',
      lastModifiedBy: 'EMP002',
      lastModified: '2025-07-31 11:15:00'
    },
    {
      companyId: 'COMP003',
      companyName: 'Service Solutions Pvt Ltd',
      capitalAccount: 3000000,
      openingBalance: 800000,
      sales: 8000000,
      purchases: 2400000,
      directExpenses: 600000,
      indirectExpenses: 3200000,
      grossProfit: 5000000,
      netProfit: 1800000,
      stockInHand: 400000,
      cashInHand: 120000,
      bankBalance: 880000,
      sundryDebtors: 1200000,
      sundryCreditors: 800000,
      currentAssets: 2600000,
      currentLiabilities: 1500000,
      fixedAssets: 4500000,
      investments: 200000,
      loans: 2000000,
      provisions: 300000,
      enteredBy: 'EMP005',
      lastModifiedBy: 'EMP006',
      lastModified: '2025-07-29 14:20:00'
    },
    {
      companyId: 'COMP004',
      companyName: 'Digital Innovations Hub',
      capitalAccount: 8000000,
      openingBalance: 1500000,
      sales: 6500000,
      purchases: 2800000,
      directExpenses: 450000,
      indirectExpenses: 1800000,
      grossProfit: 3250000,
      netProfit: 1450000,
      stockInHand: 320000,
      cashInHand: 95000,
      bankBalance: 755000,
      sundryDebtors: 980000,
      sundryCreditors: 650000,
      currentAssets: 2150000,
      currentLiabilities: 1200000,
      fixedAssets: 5500000,
      investments: 180000,
      loans: 2200000,
      provisions: 280000,
      enteredBy: 'EMP007',
      lastModifiedBy: 'EMP002',
      lastModified: '2025-07-31 09:45:00'
    },
    {
      companyId: 'COMP005',
      companyName: 'Manufacturing Enterprises',
      capitalAccount: 15000000,
      openingBalance: 3200000,
      sales: 18500000,
      purchases: 11200000,
      directExpenses: 1800000,
      indirectExpenses: 3500000,
      grossProfit: 5500000,
      netProfit: 2000000,
      stockInHand: 4200000,
      cashInHand: 180000,
      bankBalance: 2220000,
      sundryDebtors: 2800000,
      sundryCreditors: 2100000,
      currentAssets: 9400000,
      currentLiabilities: 3800000,
      fixedAssets: 18000000,
      investments: 650000,
      loans: 6500000,
      provisions: 950000,
      enteredBy: 'EMP008',
      lastModifiedBy: 'EMP004',
      lastModified: '2025-07-30 16:10:00'
    },
    {
      companyId: 'COMP006',
      companyName: 'Retail Network Ltd',
      capitalAccount: 7000000,
      openingBalance: 1800000,
      sales: 14200000,
      purchases: 9800000,
      directExpenses: 950000,
      indirectExpenses: 2150000,
      grossProfit: 3450000,
      netProfit: 1300000,
      stockInHand: 3100000,
      cashInHand: 145000,
      bankBalance: 1255000,
      sundryDebtors: 1650000,
      sundryCreditors: 1320000,
      currentAssets: 6150000,
      currentLiabilities: 2580000,
      fixedAssets: 9500000,
      investments: 420000,
      loans: 3800000,
      provisions: 630000,
      enteredBy: 'EMP005',
      lastModifiedBy: 'EMP008',
      lastModified: '2025-07-31 12:30:00'
    }
  ], []);

  // Filtered data based on selected companies and employees
  const filteredFinancialData = useMemo(() => {
    let data = financialData;
    
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
  }, [financialData, filters.companies, filters.employees]);

  // Get employees with access to selected company
  const getCompanyUsers = (companyId: string) => {
    return employees.filter(emp => emp.accessibleCompanies.includes(companyId));
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

  // User access analysis
  const userAccessData = useMemo(() => {
    return employees.map(emp => ({
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
  }, [employees, companies, financialData]);

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
      companies: prev.companies.length === companies.length ? [] : companies.map(c => c.id)
    }));
  };

  const handleSelectAllEmployees = () => {
    setFilters(prev => ({
      ...prev,
      employees: prev.employees.length === employees.length ? [] : employees.map(e => e.id)
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
    <div className="pt-[56px] px-4 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/app/reports')}
            title="Back to Reports"
            className={`p-2 rounded-lg mr-3 transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center text-gray-900 dark:text-white">
              <Building2 className="mr-3 text-blue-600" size={32} />
              Multi-Company Consolidation Report
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive financial reporting across all group companies with employee access control
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
                ? 'bg-gray-800 hover:bg-gray-700' 
                : 'bg-white hover:bg-gray-100 shadow-sm'
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
                : (theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm')
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
                : (theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm')
            }`}
          >
            <Users size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => handleExport('excel')}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 shadow-sm'
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
        <div className={`p-6 rounded-xl mb-6 shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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
                    : 'bg-white border-gray-300 text-black'
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
                    checked={filters.companies.length === companies.length}
                    onChange={handleSelectAllCompanies}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">All Companies</span>
                </label>
                {companies.map((company) => (
                  <label key={company.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company.id)}
                      onChange={() => handleCompanyToggle(company.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{company.name} ({company.code})</span>
                    <span className="text-xs text-gray-500">
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
                    checked={filters.employees.length === employees.length}
                    onChange={handleSelectAllEmployees}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">All Employees</span>
                </label>
                {employees.map((employee) => (
                  <label key={employee.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.employees.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{employee.name}</span>
                    <span className="text-xs text-gray-500">
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
                    : 'bg-white border-gray-300 text-black'
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
        <div className={`p-6 rounded-xl mb-6 shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <Shield className="mr-2" size={20} />
            Employee Company Access Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th className="text-left p-3 font-semibold">Employee</th>
                  <th className="text-left p-3 font-semibold">Role</th>
                  <th className="text-left p-3 font-semibold">Accessible Companies</th>
                  <th className="text-right p-3 font-semibold">Total Sales Access</th>
                  <th className="text-right p-3 font-semibold">Total Profit Access</th>
                  <th className="text-center p-3 font-semibold">Last Login</th>
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
                        user.role.includes('Admin') ? 'bg-red-100 text-red-800' :
                        user.role.includes('Manager') ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
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
          { id: 'comparison', label: 'Comparison', icon: <Package size={16} /> }
        ] as const).map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedView === view.id
                ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                : (theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700 shadow-sm')
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
          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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
          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Sales & Profit by Company
            </h3>
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

          {/* Profit Trend Chart */}
          <div className={`p-6 rounded-xl shadow-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Monthly Profit Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value * 10000)} />
                <Legend />
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
      <div className={`rounded-xl shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Summary View */}
        {selectedView === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } sticky top-0`}>
                <tr>
                  <th className="text-left p-4 font-semibold">Company</th>
                  <th className="text-right p-4 font-semibold">Sales</th>
                  <th className="text-right p-4 font-semibold">Net Profit</th>
                  <th className="text-right p-4 font-semibold">Assets</th>
                  <th className="text-right p-4 font-semibold">Cash & Bank</th>
                  <th className="text-center p-4 font-semibold">Entered By</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinancialData.map((company) => (
                  <tr key={company.companyId} className={`border-b transition-colors ${
                    theme === 'dark' 
                      ? 'border-gray-700 hover:bg-gray-750' 
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
                      user.role.includes('Admin') ? 'bg-red-100 text-red-800' :
                      user.role.includes('Manager') ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
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
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <RefreshCw className="animate-spin text-blue-600" size={24} />
              <span className="text-gray-900 dark:text-white">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-8 p-4 rounded-xl ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
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
