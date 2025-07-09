import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Search, Filter, Download, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface OutstandingLedgerData {
  id: number;
  ledgerName: string;
  entries: {
    id: number;
    date: string;
    refNo: string;
    particular: string;
    openingAmount: number;
    pendingAmount: number;
    dueOn: string;
    overdueByDays: number;
  }[];
}

const OutstandingLedger: React.FC = () => {
  const { theme } = useAppContext();
  const [selectedLedger, setSelectedLedger] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Mock ledger options
  const ledgerOptions = [
    'ABC Enterprises',
    'XYZ Corporation',
    'Reliable Suppliers',
    'Tech Solutions Ltd',
    'Global Trading Co',
    'Modern Industries',
    'Premier Services',
    'Elite Marketing',
    'Swift Logistics',
    'Alpha Systems'
  ];

  // Mock outstanding data - grouped by ledger
  const outstandingData: OutstandingLedgerData[] = [
    {
      id: 1,
      ledgerName: 'ABC Enterprises',
      entries: [
        {
          id: 1,
          date: '2024-12-15',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 50000,
          pendingAmount: 35000,
          dueOn: '2025-01-15',
          overdueByDays: 0
        },
        {
          id: 2,
          date: '2024-11-20',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 25000,
          pendingAmount: 25000,
          dueOn: '2024-12-20',
          overdueByDays: 20
        },
        {
          id: 3,
          date: '2024-10-10',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 75000,
          pendingAmount: 15000,
          dueOn: '2024-11-10',
          overdueByDays: 61
        }
      ]
    },
    {
      id: 2,
      ledgerName: 'XYZ Corporation',
      entries: [
        {
          id: 4,
          date: '2024-12-01',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 80000,
          pendingAmount: 40000,
          dueOn: '2025-01-01',
          overdueByDays: 8
        },
        {
          id: 5,
          date: '2024-11-15',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 30000,
          pendingAmount: 20000,
          dueOn: '2024-12-15',
          overdueByDays: 25
        }
      ]
    },
    {
      id: 3,
      ledgerName: 'Reliable Suppliers',
      entries: [
        {
          id: 6,
          date: '2024-12-10',
          refNo: 'Purchase',
          particular: 'Purchase Invoice',
          openingAmount: 120000,
          pendingAmount: 85000,
          dueOn: '2025-01-10',
          overdueByDays: 0
        },
        {
          id: 7,
          date: '2024-11-05',
          refNo: 'Purchase',
          particular: 'Purchase Invoice',
          openingAmount: 45000,
          pendingAmount: 45000,
          dueOn: '2024-12-05',
          overdueByDays: 35
        }
      ]
    },
    {
      id: 4,
      ledgerName: 'Tech Solutions Ltd',
      entries: [
        {
          id: 8,
          date: '2024-12-20',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 95000,
          pendingAmount: 70000,
          dueOn: '2025-01-20',
          overdueByDays: 0
        },
        {
          id: 9,
          date: '2024-10-15',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 35000,
          pendingAmount: 35000,
          dueOn: '2024-11-15',
          overdueByDays: 76
        }
      ]
    },
    {
      id: 5,
      ledgerName: 'Global Trading Co',
      entries: [
        {
          id: 10,
          date: '2024-11-30',
          refNo: 'Sales',
          particular: 'Sales Invoice',
          openingAmount: 65000,
          pendingAmount: 50000,
          dueOn: '2024-12-30',
          overdueByDays: 10
        }
      ]
    }
  ];

  const filteredData = outstandingData.filter(ledger => {
    const matchesLedger = !selectedLedger || ledger.ledgerName === selectedLedger;
    const matchesSearch = !searchTerm || 
      ledger.entries.some(entry => 
        entry.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.particular.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      ledger.ledgerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLedger && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getOverdueStatus = (days: number) => {
    if (days === 0) {
      return { text: 'Current', color: 'green' };
    } else if (days <= 30) {
      return { text: `${days} days`, color: 'yellow' };
    } else if (days <= 60) {
      return { text: `${days} days`, color: 'orange' };
    } else {
      return { text: `${days} days`, color: 'red' };
    }
  };

  const totalPending = filteredData.reduce((sum, ledger) => 
    sum + ledger.entries.reduce((entrySum, entry) => entrySum + entry.pendingAmount, 0), 0
  );
  
  const overdueAmount = filteredData.reduce((sum, ledger) => 
    sum + ledger.entries
      .filter(entry => entry.overdueByDays > 0)
      .reduce((entrySum, entry) => entrySum + entry.pendingAmount, 0), 0
  );

  const totalEntries = filteredData.reduce((sum, ledger) => sum + ledger.entries.length, 0);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Filters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ledger Dropdown */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select Ledger
            </label>
            <select
              title="Select Ledger"
              value={selectedLedger}
              onChange={(e) => setSelectedLedger(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">All Ledgers</option>
              {ledgerOptions.map((ledger) => (
                <option key={ledger} value={ledger}>
                  {ledger}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Search
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search by Ref No..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Date From */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              From Date
            </label>
            <input
              title="From Date"
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
          </div>

          {/* Date To */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              To Date
            </label>
            <input
              title="To Date"
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button className={`px-4 py-2 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
              <Filter className="w-4 h-4 mr-2 inline" />
              Clear Filters
            </button>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2 inline" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-xl border p-6 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Total Pending
              </h3>
              <p className={`text-2xl font-bold mt-2 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {formatCurrency(totalPending)}
              </p>
            </div>
            <Calendar className={`w-8 h-8 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Overdue Amount
              </h3>
              <p className={`text-2xl font-bold mt-2 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {formatCurrency(overdueAmount)}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`} />
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Total Entries
              </h3>
              <p className={`text-2xl font-bold mt-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {totalEntries}
              </p>
            </div>
            <Clock className={`w-8 h-8 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`} />
          </div>
        </div>
      </div>

      {/* Outstanding Data Table */}
      <div className={`rounded-xl border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ledger Outstanding Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          {filteredData.length > 0 ? (
            <div className="min-w-full">
              {/* Table Header */}
              <div className={`grid grid-cols-6 gap-4 px-6 py-3 border-b font-medium text-xs uppercase tracking-wider ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <div className="text-left">Date</div>
                <div className="text-left">Ref No</div>
                <div className="text-right">Opening Amount</div>
                <div className="text-right">Pending Amount</div>
                <div className="text-left">Due On</div>
                <div className="text-center">Overdue Days</div>
              </div>

              {/* Grouped Data by Ledger */}
              {filteredData.map((ledger) => (
                <div key={ledger.id} className={`border-b last:border-b-0 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  {/* Ledger Header */}
                  <div className={`px-6 py-3 font-semibold text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-blue-400 border-b border-gray-600' 
                      : 'bg-blue-50 text-blue-900 border-b border-blue-100'
                  }`}>
                    {ledger.ledgerName}
                  </div>

                  {/* Ledger Entries */}
                  {ledger.entries.map((entry) => {
                    const overdueStatus = getOverdueStatus(entry.overdueByDays);
                    return (
                      <div 
                        key={entry.id} 
                        className={`grid grid-cols-6 gap-4 px-6 py-3 hover:bg-opacity-50 transition-colors ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                      >
                        <div className="text-left text-sm">
                          {formatDate(entry.date)}
                        </div>
                        <div className={`text-left text-sm font-medium ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {entry.refNo}
                        </div>
                        <div className="text-right text-sm font-medium">
                          {formatCurrency(entry.openingAmount)}
                        </div>
                        <div className="text-right text-sm font-medium">
                          {formatCurrency(entry.pendingAmount)}
                        </div>
                        <div className="text-left text-sm">
                          {formatDate(entry.dueOn)}
                        </div>
                        <div className="text-center">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            overdueStatus.color === 'green'
                              ? theme === 'dark' 
                                ? 'bg-green-900 text-green-300 border border-green-700'
                                : 'bg-green-100 text-green-800'
                              : overdueStatus.color === 'yellow'
                              ? theme === 'dark' 
                                ? 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                                : 'bg-yellow-100 text-yellow-800'
                              : overdueStatus.color === 'orange'
                              ? theme === 'dark' 
                                ? 'bg-orange-900 text-orange-300 border border-orange-700'
                                : 'bg-orange-100 text-orange-800'
                              : theme === 'dark' 
                                ? 'bg-red-900 text-red-300 border border-red-700'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {overdueStatus.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No outstanding records found</p>
              <p className="text-sm">Try adjusting your filters or select a different ledger</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutstandingLedger;
