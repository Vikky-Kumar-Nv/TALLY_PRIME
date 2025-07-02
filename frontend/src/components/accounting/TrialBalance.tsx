import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const TrialBalance: React.FC = () => {
  const { theme, ledgers, ledgerGroups } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getGroupName = (groupId: string) => {
    return ledgerGroups.find(group => group.id === groupId)?.name || '';
  };

  const getBalanceForDisplay = (amount: number, type: 'debit' | 'credit') => {
    return type === 'debit' ? amount : 0;
  };

  const getCreditBalanceForDisplay = (amount: number, type: 'debit' | 'credit') => {
    return type === 'credit' ? amount : 0;
  };

  const totalDebit = ledgers.reduce((sum, ledger) => {
    return sum + getBalanceForDisplay(ledger.openingBalance, ledger.balanceType);
  }, 0);

  const totalCredit = ledgers.reduce((sum, ledger) => {
    return sum + getCreditBalanceForDisplay(ledger.openingBalance, ledger.balanceType);
  }, 0);

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
        <h1 className="text-2xl font-bold">Trial Balance</h1>
        <div className="ml-auto flex space-x-2">
          <button
            title='Toggle Filters'
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
                <option value="current-month">Current Month</option>
                <option value="previous-month">Previous Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Financial Year</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Group Filter
              </label>
              <select
              title='Select Ledger Group'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">All Groups</option>
                {ledgerGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Balance Type
              </label>
              <select
                title='Select Balance Type'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="all">All Balances</option>
                <option value="with-balance">With Balances Only</option>
                <option value="without-balance">Without Balances Only</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Trial Balance</h2>
          <p className="text-sm opacity-75">As of {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b-2 border-gray-300'
              }`}>
                <th className="px-4 py-3 text-left">Particulars</th>
                <th className="px-4 py-3 text-left">Group</th>
                <th className="px-4 py-3 text-right">Debit (Dr)</th>
                <th className="px-4 py-3 text-right">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((ledger) => (
                <tr 
                  key={ledger.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{ledger.name}</td>
                  <td className="px-4 py-3">{getGroupName(ledger.groupId)}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {getBalanceForDisplay(ledger.openingBalance, ledger.balanceType).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {getCreditBalanceForDisplay(ledger.openingBalance, ledger.balanceType).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`font-bold ${
                theme === 'dark' ? 'border-t-2 border-gray-600' : 'border-t-2 border-gray-300'
              }`}>
                <td className="px-4 py-3" colSpan={2}>Total</td>
                <td className="px-4 py-3 text-right font-mono">{totalDebit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">{totalCredit.toLocaleString()}</td>
              </tr>
              {totalDebit === totalCredit ? (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                      Trial Balance is in balance
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                      Out of balance by {Math.abs(totalDebit - totalCredit).toLocaleString()}
                    </span>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press F5 to refresh the report, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default TrialBalance;