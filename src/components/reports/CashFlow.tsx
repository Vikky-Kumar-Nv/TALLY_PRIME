import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

const CashFlow: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
            type="button"
            title='Back to Reports'
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Cash Flow Statement</h1>
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
                <option value="custom">Custom Period</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Operating Activities */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4">Cash Flow from Operating Activities</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Net Income</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Depreciation</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Changes in Working Capital</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold border-t border-gray-300 dark:border-gray-600">
              <span>Net Cash from Operating Activities</span>
              <span className="font-mono">0.00</span>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4">Cash Flow from Investing Activities</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Purchase of Fixed Assets</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Sale of Fixed Assets</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold border-t border-gray-300 dark:border-gray-600">
              <span>Net Cash from Investing Activities</span>
              <span className="font-mono">0.00</span>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4">Cash Flow from Financing Activities</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Proceeds from Loans</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Repayment of Loans</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Capital Contributions</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold border-t border-gray-300 dark:border-gray-600">
              <span>Net Cash from Financing Activities</span>
              <span className="font-mono">0.00</span>
            </div>
          </div>
        </div>

        {/* Net Change in Cash */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h2 className="text-xl font-bold mb-4">Net Change in Cash</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span>Beginning Cash Balance</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Net Change in Cash</span>
              <span className="font-mono">0.00</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-gray-400 dark:border-gray-500">
              <span>Ending Cash Balance</span>
              <span className="font-mono">0.00</span>
            </div>
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

export default CashFlow;