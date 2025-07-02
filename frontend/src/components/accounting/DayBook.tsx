import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const DayBook: React.FC = () => {
  const { theme, vouchers, ledgers } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const getLedgerName = (ledgerId: string | undefined) => {
    if (!ledgerId) return '';
    return ledgers.find(ledger => ledger.id === ledgerId)?.name || '';
  };

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
        type='button'
          title='Back to Reports'
          onClick={() => navigate('/app/accounting')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Day Book</h1>
        <div className="ml-auto flex space-x-2">
          <button
          title='Toggle Filters'
            type='button'
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
          </button>
          <button
          title='Print Report'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Printer size={18} />
          </button>
          <button
          title='Download Report'
          type='button'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Range
              </label>
              <select
              title='Select Date Range'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Voucher Type
              </label>
              <select
              title='Select Voucher Type'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">All Types</option>
                <option value="payment">Payment</option>
                <option value="receipt">Receipt</option>
                <option value="journal">Journal</option>
                <option value="sales">Sales</option>
                <option value="purchase">Purchase</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Day Book</h2>
          <p className="text-sm opacity-75">For {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b-2 border-gray-300'
              }`}>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Voucher Type</th>
                <th className="px-4 py-3 text-left">Voucher No.</th>
                <th className="px-4 py-3 text-left">Particulars</th>
                <th className="px-4 py-3 text-right">Debit</th>
                <th className="px-4 py-3 text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center opacity-70">
                    No transactions found for today
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  voucher.entries.map((entry, index) => (
                    <tr 
                      key={`${voucher.id}-${index}`}
                      className={`${
                        theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                      }`}
                    >
                      <td className="px-4 py-3">{voucher.date}</td>
                      <td className="px-4 py-3 capitalize">{voucher.type}</td>
                      <td className="px-4 py-3">{voucher.number || 'Auto'}</td>
                      <td className="px-4 py-3">{getLedgerName(entry.ledgerId)}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {entry.type === 'debit' ? entry.amount.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {entry.type === 'credit' ? entry.amount.toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press F5 to refresh, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default DayBook;