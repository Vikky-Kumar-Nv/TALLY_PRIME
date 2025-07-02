import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const ProfitLoss: React.FC = () => {
  const { theme, ledgers, ledgerGroups } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const getIncomeTotal = () => {
    return ledgers
      .filter(ledger => {
        const group = ledgerGroups.find(g => g.id === ledger.groupId);
        return group?.type === 'sales' || group?.type === 'indirect-income';
      })
      .reduce((sum, ledger) => sum + ledger.openingBalance, 0);
  };

  const getExpenseTotal = () => {
    return ledgers
      .filter(ledger => {
        const group = ledgerGroups.find(g => g.id === ledger.groupId);
        return group?.type === 'purchase' || group?.type === 'direct-expenses' || group?.type === 'indirect-expenses';
      })
      .reduce((sum, ledger) => sum + ledger.openingBalance, 0);
  };

  const netProfit = getIncomeTotal() - getExpenseTotal();

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
        title='Back to Reports'
          type="button"
          onClick={() => navigate('/app/accounting')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Profit & Loss Statement</h1>
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
                <option value="current-month">Current Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Financial Year</option>
                <option value="previous-year">Previous Financial Year</option>
                <option value="custom">Custom Period</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Income</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Sales</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'sales')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Other Income</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'indirect-income')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500">
              <span>Total Income</span>
              <span className="font-mono">{getIncomeTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Expenses</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Cost of Goods Sold</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'purchase')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Direct Expenses</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'direct-expenses')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 dark:border-gray-600">
              <span>Indirect Expenses</span>
              <span className="font-mono">
                {ledgers
                  .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'indirect-expenses')
                  .reduce((sum, l) => sum + l.openingBalance, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500">
              <span>Total Expenses</span>
              <span className="font-mono">{getExpenseTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Profit/Loss */}
      <div className={`mt-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
          </h2>
          <div className={`text-3xl font-bold ${
            netProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ₹ {Math.abs(netProfit).toLocaleString()}
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

export default ProfitLoss;