import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';
import type { Ledger } from '../../types';

const TrialBalance: React.FC = () => {
  const { theme, ledgers, ledgerGroups } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Navigation handlers
  const handleLedgerClick = (ledger: Ledger) => {
    navigate(`/app/reports/ledger?ledgerId=${ledger.id}`);
  };

  const handleGroupClick = (groupType: string) => {
    navigate(`/app/reports/group-summary/${groupType}`);
  };

  const getGroupName = (groupId: string) => {
    return ledgerGroups.find(group => group.id === groupId)?.name || '';
  };

  // Balance calculation functions - moved before usage
  const getBalanceForDisplay = (amount: number, type: 'debit' | 'credit') => {
    return type === 'debit' ? amount : 0;
  };

  const getCreditBalanceForDisplay = (amount: number, type: 'debit' | 'credit') => {
    return type === 'credit' ? amount : 0;
  };

  // Group ledgers by their group types for better organization
  const groupedLedgers = () => {
    const groups: { [key: string]: { groupName: string; groupType: string; ledgers: Ledger[]; total: { debit: number; credit: number } } } = {};
    
    ledgers.forEach(ledger => {
      const group = ledgerGroups.find(g => g.id === ledger.groupId);
      if (group) {
        if (!groups[group.type]) {
          groups[group.type] = {
            groupName: group.name,
            groupType: group.type,
            ledgers: [],
            total: { debit: 0, credit: 0 }
          };
        }
        groups[group.type].ledgers.push(ledger);
        groups[group.type].total.debit += getBalanceForDisplay(ledger.openingBalance, ledger.balanceType);
        groups[group.type].total.credit += getCreditBalanceForDisplay(ledger.openingBalance, ledger.balanceType);
      }
    });
    
    return groups;
  };

  const groupedData = groupedLedgers();

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
          onClick={() => navigate('/app/reports')}
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
              {Object.entries(groupedData).map(([groupType, groupData]) => (
                <React.Fragment key={groupType}>
                  {/* Group Header Row */}
                  <tr 
                    className={`${
                      theme === 'dark' ? 'bg-gray-700 border-b border-gray-600' : 'bg-gray-100 border-b border-gray-300'
                    } cursor-pointer hover:opacity-80`}
                    onClick={() => handleGroupClick(groupType)}
                    title={`Click to view ${groupData.groupName} group summary`}
                  >
                    <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                      {groupData.groupName}
                    </td>
                    <td className="px-4 py-3 text-sm opacity-75">Group Total</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {groupData.total.debit.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {groupData.total.credit.toLocaleString()}
                    </td>
                  </tr>
                  
                  {/* Individual Ledger Rows */}
                  {groupData.ledgers.map((ledger) => (
                    <tr 
                      key={ledger.id}
                      className={`${
                        theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-750' : 'border-b border-gray-200 hover:bg-gray-50'
                      } cursor-pointer transition-colors`}
                      onClick={() => handleLedgerClick(ledger)}
                      title={`Click to view ${ledger.name} ledger details`}
                    >
                      <td className="px-8 py-2 text-sm">{ledger.name}</td>
                      <td className="px-4 py-2 text-sm opacity-75">{getGroupName(ledger.groupId)}</td>
                      <td className="px-4 py-2 text-right font-mono text-sm">
                        {getBalanceForDisplay(ledger.openingBalance, ledger.balanceType).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-sm">
                        {getCreditBalanceForDisplay(ledger.openingBalance, ledger.balanceType).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
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