import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const BalanceSheet: React.FC = () => {
  const { theme, ledgers, ledgerGroups } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getAssetTotal = () => {
    return ledgers
      .filter(ledger => {
        const group = ledgerGroups.find(g => g.id === ledger.groupId);
        return group?.type === 'fixed-assets' || group?.type === 'current-assets';
      })
      .reduce((sum, ledger) => sum + ledger.openingBalance, 0);
  };

  const getLiabilityTotal = () => {
    return ledgers
      .filter(ledger => {
        const group = ledgerGroups.find(g => g.id === ledger.groupId);
        return group?.type === 'capital' || group?.type === 'loans' || group?.type === 'current-liabilities';
      })
      .reduce((sum, ledger) => sum + ledger.openingBalance, 0);
  };

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
          title='Back to Reports'
          type="button"
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Balance Sheet</h1>
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
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liabilities Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Liabilities</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Capital Account</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'capital')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Loans (Liability)</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'loans')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Current Liabilities</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'current-liabilities')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500">
              <span>Total Liabilities</span>
              <span className="font-mono">{getLiabilityTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Assets</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Fixed Assets</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'fixed-assets')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Current Assets</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'current-assets')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500">
              <span>Total Assets</span>
              <span className="font-mono">{getAssetTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Check */}
      <div className={`mt-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Balance Verification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75">Total Assets</p>
              <p className="text-xl font-bold">₹ {getAssetTotal().toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Total Liabilities</p>
              <p className="text-xl font-bold">₹ {getLiabilityTotal().toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            {getAssetTotal() === getLiabilityTotal() ? (
              <span className={`px-3 py-1 rounded text-sm ${
                theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                Balance Sheet is balanced
              </span>
            ) : (
              <span className={`px-3 py-1 rounded text-sm ${
                theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                Balance Sheet is not balanced
              </span>
            )}
          </div>
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

export default BalanceSheet;