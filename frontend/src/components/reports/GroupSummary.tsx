import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';
import type { Ledger, LedgerGroup } from '../../types';

const GroupSummary: React.FC = () => {
  const { theme, ledgers, ledgerGroups } = useAppContext();
  const navigate = useNavigate();
  const { groupType } = useParams<{ groupType: string }>();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Map group types to display names
  const groupDisplayNames: Record<string, string> = {
    'loans': 'Loans (Liability)',
    'current-liabilities': 'Current Liabilities',
    'current-assets': 'Current Assets',
    'fixed-assets': 'Fixed Assets',
    'capital': 'Capital Account',
    'sales': 'Sales',
    'purchase': 'Purchases',
    'direct-expenses': 'Direct Expenses',
    'indirect-expenses': 'Indirect Expenses',
    'indirect-income': 'Indirect Income'
  };

  // Get ledgers for the specific group type
  const getGroupLedgers = () => {
    return ledgers.filter((ledger: Ledger) => {
      const group = ledgerGroups.find((g: LedgerGroup) => g.id === ledger.groupId);
      return group?.type === groupType;
    });
  };

  // Get group total
  const getGroupTotal = () => {
    return getGroupLedgers().reduce((sum: number, ledger: Ledger) => sum + ledger.openingBalance, 0);
  };

  // Get group name for ledger
  const getGroupName = (groupId: string) => {
    return ledgerGroups.find((group: LedgerGroup) => group.id === groupId)?.name || '';
  };

  const groupLedgers = getGroupLedgers();
  const groupTotal = getGroupTotal();
  const displayName = groupDisplayNames[groupType || ''] || groupType;

  return (
    <div className='pt-[56px] px-4'>
      <div className="flex items-center mb-6">
        <button
          title='Back to Balance Sheet'
          type="button"
          onClick={() => navigate('/app/reports/balance-sheet')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{displayName} - Group Summary</h1>
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
            type='button'
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
                As on Date
              </label>
              <input
                title='Select Date'
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Period
              </label>
              <select
                title='Select Period'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="current-year">Current Financial Year</option>
                <option value="previous-year">Previous Financial Year</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Group Summary Table */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">{displayName}</h2>
          <p className="text-sm opacity-75">As of {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b-2 border-gray-300'
              }`}>
                <th className="px-4 py-3 text-left">Ledger Name</th>
                <th className="px-4 py-3 text-left">Group</th>
                <th className="px-4 py-3 text-right">Opening Balance</th>
                <th className="px-4 py-3 text-right">Current Period</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
                <th className="px-4 py-3 text-center">Type</th>
              </tr>
            </thead>
            <tbody>
              {groupLedgers.length > 0 ? (
                groupLedgers.map((ledger: Ledger) => (
                  <tr 
                    key={ledger.id}
                    className={`${
                      theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                    } cursor-pointer`}
                    onClick={() => navigate(`/app/reports/ledger?ledgerId=${ledger.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">{ledger.name}</td>
                    <td className="px-4 py-3">{getGroupName(ledger.groupId)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {ledger.openingBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">0</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {ledger.openingBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ledger.balanceType === 'debit'
                          ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                          : theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        {ledger.balanceType?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center opacity-70">
                    No ledgers found for this group
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className={`font-bold ${
                theme === 'dark' ? 'border-t-2 border-gray-600' : 'border-t-2 border-gray-300'
              }`}>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right font-mono">{groupTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">0</td>
                <td className="px-4 py-3 text-right font-mono">{groupTotal.toLocaleString()}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Group Totals Summary */}
      <div className={`mt-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Group Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-75">Opening Balance</p>
              <p className="text-xl font-bold">₹ {groupTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Current Period</p>
              <p className="text-xl font-bold">₹ 0</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Closing Balance</p>
              <p className="text-xl font-bold">₹ {groupTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-75">Number of Ledgers: {groupLedgers.length}</p>
          </div>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Click on any ledger to view detailed ledger report. Press F5 to refresh, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default GroupSummary;
