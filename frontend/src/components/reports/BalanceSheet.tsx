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
    const capital = getGroupTotal('capital');
    const loans = getGroupTotal('loans');
    const currentLiabilities = getGroupTotal('current-liabilities');
    const profitLoss = getProfitLoss();
    return capital + loans + currentLiabilities + profitLoss;
  };

  // Navigation handlers for group summary
  const handleGroupClick = (groupType: string) => {
    navigate(`/app/reports/group-summary/${groupType}`);
  };

  const handleProfitLossClick = () => {
    navigate('/app/reports/profit-loss');
  };

  // Calculate individual group totals
  const getGroupTotal = (groupType: string) => {
    return ledgers
      .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === groupType)
      .reduce((sum, l) => sum + l.openingBalance, 0);
  };

  // Calculate Profit & Loss using Trading Account + P&L Account method (same as ProfitLoss component)
  const getProfitLoss = () => {
    // Stock calculations
    const getOpeningStock = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'opening-stock')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    const getClosingStock = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'closing-stock')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    // Income calculations
    const getSalesTotal = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'sales')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    const getIndirectIncomeTotal = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'indirect-income')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    // Expense calculations
    const getPurchaseTotal = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'purchase')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    const getDirectExpensesTotal = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'direct-expenses')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    const getIndirectExpensesTotal = () => {
      return ledgers
        .filter(l => ledgerGroups.find(g => g.id === l.groupId)?.type === 'indirect-expenses')
        .reduce((sum, l) => sum + l.openingBalance, 0);
    };

    // Trading Account calculations (Gross Profit/Loss)
    const getTradingDebitTotal = () => {
      return getOpeningStock() + getPurchaseTotal() + getDirectExpensesTotal();
    };

    const getTradingCreditTotal = () => {
      return getSalesTotal() + getClosingStock();
    };

    const getGrossProfit = () => {
      return getTradingCreditTotal() - getTradingDebitTotal();
    };

    // Profit & Loss Account calculations (Net Profit/Loss)
    const getProfitLossDebitTotal = () => {
      const grossLoss = getGrossProfit() < 0 ? Math.abs(getGrossProfit()) : 0;
      return grossLoss + getIndirectExpensesTotal();
    };

    const getProfitLossCreditTotal = () => {
      const grossProfit = getGrossProfit() > 0 ? getGrossProfit() : 0;
      return grossProfit + getIndirectIncomeTotal();
    };

    // Final Net Profit/Loss
    return getProfitLossCreditTotal() - getProfitLossDebitTotal();
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
          
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-2 pb-2 border-b-2 border-gray-400 dark:border-gray-500 font-semibold text-sm">
            <div>Particulars</div>
            <div className="text-right">Opening</div>
            <div className="text-right">Current</div>
            <div className="text-right">Closing</div>
          </div>
          
          <div className="space-y-1 mt-2">
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGroupClick('capital')}
              title="Click to view Capital Account details"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Capital Account</span>
              <span className="text-right font-mono">{getGroupTotal('capital').toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getGroupTotal('capital').toLocaleString()}</span>
            </div>
            
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGroupClick('loans')}
              title="Click to view Loans details"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Loans (Liability)</span>
              <span className="text-right font-mono">{getGroupTotal('loans').toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getGroupTotal('loans').toLocaleString()}</span>
            </div>
            
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGroupClick('current-liabilities')}
              title="Click to view Current Liabilities details"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Current Liabilities</span>
              <span className="text-right font-mono">{getGroupTotal('current-liabilities').toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getGroupTotal('current-liabilities').toLocaleString()}</span>
            </div>
            
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={handleProfitLossClick}
              title="Click to view Profit & Loss Account"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Profit & Loss A/c</span>
              <span className="text-right font-mono">{getProfitLoss().toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getProfitLoss().toLocaleString()}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500 mt-2">
              <span>Total Liabilities</span>
              <span className="text-right font-mono">{getLiabilityTotal().toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getLiabilityTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4 text-center">Assets</h2>
          
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-2 pb-2 border-b-2 border-gray-400 dark:border-gray-500 font-semibold text-sm">
            <div>Particulars</div>
            <div className="text-right">Opening</div>
            <div className="text-right">Current</div>
            <div className="text-right">Closing</div>
          </div>
          
          <div className="space-y-1 mt-2">
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGroupClick('fixed-assets')}
              title="Click to view Fixed Assets details"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Fixed Assets</span>
              <span className="text-right font-mono">{getGroupTotal('fixed-assets').toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getGroupTotal('fixed-assets').toLocaleString()}</span>
            </div>
            
            <div 
              className={`grid grid-cols-4 gap-2 py-2 border-b border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleGroupClick('current-assets')}
              title="Click to view Current Assets details"
            >
              <span className="text-blue-600 dark:text-blue-400 underline">Current Assets</span>
              <span className="text-right font-mono">{getGroupTotal('current-assets').toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getGroupTotal('current-assets').toLocaleString()}</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500 mt-2">
              <span>Total Assets</span>
              <span className="text-right font-mono">{getAssetTotal().toLocaleString()}</span>
              <span className="text-right font-mono">0</span>
              <span className="text-right font-mono">{getAssetTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Check */}
      <div className={`mt-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Balance Verification</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Assets (Opening)</p>
              <p className="text-xl font-bold">₹ {getAssetTotal().toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Assets (Current)</p>
              <p className="text-xl font-bold">₹ 0</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Assets (Closing)</p>
              <p className="text-xl font-bold">₹ {getAssetTotal().toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Liabilities (Opening)</p>
              <p className="text-xl font-bold">₹ {getLiabilityTotal().toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Liabilities (Current)</p>
              <p className="text-xl font-bold">₹ 0</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm opacity-75">Total Liabilities (Closing)</p>
              <p className="text-xl font-bold">₹ {getLiabilityTotal().toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            {getAssetTotal() === getLiabilityTotal() ? (
              <span className={`px-3 py-1 rounded text-sm ${
                theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                Balance Sheet is balanced ✓
              </span>
            ) : (
              <span className={`px-3 py-1 rounded text-sm ${
                theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                Balance Sheet is not balanced (Difference: ₹ {Math.abs(getAssetTotal() - getLiabilityTotal()).toLocaleString()})
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Navigation:</span> Click on Loans, Current Liabilities, or Current Assets to view group details. Click on Profit & Loss A/c to view P&L statement.
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold">Pro Tip:</span> Press F5 to refresh, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default BalanceSheet;