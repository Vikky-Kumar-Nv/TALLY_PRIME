import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';

interface CashFlowAccount {
  name: string;
  amount: number;
}

interface CashFlowSummaryData {
  inflow: CashFlowAccount[];
  outflow: CashFlowAccount[];
}

const CashFlowSummary: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { monthCode } = useParams<{ monthCode: string }>();

  // Mock cash flow summary data matching Tally's format
  const cashFlowData: CashFlowSummaryData = {
    inflow: [
      { name: 'Capital Account', amount: 3000000 },
      { name: 'Sales Accounts', amount: 2900000 },
      { name: 'Sundry Debtors', amount: 850000 },
      { name: 'Loans (Liability)', amount: 500000 },
      { name: 'Interest Received', amount: 125000 },
      { name: 'Other Income', amount: 75000 },
    ],
    outflow: [
      { name: 'Fixed Assets', amount: 1800000 },
      { name: 'Purchase Accounts', amount: 1250000 },
      { name: 'Sundry Creditors', amount: 650000 },
      { name: 'Direct Expenses', amount: 320000 },
      { name: 'Indirect Expenses', amount: 280000 },
      { name: 'Loans & Advances', amount: 150000 },
    ]
  };

  const totalInflow = cashFlowData.inflow.reduce((sum, account) => sum + account.amount, 0);
  const totalOutflow = cashFlowData.outflow.reduce((sum, account) => sum + account.amount, 0);
  const netInflow = totalInflow - totalOutflow;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getMonthName = (monthCode: string | undefined) => {
    if (!monthCode) return 'Current Month';
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthIndex = parseInt(monthCode) - 1;
    return monthNames[monthIndex] || monthCode;
  };

  const getPeriodRange = () => {
    const currentYear = new Date().getFullYear();
    const month = monthCode ? parseInt(monthCode) : new Date().getMonth() + 1;
    const daysInMonth = new Date(currentYear, month, 0).getDate();
    
    return `1-${getMonthName(monthCode)?.slice(0, 3)}-${currentYear.toString().slice(-2)} to ${daysInMonth}-${getMonthName(monthCode)?.slice(0, 3)}-${currentYear.toString().slice(-2)}`;
  };

  return (
    <div className='pt-[56px] px-4'>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          title='Back to Cash Flow'
          onClick={() => navigate('/app/reports/cash-flow')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Cash Flow Summary
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Company: Abd Pvt Ltd
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Period: {getPeriodRange()}
          </p>
        </div>
        <div className="flex space-x-2">
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

      {/* Main Content - Two Column Layout like Tally */}
      <div className={`rounded-xl border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-2 h-full">
          {/* Inflow Section */}
          <div className={`border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700 bg-blue-900' : 'border-gray-200 bg-blue-50'
            }`}>
              <h3 className={`text-lg font-semibold text-center ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
              }`}>
                Inflow
              </h3>
              <p className={`text-sm text-center ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {getPeriodRange()}
              </p>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-3">
                {cashFlowData.inflow.map((account, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <button
                      onClick={() => navigate(`/app/reports/group-cash-flow/${encodeURIComponent(account.name)}`, {
                        state: { accountData: account, period: getPeriodRange() }
                      })}
                      className={`font-medium text-left hover:underline transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:text-blue-400' 
                          : 'text-gray-800 hover:text-blue-600'
                      }`}
                    >
                      {account.name}
                    </button>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatCurrency(account.amount)}
                    </span>
                  </div>
                ))}
                
                <div className={`border-t pt-3 mt-4 ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  <div className="flex justify-between items-center py-2 font-bold">
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      Total
                    </span>
                    <span className={`text-lg ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatCurrency(totalInflow)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Outflow Section */}
          <div>
            <div className={`px-6 py-4 border-b ${
              theme === 'dark' ? 'border-gray-700 bg-red-900' : 'border-gray-200 bg-red-50'
            }`}>
              <h3 className={`text-lg font-semibold text-center ${
                theme === 'dark' ? 'text-red-300' : 'text-red-900'
              }`}>
                Outflow
              </h3>
              <p className={`text-sm text-center ${
                theme === 'dark' ? 'text-red-400' : 'text-red-700'
              }`}>
                {getPeriodRange()}
              </p>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-3">
                {cashFlowData.outflow.map((account, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <button
                      onClick={() => navigate(`/app/reports/group-cash-flow/${encodeURIComponent(account.name)}`, {
                        state: { accountData: account, period: getPeriodRange() }
                      })}
                      className={`font-medium text-left hover:underline transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-200 hover:text-red-400' 
                          : 'text-gray-800 hover:text-red-600'
                      }`}
                    >
                      {account.name}
                    </button>
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {formatCurrency(account.amount)}
                    </span>
                  </div>
                ))}
                
                <div className={`border-t pt-3 mt-4 ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  <div className="flex justify-between items-center py-2 font-bold">
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      Total
                    </span>
                    <span className={`text-lg ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {formatCurrency(totalOutflow)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Inflow at Bottom */}
        <div className={`border-t px-6 py-4 ${
          theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex justify-center">
            <div className="text-center">
              <span className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Net Inflow: 
              </span>
              <span className={`text-xl font-bold ml-3 ${
                netInflow >= 0 
                  ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  : theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(netInflow))}
                {netInflow < 0 && ' (Outflow)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowSummary;
