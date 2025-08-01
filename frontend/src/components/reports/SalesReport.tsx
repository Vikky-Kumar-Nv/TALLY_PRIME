import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Filter, 
  Eye,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  User,
  Grid3X3
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface SalesData {
  id: string;
  voucherNo: string;
  voucherType: string;
  date: string;
  partyName: string;
  partyGSTIN?: string;
  billAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  totalTaxAmount: number;
  netAmount: number;
  itemDetails: {
    itemName: string;
    hsnCode: string;
    quantity: number;
    rate: number;
    amount: number;
    discount?: number;
  }[];
  paymentTerms?: string;
  dueDate?: string;
  status: 'Paid' | 'Unpaid' | 'Partially Paid' | 'Overdue';
  reference?: string;
  narration?: string;
}

interface FilterState {
  dateRange: string;
  fromDate: string;
  toDate: string;
  partyFilter: string;
  itemFilter: string;
  voucherTypeFilter: string;
  statusFilter: string;
  amountRangeMin: string;
  amountRangeMax: string;
}

interface PartyGroup {
  partyName: string;
  partyGSTIN?: string;
  totalAmount: number;
  totalTax: number;
  transactionCount: number;
  transactions: SalesData[];
}

interface ItemGroup {
  itemName: string;
  hsnCode: string;
  totalQuantity: number;
  totalAmount: number;
  transactionCount: number;
  averageRate: number;
}

