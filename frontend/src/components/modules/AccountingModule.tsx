import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, BarChart2, Calculator, FileText, 
  DollarSign, TrendingUp, PieChart, Activity 
} from 'lucide-react';

const AccountingModule: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  const accountingFeatures = [
    {
      title: 'Chart of Accounts',
      items: [
        { icon: <BookOpen size={20} />, name: 'Ledger Accounts', path: '/masters/ledger' },
        { icon: <FileText size={20} />, name: 'Groups', path: '/masters/group' },
        { icon: <DollarSign size={20} />, name: 'Cost Centers', path: '/masters/cost-centers' },
        { icon: <Calculator size={20} />, name: 'Budgets', path: '/masters/budgets' }
      ]
    },
    {
      title: 'Transaction Entry',
      items: [
        { icon: <FileText size={20} />, name: 'Payment Voucher', path: '/vouchers/payment/create' },
        { icon: <FileText size={20} />, name: 'Receipt Voucher', path: '/vouchers/receipt/create' },
        { icon: <FileText size={20} />, name: 'Journal Voucher', path: '/vouchers/journal/create' },
        { icon: <FileText size={20} />, name: 'Contra Voucher', path: '/vouchers/contra/create' }
      ]
    },
    {
      title: 'Financial Reports',
      items: [
        { icon: <BarChart2 size={20} />, name: 'Trial Balance', path: '/reports/trial-balance' },
        { icon: <TrendingUp size={20} />, name: 'Profit & Loss', path: '/reports/profit-loss' },
        { icon: <PieChart size={20} />, name: 'Balance Sheet', path: '/reports/balance-sheet' },
        { icon: <Activity size={20} />, name: 'Cash Flow', path: '/reports/cash-flow' }
      ]
    }
  ];

  return (
    <div className='pt-[56px] px-4 '>
      <h1 className="text-2xl font-bold mb-6">Accounting Module</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {accountingFeatures.map((category, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}
          >
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {category.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => navigate(item.path)}
                  className={`p-4 rounded-lg flex flex-col items-center text-center transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${
                    theme === 'dark' 
                      ? 'bg-gray-600' 
                      : 'bg-blue-50'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F10 to quickly access Accounting features.
        </p>
      </div>
    </div>
  );
};

export default AccountingModule;