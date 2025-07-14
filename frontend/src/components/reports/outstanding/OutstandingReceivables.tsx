import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { 
  Search, Download, Users, AlertTriangle, 
  TrendingUp, Target, Eye, Mail, Phone
} from 'lucide-react';

interface CustomerOutstanding {
  id: string;
  customerName: string;
  customerGroup: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGSTIN?: string;
  totalOutstanding: number;
  currentDue: number;
  overdue: number;
  creditLimit: number;
  creditDays: number;
  lastPayment?: {
    date: string;
    amount: number;
  };
  oldestBillDate: string;
  totalBills: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  ageingBreakdown: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
}

const OutstandingReceivables: React.FC = () => {
  const { theme } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'overdue' | 'customer' | 'risk'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - यह actual API से आएगा
  const customersData: CustomerOutstanding[] = useMemo(() => [
    {
      id: '1',
      customerName: 'ABC Industries Ltd',
      customerGroup: 'Sundry Debtors',
      customerAddress: '123 Business District, Mumbai, Maharashtra 400001',
      customerPhone: '+91 9876543210',
      customerEmail: 'finance@abcindustries.com',
      customerGSTIN: '27ABCIN1234K1Z5',
      totalOutstanding: 285000,
      currentDue: 185000,
      overdue: 100000,
      creditLimit: 500000,
      creditDays: 30,
      lastPayment: {
        date: '2024-11-20',
        amount: 150000
      },
      oldestBillDate: '2024-09-15',
      totalBills: 8,
      riskCategory: 'Medium',
      ageingBreakdown: {
        '0-30': 185000,
        '31-60': 50000,
        '61-90': 30000,
        '90+': 20000
      }
    },
    {
      id: '2',
      customerName: 'XYZ Trading Co',
      customerGroup: 'Sundry Debtors',
      customerAddress: '456 Market Street, Delhi, Delhi 110001',
      customerPhone: '+91 9988776655',
      customerEmail: 'accounts@xyztrading.com',
      customerGSTIN: '07XYZTR5678B2C3',
      totalOutstanding: 450000,
      currentDue: 250000,
      overdue: 200000,
      creditLimit: 600000,
      creditDays: 45,
      lastPayment: {
        date: '2024-10-15',
        amount: 300000
      },
      oldestBillDate: '2024-08-10',
      totalBills: 12,
      riskCategory: 'High',
      ageingBreakdown: {
        '0-30': 250000,
        '31-60': 100000,
        '61-90': 75000,
        '90+': 25000
      }
    },
    {
      id: '3',
      customerName: 'Tech Solutions Pvt Ltd',
      customerGroup: 'Sundry Debtors',
      customerAddress: '789 IT Park, Bangalore, Karnataka 560001',
      customerPhone: '+91 8877665544',
      customerEmail: 'billing@techsolutions.com',
      customerGSTIN: '29TECHS1234D4E5',
      totalOutstanding: 125000,
      currentDue: 125000,
      overdue: 0,
      creditLimit: 300000,
      creditDays: 30,
      lastPayment: {
        date: '2024-12-01',
        amount: 75000
      },
      oldestBillDate: '2024-11-20',
      totalBills: 4,
      riskCategory: 'Low',
      ageingBreakdown: {
        '0-30': 125000,
        '31-60': 0,
        '61-90': 0,
        '90+': 0
      }
    },
    {
      id: '4',
      customerName: 'Global Enterprises',
      customerGroup: 'Sundry Debtors',
      customerAddress: '321 Export House, Chennai, Tamil Nadu 600001',
      customerPhone: '+91 7766554433',
      customerEmail: 'payments@globalent.com',
      customerGSTIN: '33GLOBA1234F6G7',
      totalOutstanding: 620000,
      currentDue: 220000,
      overdue: 400000,
      creditLimit: 800000,
      creditDays: 60,
      lastPayment: {
        date: '2024-09-25',
        amount: 180000
      },
      oldestBillDate: '2024-07-05',
      totalBills: 15,
      riskCategory: 'Critical',
      ageingBreakdown: {
        '0-30': 220000,
        '31-60': 150000,
        '61-90': 125000,
        '90+': 125000
      }
    }
  ], []);

  // Filtering and sorting logic
  const filteredData = useMemo(() => {
    const filtered = customersData.filter(customer => {
      const matchesSearch = !searchTerm || 
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerGSTIN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGroup = !selectedGroup || customer.customerGroup === selectedGroup;
      const matchesRisk = !selectedRisk || customer.riskCategory === selectedRisk;
      
      return matchesSearch && matchesGroup && matchesRisk;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'amount':
          comparison = a.totalOutstanding - b.totalOutstanding;
          break;
        case 'overdue':
          comparison = a.overdue - b.overdue;
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'risk': {
          const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
          comparison = riskOrder[a.riskCategory] - riskOrder[b.riskCategory];
          break;
        }
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [customersData, searchTerm, selectedGroup, selectedRisk, sortBy, sortOrder]);

  // Summary calculations
  const summaryData = useMemo(() => {
    const total = filteredData.reduce((sum, customer) => sum + customer.totalOutstanding, 0);
    const overdue = filteredData.reduce((sum, customer) => sum + customer.overdue, 0);
    const current = total - overdue;
    const totalCustomers = filteredData.length;
    
    const ageingBreakdown = {
      '0-30': filteredData.reduce((sum, c) => sum + c.ageingBreakdown['0-30'], 0),
      '31-60': filteredData.reduce((sum, c) => sum + c.ageingBreakdown['31-60'], 0),
      '61-90': filteredData.reduce((sum, c) => sum + c.ageingBreakdown['61-90'], 0),
      '90+': filteredData.reduce((sum, c) => sum + c.ageingBreakdown['90+'], 0)
    };

    return { total, overdue, current, totalCustomers, ageingBreakdown };
  }, [filteredData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAgeingColor = (bucket: string) => {
    switch (bucket) {
      case '0-30': return 'text-green-600 bg-green-100';
      case '31-60': return 'text-yellow-600 bg-yellow-100';
      case '61-90': return 'text-orange-600 bg-orange-100';
      case '90+': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Receivables Outstanding
            </h2>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Party-wise outstanding receivables summary - Tally Style
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Receivables
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(summaryData.total)}
                </p>
              </div>
              <TrendingUp className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overdue Amount
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                  {formatCurrency(summaryData.overdue)}
                </p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current Amount
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {formatCurrency(summaryData.current)}
                </p>
              </div>
              <Target className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Customers
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  {summaryData.totalCustomers}
                </p>
              </div>
              <Users className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>

        {/* Ageing Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(summaryData.ageingBreakdown).map(([bucket, amount]) => (
            <div key={bucket} className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAgeingColor(bucket)}`}>
                  {bucket} Days
                </span>
                <p className={`text-lg font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(amount)}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {((amount / summaryData.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Filters & Search
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search customers, GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            aria-label="Filter by customer group"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">All Groups</option>
            {Array.from(new Set(customersData.map(c => c.customerGroup))).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            aria-label="Filter by risk category"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">All Risk Categories</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'amount' | 'overdue' | 'customer' | 'risk')}
            aria-label="Sort by"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="amount">Sort by Amount</option>
            <option value="overdue">Sort by Overdue</option>
            <option value="customer">Sort by Customer</option>
            <option value="risk">Sort by Risk</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            className={`px-3 py-2 border rounded-lg transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Customer-wise Data Table */}
      <div className={`rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Customer-wise Outstanding Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Customer Details
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Outstanding Amount
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Ageing Analysis
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Credit Info
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredData.map((customer) => (
                <tr key={customer.id} className={`hover:bg-opacity-50 transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {customer.customerName}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {customer.customerGroup}
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <div>🏢 {customer.customerGSTIN}</div>
                        <div>📧 {customer.customerEmail}</div>
                        <div>📞 {customer.customerPhone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(customer.totalOutstanding)}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        Current: {formatCurrency(customer.currentDue)}
                      </div>
                      {customer.overdue > 0 && (
                        <div className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                          Overdue: {formatCurrency(customer.overdue)}
                        </div>
                      )}
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Bills: {customer.totalBills}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-1">
                      {Object.entries(customer.ageingBreakdown).map(([bucket, amount]) => 
                        amount > 0 && (
                          <div key={bucket} className="flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded ${getAgeingColor(bucket)}`}>
                              {bucket}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-1">
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Limit: {formatCurrency(customer.creditLimit)}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Days: {customer.creditDays}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(customer.riskCategory)}`}>
                        {customer.riskCategory}
                      </span>
                      {customer.lastPayment && (
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Last: {formatCurrency(customer.lastPayment.amount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        title="View Details"
                        aria-label="View customer details"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Send Email"
                        aria-label="Send email to customer"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        title="Call Customer"
                        aria-label="Call customer"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutstandingReceivables;