const SalesReport: React.FC = () => {
  const { theme, vouchers = [], ledgers = [], stockItems = [] } = useAppContext();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedView, setSelectedView] = useState<'summary' | 'detailed' | 'itemwise' | 'partywise'>('summary');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'this-month',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    partyFilter: '',
    itemFilter: '',
    voucherTypeFilter: '',
    statusFilter: '',
    amountRangeMin: '',
    amountRangeMax: ''
  });
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SalesData;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  
  const [selectedSale, setSelectedSale] = useState<SalesData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Process vouchers to extract sales data
  const salesData = useMemo((): SalesData[] => {
    const salesVouchers = vouchers.filter(voucher => 
      voucher.type === 'sales' || 
      voucher.mode === 'item-invoice' || 
      voucher.mode === 'sales-order'
    );

    return salesVouchers.map(voucher => {
      const party = ledgers.find(l => l.id === voucher.partyId);
      const itemDetails = voucher.entries?.map(entry => {
        const item = stockItems.find(i => i.id === entry.itemId);
        return {
          itemName: item?.name || 'Unknown Item',
          hsnCode: entry.hsnCode || item?.hsnCode || '',
          quantity: entry.quantity || 0,
          rate: entry.rate || 0,
          amount: entry.amount || 0,
          discount: entry.discount || 0
        };
      }).filter(item => item.quantity > 0) || [];

      const taxableAmount = itemDetails.reduce((sum, item) => sum + item.amount - (item.discount || 0), 0);
      const cgstAmount = voucher.entries?.reduce((sum, entry) => sum + ((entry.cgstRate || 0) * (entry.amount || 0)) / 100, 0) || 0;
      const sgstAmount = voucher.entries?.reduce((sum, entry) => sum + ((entry.sgstRate || 0) * (entry.amount || 0)) / 100, 0) || 0;
      const igstAmount = voucher.entries?.reduce((sum, entry) => sum + ((entry.igstRate || 0) * (entry.amount || 0)) / 100, 0) || 0;
      const cessAmount = 0; // Placeholder for cess calculation as cessRate is not available
      const totalTaxAmount = cgstAmount + sgstAmount + igstAmount + cessAmount;
      const netAmount = taxableAmount + totalTaxAmount;

      // Determine payment status (mock logic)
      const getPaymentStatus = (): 'Paid' | 'Unpaid' | 'Partially Paid' | 'Overdue' => {
        const today = new Date();
        const voucherDate = new Date(voucher.date);
        const daysDiff = Math.floor((today.getTime() - voucherDate.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff > 30) return 'Overdue';
        if (daysDiff > 15) return 'Unpaid';
        if (Math.random() > 0.7) return 'Paid';
        return Math.random() > 0.5 ? 'Partially Paid' : 'Unpaid';
      };

      return {
        id: voucher.id,
        voucherNo: voucher.number || 'N/A',
        voucherType: voucher.mode || voucher.type || 'Sales',
        date: voucher.date,
        partyName: party?.name || 'Unknown Party',
        partyGSTIN: party?.gstNumber,
        billAmount: netAmount,
        taxableAmount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        cessAmount,
        totalTaxAmount,
        netAmount,
        itemDetails,
        status: getPaymentStatus(),
        reference: voucher.referenceNo,
        narration: voucher.narration
      };
    });
  }, [vouchers, ledgers, stockItems]);

  // Filter sales data based on applied filters
  const filteredSalesData = useMemo(() => {
    return salesData.filter(sale => {
      // Date filter
      const saleDate = new Date(sale.date);
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      
      if (saleDate < fromDate || saleDate > toDate) return false;
      
      // Party filter
      if (filters.partyFilter && !sale.partyName.toLowerCase().includes(filters.partyFilter.toLowerCase())) {
        return false;
      }
      
      // Item filter
      if (filters.itemFilter && !sale.itemDetails.some(item => 
        item.itemName.toLowerCase().includes(filters.itemFilter.toLowerCase())
      )) {
        return false;
      }
      
      // Voucher type filter
      if (filters.voucherTypeFilter && sale.voucherType !== filters.voucherTypeFilter) {
        return false;
      }
      
      // Status filter
      if (filters.statusFilter && sale.status !== filters.statusFilter) {
        return false;
      }
      
      // Amount range filter
      if (filters.amountRangeMin && sale.netAmount < parseFloat(filters.amountRangeMin)) {
        return false;
      }
      if (filters.amountRangeMax && sale.netAmount > parseFloat(filters.amountRangeMax)) {
        return false;
      }
      
      return true;
    });
  }, [salesData, filters]);

  // Sort filtered data
  const sortedSalesData = useMemo(() => {
    return [...filteredSalesData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredSalesData, sortConfig]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalSales = filteredSalesData.reduce((sum, sale) => sum + sale.netAmount, 0);
    const totalTaxableAmount = filteredSalesData.reduce((sum, sale) => sum + sale.taxableAmount, 0);
    const totalTaxAmount = filteredSalesData.reduce((sum, sale) => sum + sale.totalTaxAmount, 0);
    const totalQuantity = filteredSalesData.reduce((sum, sale) => 
      sum + sale.itemDetails.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    const statusCounts = filteredSalesData.reduce((acc, sale) => {
      acc[sale.status] = (acc[sale.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSales,
      totalTaxableAmount,
      totalTaxAmount,
      totalTransactions: filteredSalesData.length,
      totalQuantity,
      averageSale: totalSales / (filteredSalesData.length || 1),
      statusCounts
    };
  }, [filteredSalesData]);

  // Group data for different views
  const groupedData = useMemo(() => {
    if (selectedView === 'partywise') {
      const partyGroups = filteredSalesData.reduce((acc, sale) => {
        const key = sale.partyName;
        if (!acc[key]) {
          acc[key] = {
            partyName: sale.partyName,
            partyGSTIN: sale.partyGSTIN,
            totalAmount: 0,
            totalTax: 0,
            transactionCount: 0,
            transactions: []
          };
        }
        acc[key].totalAmount += sale.netAmount;
        acc[key].totalTax += sale.totalTaxAmount;
        acc[key].transactionCount += 1;
        acc[key].transactions.push(sale);
        return acc;
      }, {} as Record<string, PartyGroup>);
      
      return Object.values(partyGroups);
    }
    
    if (selectedView === 'itemwise') {
      const itemGroups = filteredSalesData.reduce((acc, sale) => {
        sale.itemDetails.forEach(item => {
          const key = item.itemName;
          if (!acc[key]) {
            acc[key] = {
              itemName: item.itemName,
              hsnCode: item.hsnCode,
              totalQuantity: 0,
              totalAmount: 0,
              transactionCount: 0,
              averageRate: 0
            };
          }
          acc[key].totalQuantity += item.quantity;
          acc[key].totalAmount += item.amount;
          acc[key].transactionCount += 1;
        });
        return acc;
      }, {} as Record<string, ItemGroup>);
      
      // Calculate average rates
      Object.values(itemGroups).forEach((group: ItemGroup) => {
        group.averageRate = group.totalAmount / (group.totalQuantity || 1);
      });
      
      return Object.values(itemGroups);
    }
    
    return filteredSalesData;
  }, [filteredSalesData, selectedView]);

  const handleSort = (key: keyof SalesData) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDateRangeChange = (range: string) => {
    const today = new Date();
    let fromDate = '';
    let toDate = today.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        fromDate = toDate;
        break;
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = toDate = yesterday.toISOString().split('T')[0];
        break;
      }
      case 'this-week': {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        fromDate = weekStart.toISOString().split('T')[0];
        break;
      }
      case 'this-month': {
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        break;
      }
      case 'this-quarter': {
        const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3;
        fromDate = new Date(today.getFullYear(), quarterStartMonth, 1).toISOString().split('T')[0];
        break;
      }
      case 'this-year': {
        fromDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      }
      default:
        return;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: range,
      fromDate,
      toDate
    }));
  };

  const exportToExcel = () => {
    const exportData = sortedSalesData.map(sale => ({
      'Voucher No': sale.voucherNo,
      'Date': sale.date,
      'Party Name': sale.partyName,
      'Party GSTIN': sale.partyGSTIN || '',
      'Taxable Amount': sale.taxableAmount,
      'CGST Amount': sale.cgstAmount,
      'SGST Amount': sale.sgstAmount,
      'IGST Amount': sale.igstAmount,
      'Total Tax': sale.totalTaxAmount,
      'Net Amount': sale.netAmount,
      'Status': sale.status,
      'Reference': sale.reference || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    XLSX.writeFile(wb, `Sales_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Unpaid': return 'text-red-600 bg-red-100';
      case 'Partially Paid': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewDetails = (sale: SalesData) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedSale(null);
  };

  return (
    <div className={`min-h-screen pt-[56px] ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/app/reports')}
              className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Go back to reports"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Sales Report</h1>
              <p className="text-sm opacity-70">Comprehensive sales analysis and reporting</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Filters"
            >
              <Filter size={18} />
            </button>
            <button
              onClick={exportToExcel}
              className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Export to Excel"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => window.print()}
              className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              title="Print"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { key: 'summary', label: 'Summary', icon: <BarChart3 size={16} /> },
            { key: 'detailed', label: 'Detailed', icon: <FileText size={16} /> },
            { key: 'itemwise', label: 'Item-wise', icon: <Package size={16} /> },
            { key: 'partywise', label: 'Party-wise', icon: <User size={16} /> }
          ].map(view => (
            <button
              key={view.key}
              onClick={() => setSelectedView(view.key as 'summary' | 'detailed' | 'itemwise' | 'partywise')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedView === view.key
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                title="Select Date Range"
                value={filters.dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input
                type="date"
                title="Select From Date"
                value={filters.fromDate}
                onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                title="Select To Date"
                value={filters.toDate}
                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              />
            </div>

            {/* Party Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Party</label>
              <input
                type="text"
                placeholder="Search party..."
                value={filters.partyFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, partyFilter: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                title="Select Status Filter"
                value={filters.statusFilter}
                onChange={(e) => setFilters(prev => ({ ...prev, statusFilter: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium mb-1">Min Amount</label>
              <input
                type="number"
                placeholder="Min amount..."
                value={filters.amountRangeMin}
                onChange={(e) => setFilters(prev => ({ ...prev, amountRangeMin: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Max Amount</label>
              <input
                type="number"
                placeholder="Max amount..."
                value={filters.amountRangeMax}
                onChange={(e) => setFilters(prev => ({ ...prev, amountRangeMax: e.target.value }))}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none`}
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  dateRange: 'this-month',
                  fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                  toDate: new Date().toISOString().split('T')[0],
                  partyFilter: '',
                  itemFilter: '',
                  voucherTypeFilter: '',
                  statusFilter: '',
                  amountRangeMin: '',
                  amountRangeMax: ''
                })}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500 border-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                } transition-colors`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4" ref={printRef}>
        {/* Summary Statistics */}
        {selectedView === 'summary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalSales)}</p>
                </div>
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryStats.totalTransactions}</p>
                </div>
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Average Sale</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(summaryStats.averageSale)}</p>
                </div>
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Total Tax</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(summaryStats.totalTaxAmount)}</p>
                </div>
                <Grid3X3 className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        )}

        {/* Status Distribution for Summary */}
        {selectedView === 'summary' && (
          <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h3 className="text-lg font-semibold mb-4">Payment Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summaryStats.statusCounts).map(([status, count]) => (
                <div key={status} className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                    {status}: {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <div className="overflow-x-auto">
            {selectedView === 'detailed' && (
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th 
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-opacity-75"
                      onClick={() => handleSort('voucherNo')}
                    >
                      Voucher No {sortConfig.key === 'voucherNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-opacity-75"
                      onClick={() => handleSort('date')}
                    >
                      Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-opacity-75"
                      onClick={() => handleSort('partyName')}
                    >
                      Party Name {sortConfig.key === 'partyName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Party GSTIN</th>
                    <th 
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-opacity-75"
                      onClick={() => handleSort('taxableAmount')}
                    >
                      Taxable Amount {sortConfig.key === 'taxableAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-right font-medium">CGST</th>
                    <th className="px-4 py-3 text-right font-medium">SGST</th>
                    <th className="px-4 py-3 text-right font-medium">IGST</th>
                    <th 
                      className="px-4 py-3 text-right font-medium cursor-pointer hover:bg-opacity-75"
                      onClick={() => handleSort('netAmount')}
                    >
                      Net Amount {sortConfig.key === 'netAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSalesData.map((sale) => (
                    <tr key={sale.id} className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 font-mono text-sm">{sale.voucherNo}</td>
                      <td className="px-4 py-3 text-sm">{new Date(sale.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm font-medium">{sale.partyName}</td>
                      <td className="px-4 py-3 text-sm font-mono">{sale.partyGSTIN || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(sale.taxableAmount)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(sale.cgstAmount)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(sale.sgstAmount)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono">{formatCurrency(sale.igstAmount)}</td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-semibold">{formatCurrency(sale.netAmount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => handleViewDetails(sale)}
                          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <tr className="font-semibold">
                    <td colSpan={4} className="px-4 py-3">Total ({filteredSalesData.length} transactions)</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(summaryStats.totalTaxableAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.cgstAmount, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.sgstAmount, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.igstAmount, 0))}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{formatCurrency(summaryStats.totalSales)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            )}

            {selectedView === 'partywise' && (
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Party Name</th>
                    <th className="px-4 py-3 text-left font-medium">GSTIN</th>
                    <th className="px-4 py-3 text-right font-medium">Total Amount</th>
                    <th className="px-4 py-3 text-right font-medium">Total Tax</th>
                    <th className="px-4 py-3 text-center font-medium">Transactions</th>
                    <th className="px-4 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(groupedData as PartyGroup[]).map((party, index) => (
                    <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 font-medium">{party.partyName}</td>
                      <td className="px-4 py-3 font-mono text-sm">{party.partyGSTIN || '-'}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(party.totalAmount)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(party.totalTax)}</td>
                      <td className="px-4 py-3 text-center">{party.transactionCount}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="View Transactions"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedView === 'itemwise' && (
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Item Name</th>
                    <th className="px-4 py-3 text-left font-medium">HSN Code</th>
                    <th className="px-4 py-3 text-right font-medium">Total Quantity</th>
                    <th className="px-4 py-3 text-right font-medium">Average Rate</th>
                    <th className="px-4 py-3 text-right font-medium">Total Amount</th>
                    <th className="px-4 py-3 text-center font-medium">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {(groupedData as ItemGroup[]).map((item, index) => (
                    <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 font-medium">{item.itemName}</td>
                      <td className="px-4 py-3 font-mono text-sm">{item.hsnCode}</td>
                      <td className="px-4 py-3 text-right font-mono">{item.totalQuantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.averageRate)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(item.totalAmount)}</td>
                      <td className="px-4 py-3 text-center">{item.transactionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className={`mt-4 p-3 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="text-sm text-center opacity-70">
            Showing {filteredSalesData.length} of {salesData.length} sales transactions
            {filters.dateRange !== 'custom' && ` for ${filters.dateRange.replace('-', ' ')}`}
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Sales Transaction Details</h2>
                <button
                  onClick={closeModal}
                  className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Transaction Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Voucher No:</span>
                      <span className="font-mono">{selectedSale.voucherNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{new Date(selectedSale.date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{selectedSale.voucherType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSale.status)}`}>
                        {selectedSale.status}
                      </span>
                    </div>
                    {selectedSale.reference && (
                      <div className="flex justify-between">
                        <span className="font-medium">Reference:</span>
                        <span>{selectedSale.reference}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Party Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Party Name:</span>
                      <span>{selectedSale.partyName}</span>
                    </div>
                    {selectedSale.partyGSTIN && (
                      <div className="flex justify-between">
                        <span className="font-medium">GSTIN:</span>
                        <span className="font-mono">{selectedSale.partyGSTIN}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amount Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm opacity-70">Taxable Amount</div>
                    <div className="font-mono font-semibold">{formatCurrency(selectedSale.taxableAmount)}</div>
                  </div>
                  <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm opacity-70">CGST</div>
                    <div className="font-mono font-semibold">{formatCurrency(selectedSale.cgstAmount)}</div>
                  </div>
                  <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm opacity-70">SGST</div>
                    <div className="font-mono font-semibold">{formatCurrency(selectedSale.sgstAmount)}</div>
                  </div>
                  <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-sm opacity-70">IGST</div>
                    <div className="font-mono font-semibold">{formatCurrency(selectedSale.igstAmount)}</div>
                  </div>
                </div>
                <div className={`mt-4 p-4 rounded border-2 ${theme === 'dark' ? 'bg-gray-700 border-green-600' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Amount:</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(selectedSale.netAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              {selectedSale.itemDetails.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Item Details</h3>
                  <div className="overflow-x-auto">
                    <table className={`w-full border rounded ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                      <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <tr>
                          <th className="px-3 py-2 text-left">Item Name</th>
                          <th className="px-3 py-2 text-left">HSN Code</th>
                          <th className="px-3 py-2 text-right">Quantity</th>
                          <th className="px-3 py-2 text-right">Rate</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSale.itemDetails.map((item, index) => (
                          <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                            <td className="px-3 py-2">{item.itemName}</td>
                            <td className="px-3 py-2 font-mono text-sm">{item.hsnCode}</td>
                            <td className="px-3 py-2 text-right font-mono">{item.quantity}</td>
                            <td className="px-3 py-2 text-right font-mono">{formatCurrency(item.rate)}</td>
                            <td className="px-3 py-2 text-right font-mono">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Narration */}
              {selectedSale.narration && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Narration</h3>
                  <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    {selectedSale.narration}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
