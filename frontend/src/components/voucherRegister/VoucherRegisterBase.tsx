import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import type { VoucherEntry, VoucherEntryLine, VoucherType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import PrintOptions from '../vouchers/sales/PrintOptions';

interface VoucherRegisterBaseProps {
  title: string;
  voucherType: string;
  icon?: React.ReactElement;
  color?: string;
  description?: string;
  onAdd?: () => void;
  onEdit?: (voucher: VoucherEntry) => void;
  onDelete?: (id: string) => void;
  onView?: (voucher: VoucherEntry) => void;
}

// Mock data for demonstration
const generateMockVouchers = (type: string): VoucherEntry[] => {
  const mockData: VoucherEntry[] = [];
  const ledgerTypes = ['Cash', 'Bank', 'Sales', 'Purchase', 'Expense', 'Income', 'Assets', 'Liabilities'];
  
  // Customer names for sales vouchers
  const customerNames = [
    'ABC Enterprises', 'XYZ Pvt Ltd', 'Mahindra Corp', 'Tata Industries', 'Reliance Co',
    'Bharti Telecom', 'HDFC Bank', 'ICICI Ltd', 'Bajaj Finance', 'L&T Construction',
    'Wipro Systems', 'Infosys Ltd', 'TCS Solutions', 'HCL Tech', 'Tech Mahindra',
    'Aditya Birla', 'ITC Limited', 'Hindustan Unilever', 'Asian Paints', 'UltraTech Cement',
    'Maruti Suzuki', 'Hero MotoCorp', 'Bajaj Auto', 'TVS Motors', 'Royal Enfield'
  ];
  
  for (let i = 1; i <= 25; i++) {
    const debitLedger = ledgerTypes[i % ledgerTypes.length];
    const creditLedger = ledgerTypes[(i + 1) % ledgerTypes.length];
    
    let lines: VoucherEntryLine[];
    
    if (type === 'sales') {
      // For sales vouchers, create customer-based entries
      const customerName = customerNames[i % customerNames.length];
      lines = [
        {
          id: `line-${i}-1`,
          ledgerId: `customer-${i}`,
          amount: 1000 + (i * 150),
          type: 'debit',
          narration: `Sales to ${customerName}`,
        },
        {
          id: `line-${i}-2`,
          ledgerId: `sales-${i}`,
          amount: 1000 + (i * 150),
          type: 'credit',
          narration: `Sales Account`,
        }
      ];
    } else {
      // For other voucher types, use generic ledger names
      lines = [
        {
          id: `line-${i}-1`,
          ledgerId: `${debitLedger.toLowerCase()}-${i}`,
          amount: 1000 + (i * 150),
          type: 'debit',
          narration: `${debitLedger} account ${i}`,
        },
        {
          id: `line-${i}-2`,
          ledgerId: `${creditLedger.toLowerCase()}-${i}`,
          amount: 1000 + (i * 150),
          type: 'credit',
          narration: `${creditLedger} account ${i}`,
        }
      ];
    }

    const currentYear = new Date().getFullYear();
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String(((i % 28) + 1)).padStart(2, '0');

    mockData.push({
      id: `voucher-${i}`,
      number: `${type.toUpperCase()}-${String(i).padStart(4, '0')}`,
      type: type as VoucherType,
      date: `${currentYear}-${month}-${day}`,
      referenceNo: i % 3 === 0 ? `REF-${type.toUpperCase()}-${i}` : undefined,
      narration: type === 'sales' 
        ? `Sales to ${customerNames[i % customerNames.length]}` 
        : `${type} voucher ${i} - ${debitLedger} to ${creditLedger}`,
      entries: lines
    });
  }
  return mockData;
};

// Mock role-based access control
const hasPermission = (action: string): boolean => {
  // Mock implementation - in real app, this would check user permissions
  const userRole = 'admin'; // This would come from auth context
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

const VoucherRegisterBase: React.FC<VoucherRegisterBaseProps> = ({
  title,
  voucherType,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const [vouchers, setVouchers] = useState<VoucherEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherEntry | null>(null);
  
  // New state for Change View functionality
  const [viewType, setViewType] = useState<'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Half-yearly'>('Daily');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [showMonthList, setShowMonthList] = useState(false);

  // Initialize mock data
  useEffect(() => {
    try {
      const mockVouchers = generateMockVouchers(voucherType);
      setVouchers(mockVouchers);
    } catch (error) {
      console.error('Error generating mock vouchers:', error);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [voucherType]);

  // Helper function to calculate debit and credit amounts from entries
  const calculateDebitCredit = (voucher: VoucherEntry): { debit: number; credit: number } => {
    const debit = voucher.entries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    const credit = voucher.entries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    return { debit, credit };
  };

  // Helper function to get particulars (ledger details) from entries
  const getParticulars = (voucher: VoucherEntry): string => {
    if (voucherType === 'sales') {
      // For sales register, show customer/party names (debit entries in sales)
      const customerEntries = voucher.entries.filter(entry => entry.type === 'debit');
      const customerNames = customerEntries.map(entry => {
        if (!entry.ledgerId) return 'Cash Customer';
        
        const parts = entry.ledgerId.split('-');
        const ledgerType = parts[0] || 'Customer';
        const ledgerNumber = parts[1] || '0';
        
        // Customer names for sales vouchers
        const customerNamesList = [
          'ABC Enterprises', 'XYZ Pvt Ltd', 'Mahindra Corp', 'Tata Industries', 'Reliance Co',
          'Bharti Telecom', 'HDFC Bank', 'ICICI Ltd', 'Bajaj Finance', 'L&T Construction',
          'Wipro Systems', 'Infosys Ltd', 'TCS Solutions', 'HCL Tech', 'Tech Mahindra',
          'Aditya Birla', 'ITC Limited', 'Hindustan Unilever', 'Asian Paints', 'UltraTech Cement',
          'Maruti Suzuki', 'Hero MotoCorp', 'Bajaj Auto', 'TVS Motors', 'Royal Enfield'
        ];
        
        // For sales, show actual customer names
        if (ledgerType.toLowerCase() === 'customer') {
          const customerIndex = parseInt(ledgerNumber) - 1;
          return customerNamesList[customerIndex % customerNamesList.length] || `Customer ${ledgerNumber}`;
        } else if (ledgerType.toLowerCase() === 'cash') {
          return 'Cash Sale';
        } else {
          const formattedType = ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1);
          return `${formattedType} ${ledgerNumber}`;
        }
      });
      
      return customerNames.length > 0 ? customerNames.join(' / ') : 'Cash Sale';
    } else {
      // For other voucher types, show all ledger names
      const ledgerNames = voucher.entries.map(entry => {
        if (!entry.ledgerId) return 'Unknown Account';
        
        const parts = entry.ledgerId.split('-');
        const ledgerType = parts[0] || 'Unknown';
        const ledgerNumber = parts[1] || '0';
        
        // Capitalize first letter and format properly
        const formattedType = ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1);
        return `${formattedType} A/c ${ledgerNumber}`;
      });
      
      return ledgerNames.join(' / ');
    }
  };

  // Helper function to get available months from vouchers
  const getAvailableMonths = (): { value: string; label: string }[] => {
    const months = [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];
    return months;
  };

  // Helper function to filter vouchers by date range based on view type
  const filterVouchersByView = (vouchers: VoucherEntry[]): VoucherEntry[] => {
    if (!viewType || viewType === 'Daily') return vouchers;

    const today = new Date();
    let startDate: Date;

    switch (viewType) {
      case 'Weekly': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo;
        break;
      }
      case 'Fortnightly': {
        const fortnightAgo = new Date(today);
        fortnightAgo.setDate(fortnightAgo.getDate() - 14);
        startDate = fortnightAgo;
        break;
      }
      case 'Monthly': {
        if (selectedMonth) {
          // Filter by selected month
          return vouchers.filter(voucher => {
            const voucherMonth = voucher.date.split('-')[1];
            return voucherMonth === selectedMonth;
          });
        } else {
          // Show current month by default
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

  // Filter vouchers based on search, filters, and view type
  const filteredVouchers = (() => {
    try {
      // First apply view type filtering
      const viewFilteredVouchers = filterVouchersByView(vouchers);
      
      // Then apply other filters
      return viewFilteredVouchers.filter(voucher => {
        // Search filter
        const searchMatch = !searchTerm || 
          voucher.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (voucher.narration && voucher.narration.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (voucher.referenceNo && voucher.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Date filter
        const dateMatch = !dateFilter || voucher.date === dateFilter;
        
        // Status filter
        const voucherStatus = getVoucherStatus(voucher);
        const statusMatch = !statusFilter || voucherStatus === statusFilter;
        
        return searchMatch && dateMatch && statusMatch;
      });
    } catch (error) {
      console.error('Error filtering vouchers:', error);
      return [];
    }
  })();

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredVouchers.length / itemsPerPage));
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVouchers.length);
  const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

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

    try {
      if (filteredVouchers.length === 0) {
        alert('No data to export');
        return;
      }

      const csvContent = [
        // Always show both debit and credit columns for consistency
        ['Date', 'Voucher Number', 'Voucher Type', 'Particulars', 'Debit Amount', 'Credit Amount', 'Status'].join(','),
        ...filteredVouchers.map(voucher => {
          const { debit, credit } = calculateDebitCredit(voucher);
          const particulars = getParticulars(voucher).replace(/"/g, '""'); // Escape quotes
          const status = getVoucherStatus(voucher);
          
          if (voucherType === 'sales') {
            return [
              voucher.date,
              voucher.number,
              voucher.type.toUpperCase(),
              `"${particulars}"`,
              debit.toFixed(2),
              '0.00', // Sales only show debit amounts
              status
            ].join(',');
          } else {
            return [
              voucher.date,
              voucher.number,
              voucher.type.toUpperCase(),
              `"${particulars}"`,
              debit.toFixed(2),
              credit.toFixed(2),
              status
            ].join(',');
          }
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error occurred while exporting data');
    }
  };

  const handlePrint = () => {
    if (!hasPermission('print')) {
      alert('You do not have permission to print');
      return;
    }

    try {
      if (filteredVouchers.length === 0) {
        alert('No data to print');
        return;
      }

      const selectedMonthName = selectedMonth ? 
        getAvailableMonths().find(m => m.value === selectedMonth)?.label || 'Unknown Month' : '';

      const printContent = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .header { text-align: center; margin-bottom: 20px; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .text-center { text-align: center; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <p>Generated on: ${new Date().toLocaleString()}</p>
              <p>View Type: ${viewType}${selectedMonth ? ` - ${selectedMonthName}` : ''}</p>
              <p>Total Records: ${filteredVouchers.length}</p>
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
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredVouchers.map(voucher => {
                  const { debit, credit } = calculateDebitCredit(voucher);
                  const particulars = getParticulars(voucher);
                  if (voucherType === 'sales') {
                    return `
                    <tr>
                      <td>${voucher.date}</td>
                      <td>${voucher.number}</td>
                      <td>${voucher.type.toUpperCase()}</td>
                      <td>${particulars}</td>
                      <td class="text-right">${formatCurrency(debit)}</td>
                      <td class="text-right">-</td>
                      <td class="text-center">${getVoucherStatus(voucher)}</td>
                    </tr>`;
                  } else {
                    return `
                    <tr>
                      <td>${voucher.date}</td>
                      <td>${voucher.number}</td>
                      <td>${voucher.type.toUpperCase()}</td>
                      <td>${particulars}</td>
                      <td class="text-right">${debit > 0 ? formatCurrency(debit) : '-'}</td>
                      <td class="text-right">${credit > 0 ? formatCurrency(credit) : '-'}</td>
                      <td class="text-center">${getVoucherStatus(voucher)}</td>
                    </tr>`;
                  }
                }).join('')}
              </tbody>
              <tfoot>
                <tr class="font-bold">
                  <td colspan="4" class="text-right">Total (${filteredVouchers.length} vouchers)</td>
                  <td class="text-right">${formatCurrency(totalDebit)}</td>
                  <td class="text-right">${voucherType === 'sales' ? '-' : formatCurrency(totalCredit)}</td>
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
        printWindow.focus();
        printWindow.print();
      } else {
        alert('Please allow pop-ups to print the report');
      }
    } catch (error) {
      console.error('Error printing data:', error);
      alert('Error occurred while printing data');
    }
  };

  // Row-level print options handlers
  const openPrintOptions = (voucher: VoucherEntry) => {
    setSelectedVoucher(voucher);
    setShowPrintOptions(true);
  };

  const closePrintOptions = () => {
    setShowPrintOptions(false);
    setSelectedVoucher(null);
  };

  const printSingleVoucher = (voucher: VoucherEntry) => {
    try {
      const { debit, credit } = calculateDebitCredit(voucher);
      const particulars = getParticulars(voucher);
      const content = `
        <html>
          <head>
            <title>Invoice ${voucher.number}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 24px; }
              h1 { margin: 0 0 8px 0; }
              .muted { color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f7f7f7; }
              .right { text-align: right; }
            </style>
          </head>
          <body>
            <h1>Invoice</h1>
            <div class="muted">Voucher No: ${voucher.number} | Date: ${voucher.date} | Type: ${voucher.type.toUpperCase()}</div>
            <div>Particulars: ${particulars}</div>
            <table>
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Ledger/Item</th>
                  <th class="right">Debit</th>
                  <th class="right">Credit</th>
                  <th>Narration</th>
                </tr>
              </thead>
              <tbody>
                ${voucher.entries.map((e, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${e.ledgerId || e.itemId || '-'}</td>
                    <td class="right">${e.type === 'debit' ? e.amount.toFixed(2) : '-'}</td>
                    <td class="right">${e.type === 'credit' ? e.amount.toFixed(2) : '-'}</td>
                    <td>${e.narration || ''}</td>
                  </tr>`).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" class="right"><strong>Totals</strong></td>
                  <td class="right"><strong>${debit.toFixed(2)}</strong></td>
                  <td class="right"><strong>${credit.toFixed(2)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </body>
        </html>`;

      const w = window.open('', '_blank');
      if (!w) {
        alert('Please allow pop-ups to print the invoice.');
        return false;
      }
      w.document.write(content);
      w.document.close();
      w.focus();
      w.print();
      return true;
    } catch (err) {
      console.error('Error printing voucher:', err);
      alert('Failed to print invoice');
      return false;
    }
  };

  const handleGenerateEWayBill = (voucher: VoucherEntry) => {
    // Placeholder: integrate real E-Way Bill modal/API here
    console.log('E-Way Bill generation started for', voucher.number);
    alert(`E-Way Bill generated (mock) for ${voucher.number}`);
  };

  const handleGenerateEInvoice = (voucher: VoucherEntry) => {
    // Placeholder: integrate real E-Invoice (IRN) API/print here
    console.log('E-Invoice generation started for', voucher.number);
    alert(`E-Invoice generated (mock) for ${voucher.number}`);
  };

  const onGenerateInvoice = () => {
    if (!selectedVoucher) return;
    const ok = printSingleVoucher(selectedVoucher);
    // Auto-run E-Way Bill then E-Invoice after invoice generation
    if (ok) {
      setTimeout(() => handleGenerateEWayBill(selectedVoucher), 300);
      setTimeout(() => handleGenerateEInvoice(selectedVoucher), 800);
    }
  };

  const onGenerateEWayBillClick = () => {
    if (!selectedVoucher) return;
    handleGenerateEWayBill(selectedVoucher);
  };

  const onGenerateEInvoiceClick = () => {
    if (!selectedVoucher) return;
    handleGenerateEInvoice(selectedVoucher);
  };

  const onSendToEmail = () => {
    if (!selectedVoucher) return;
    // Placeholder email hook
    alert(`Invoice ${selectedVoucher.number} queued for email (mock).`);
  };

  const onSendToWhatsApp = () => {
    if (!selectedVoucher) return;
    // Placeholder WhatsApp hook
    alert(`Invoice ${selectedVoucher.number} shared to WhatsApp (mock).`);
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
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {hasPermission('add') && onAdd && (
            <button
              onClick={onAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              title={`Add new ${voucherType} voucher`}
            >
              Add New
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
        {voucherType === 'sales' ? (
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Sales Amount</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDebit)}</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium text-gray-500">Total Debit</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDebit)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium text-gray-500">Total Credit</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredit)}</p>
            </div>
          </>
        )}
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                title="Export vouchers to Excel"
              >
                Export
              </button>
            )}
            {hasPermission('print') && (
              <button
                onClick={handlePrint}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                title="Print voucher register"
              >
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
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
                {voucherType === 'sales' ? (
                  <>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Amount
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Amount
                    </th>
                  </>
                )}
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {voucher.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={particulars}>
                      {particulars}
                    </td>
                    {voucherType === 'sales' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(debit)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          -
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {debit > 0 ? formatCurrency(debit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {credit > 0 ? formatCurrency(credit) : '-'}
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 items-center">
                        {hasPermission('view') && onView && (
                          <button
                            onClick={() => onView(voucher)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View voucher"
                          >
                            View
                          </button>
                        )}
                        {hasPermission('edit') && onEdit && (
                          <button
                            onClick={() => onEdit(voucher)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit voucher"
                          >
                            Edit
                          </button>
                        )}
                        {hasPermission('delete') && onDelete && (
                          <button
                            onClick={() => onDelete(voucher.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete voucher"
                          >
                            Delete
                          </button>
                        )}
                        {hasPermission('print') && (
                          <button
                            onClick={() => openPrintOptions(voucher)}
                            className="text-gray-700 hover:text-gray-900 flex items-center"
                            title="Print options"
                          >
                            <Printer size={16} className="mr-1" /> Print
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Summary Row */}
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-900">
                  Total ({filteredVouchers.length} vouchers)
                </td>
                {voucherType === 'sales' ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-right">
                      {formatCurrency(filteredVouchers.reduce((sum: number, v: VoucherEntry) => sum + calculateDebitCredit(v).debit, 0))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 text-right">
                      -
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(filteredVouchers.reduce((sum: number, v: VoucherEntry) => sum + calculateDebitCredit(v).debit, 0))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(filteredVouchers.reduce((sum: number, v: VoucherEntry) => sum + calculateDebitCredit(v).credit, 0))}
                    </td>
                  </>
                )}
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
                  <span className="font-medium">{endIndex}</span> of{' '}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}
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

      {/* Print Options Modal */}
      <PrintOptions
        theme={theme}
        showPrintOptions={showPrintOptions}
        onClose={closePrintOptions}
        onGenerateInvoice={onGenerateInvoice}
        onGenerateEWayBill={onGenerateEWayBillClick}
        onGenerateEInvoice={onGenerateEInvoiceClick}
        onSendToEmail={onSendToEmail}
        onSendToWhatsApp={onSendToWhatsApp}
      />

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vouchers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default VoucherRegisterBase;
