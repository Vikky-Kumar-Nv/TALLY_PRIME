import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, BarChart2, Activity, Calendar 
} from 'lucide-react';

const ReportsIndex: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  const reportCategories = [
    {
      title: 'Accounting Reports',
      items: [
        
        // { icon: <FileText size={20} />, name: 'Ledger', path: '/app/reports/ledger' },
        // { icon: <BarChart2 size={20} />, name: 'Trial Balance', path: '/app/reports/trial-balance' },
        // { icon: <TrendingUp size={20} />, name: 'Trading Account', path: '/app/reports/trading-account' },
        // { icon: <TrendingUp size={20} />, name: 'Profit & Loss', path: '/app/reports/profit-loss' },
        // { icon: <DollarSign size={20} />, name: 'Balance Sheet', path: '/app/reports/balance-sheet' },
        // { icon: <PieChart size={20} />, name: 'Cash/Funds Flow', path: '/app/reports/cash-flow' }
      ]
    },
    {
      title: 'Inventory Reports',
      items: [
        { icon: <BookOpen size={20} />, name: 'Stock Summary', path: '/app/reports/stock-summary' },
        { icon: <Activity size={20} />, name: 'Movement Analysis', path: '/app/reports/movement-analysis' },
        { icon: <Calendar size={20} />, name: 'Ageing Analysis', path: '/app/reports/ageing-analysis' },
        { icon: <BarChart2 size={20} />, name: 'Godown Summary', path: '/app/reports/godown-summary' },
         { icon: <BarChart2 size={20} />, name: 'Bills Receivable', path: '/app/reports/bill-receivable' },
         { icon: <BarChart2 size={20} />, name: 'Bills Payable', path: '/app/reports/bill-payable' }
      ]
    }
  ];

  

  return (
    <div className='pt-[56px] px-4 '>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {reportCategories.map((category, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}
          >
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  <span>{item.name}</span>
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
          <span className="font-semibold">Pro Tip:</span> Press Alt+F9 to quickly access Reports, or use F5 to refresh the current report.
        </p>
      </div>
    </div>
  );
};

export default ReportsIndex;