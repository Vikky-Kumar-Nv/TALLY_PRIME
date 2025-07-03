import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Download, Printer } from 'lucide-react';

// Types - keeping everything in this file as requested
interface VoucherEntryLine {
  id: string;
  ledgerId?: string;
  amount: number;
  type: 'debit' | 'credit';
  narration?: string;
}

interface VoucherEntry {
  id: string;
  number: string;
  type: string;
  date: string;
  referenceNo?: string;
  narration?: string;
  entries: VoucherEntryLine[];
}

const PaymentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<VoucherEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // New state for Change View functionality
  const [viewType, setViewType] = useState<'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Half-yearly'>('Daily');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showMonthList, setShowMonthList] = useState(false);

  // Generate mock payment vouchers - self-contained data
  const generateMockPaymentVouchers = (): VoucherEntry[] => {
    const mockData: VoucherEntry[] = [];
    for (let i = 1; i <= 25; i++) {
      const lines: VoucherEntryLine[] = [
        {
          id: `line-${i}-1`,
          ledgerId: `cash-${i}`,
          amount: 1000 + (i * 150),
          type: 'credit',
          narration: `Cash payment ${i}`,
        },
        {
          id: `line-${i}-2`,
          ledgerId: `expense-${i}`,
          amount: 1000 + (i * 150),
          type: 'debit',
          narration: `Expense account ${i}`,
        }
      ];

      mockData.push({
        id: `payment-${i}`,
        number: `PMT-${String(i).padStart(4, '0')}`,
        type: 'payment',
        date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        referenceNo: i % 3 === 0 ? `REF-PMT-${i}` : undefined,
        narration: `Payment voucher ${i} - Office expenses`,
        entries: lines
      });
    }
    return mockData;
  };

  // Helper functions - all self-contained
  const hasPermission = (action: string): boolean => {
    const userRole = 'admin';
    const permissions = {
      admin: ['add', 'edit', 'delete', 'view', 'export', 'print'],
      user: ['view', 'export'],
      viewer: ['view']
    };
    return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
  };

  const getVoucherStatus = (voucher: VoucherEntry): string => {
    if (!voucher.referenceNo) return 'draft';
    const totalAmount = voucher.entries.reduce((sum, entry) => sum + entry.amount, 0);
    if (totalAmount > 5000) return 'approved';
    return 'pending';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate debit and credit amounts from entries
  const calculateDebitCredit = (voucher: VoucherEntry): { debit: number; credit: number } => {
    const debit = voucher.entries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    const credit = voucher.entries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    return { debit, credit };
  };

  // Get particulars (ledger details) from entries
  const getParticulars = (voucher: VoucherEntry): string => {
    const ledgerNames = voucher.entries.map(entry => {
      const ledgerType = entry.ledgerId?.split('-')[0] || 'Unknown';
      const ledgerNumber = entry.ledgerId?.split('-')[1] || '0';
      return `${ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1)} A/c ${ledgerNumber}`;
    });
    return ledgerNames.join(', ');
  };

  // Get available months
  const getAvailableMonths = (): { value: string; label: string }[] => {
    return [
      { value: '01', label: 'January' }, { value: '02', label: 'February' },
      { value: '03', label: 'March' }, { value: '04', label: 'April' },
      { value: '05', label: 'May' }, { value: '06', label: 'June' },
      { value: '07', label: 'July' }, { value: '08', label: 'August' },
      { value: '09', label: 'September' }, { value: '10', label: 'October' },
      { value: '11', label: 'November' }, { value: '12', label: 'December' }
    ];
  };

  // Filter vouchers by date range based on view type
  const filterVouchersByView = (vouchers: VoucherEntry[]): VoucherEntry[] => {
    if (!viewType || viewType === 'Daily') return vouchers;

    const today = new Date();
    let startDate: Date;

    switch (viewType) {
      case 'Weekly':
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case 'Fortnightly':
        startDate = new Date(today.setDate(today.getDate() - 14));
        break;
      case 'Monthly': {
        if (selectedMonth) {
          return vouchers.filter(voucher => {
            const voucherMonth = voucher.date.split('-')[1];
            return voucherMonth === selectedMonth;
          });
        } else {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        break;
      }
      case 'Quarterly': {
        const currentQuarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        break;
      }
      case 'Half-yearly': {
        const currentHalf = Math.floor(today.getMonth() / 6);
        startDate = new Date(today.getFullYear(), currentHalf * 6, 1);
        break;
      }
      default:
        return vouchers;
    }

    if (viewType !== 'Monthly' || !selectedMonth) {
      return vouchers.filter(voucher => {
        const voucherDate = new Date(voucher.date);
        return voucherDate >= startDate;
      });
    }

    return vouchers;
  };

  // Initialize mock data
  useEffect(() => {
    const mockVouchers = generateMockPaymentVouchers();
    setVouchers(mockVouchers);
    setLoading(false);
  }, []);

  // Filter vouchers based on search, filters, and view type
  const filteredVouchers = (() => {
    const viewFilteredVouchers = filterVouchersByView(vouchers);
    
    return viewFilteredVouchers.filter(voucher => {
      const matchesSearch = voucher.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (voucher.referenceNo && voucher.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDate = !dateFilter || voucher.date === dateFilter;
      
      const voucherStatus = getVoucherStatus(voucher);
      const matchesStatus = !statusFilter || voucherStatus === statusFilter;
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  })();

  // Pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVouchers = filteredVouchers.slice(startIndex, startIndex + itemsPerPage);

  // Calculate summary statistics
  const totalDebit = filteredVouchers.reduce((sum, voucher) => sum + calculateDebitCredit(voucher).debit, 0);
  const totalCredit = filteredVouchers.reduce((sum, voucher) => sum + calculateDebitCredit(voucher).credit, 0);
  const statusCounts = filteredVouchers.reduce((acc, voucher) => {
    const status = getVoucherStatus(voucher);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    if (!hasPermission('export')) {
      alert('You do not have permission to export data');
      return;
    }

    const csvContent = [
      ['Date', 'Voucher Number', 'Voucher Type', 'Particulars', 'Debit Amount', 'Credit Amount', 'Status'].join(','),
      ...filteredVouchers.map(voucher => {
        const { debit, credit } = calculateDebitCredit(voucher);
        const particulars = getParticulars(voucher);
        return [
          voucher.date,
          voucher.number,
          voucher.type.toUpperCase(),
          `"${particulars}"`,
          debit.toString(),
          credit.toString(),
          getVoucherStatus(voucher)
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payment_Register_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!hasPermission('print')) {
      alert('You do not have permission to print');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>Payment Register</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payment Register</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>View Type: ${viewType}${selectedMonth ? ` - ${getAvailableMonths().find(m => m.value === selectedMonth)?.label || 'Unknown Month'}` : ''}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Voucher No</th>
                <th>Voucher Type</th>
                <th>Particulars</th>
                <th class="text-right">Debit Amount</th>
                <th class="text-right">Credit Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredVouchers.map(voucher => {
                const { debit, credit } = calculateDebitCredit(voucher);
                const particulars = getParticulars(voucher);
                return `
                <tr>
                  <td>${voucher.date}</td>
                  <td>${voucher.number}</td>
                  <td>${voucher.type.toUpperCase()}</td>
                  <td>${particulars}</td>
                  <td class="text-right">${debit > 0 ? formatCurrency(debit) : '-'}</td>
                  <td class="text-right">${credit > 0 ? formatCurrency(credit) : '-'}</td>
                  <td>${getVoucherStatus(voucher)}</td>
                </tr>`;
              }).join('')}
            </tbody>
            <tfoot>
              <tr class="font-bold">
                <td colspan="4">Total (${filteredVouchers.length} vouchers)</td>
                <td class="text-right">${formatCurrency(totalDebit)}</td>
                <td class="text-right">${formatCurrency(totalCredit)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-[56px] px-4 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/app/voucher-register')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-3"
              title="Back to Voucher Register"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="mr-3 text-red-600" size={28} />
              Payment Register
            </h1>
          </div>
          {hasPermission('add') && (
            <button
              onClick={() => navigate('/app/vouchers/payment')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              title="Add new payment voucher"
            >
              Add New Payment
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Vouchers</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredVouchers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Debit</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDebit)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Total Credit</h3>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold text-green-600">{statusCounts.approved || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="change-view" className="block text-sm font-medium text-gray-700 mb-1">
              Change View
            </label>
            <select
              id="change-view"
              value={viewType}
              onChange={(e) => {
                const newViewType = e.target.value as typeof viewType;
                setViewType(newViewType);
                if (newViewType === 'Monthly') {
                  setShowMonthList(true);
                } else {
                  setShowMonthList(false);
                  setSelectedMonth('');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-yearly">Half-yearly</option>
            </select>
          </div>
          {viewType === 'Monthly' && showMonthList && (
            <div>
              <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Current Month</option>
                {getAvailableMonths().map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Date Filter
            </label>
            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Filter vouchers by status"
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            {hasPermission('export') && (
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                title="Export vouchers to Excel"
              >
                <Download size={16} className="mr-1" />
                Export
              </button>
            )}
            {hasPermission('print') && (
              <button
                onClick={handlePrint}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                title="Print voucher register"
              >
                <Printer size={16} className="mr-1" />
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vouchers Table - Tally Style */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voucher No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voucher Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Particulars
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVouchers.map((voucher) => {
                const status = getVoucherStatus(voucher);
                const { debit, credit } = calculateDebitCredit(voucher);
                const particulars = getParticulars(voucher);
                return (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {voucher.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {voucher.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        PAYMENT
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={particulars}>
                      {particulars}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {debit > 0 ? formatCurrency(debit) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {credit > 0 ? formatCurrency(credit) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {hasPermission('view') && (
                          <button
                            onClick={() => console.log('View voucher:', voucher.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View voucher"
                          >
                            View
                          </button>
                        )}
                        {hasPermission('edit') && (
                          <button
                            onClick={() => console.log('Edit voucher:', voucher.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit voucher"
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission('delete') && (
                          <button
                            onClick={() => console.log('Delete voucher:', voucher.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete voucher"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Summary Row - Tally Style */}
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Total ({filteredVouchers.length} vouchers)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                  {formatCurrency(totalDebit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                  {formatCurrency(totalCredit)}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredVouchers.length)}</span> of{' '}
                  <span className="font-medium">{filteredVouchers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payment vouchers found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or change the view type.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRegister;
