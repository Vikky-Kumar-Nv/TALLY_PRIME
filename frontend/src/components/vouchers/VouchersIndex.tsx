import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, ArrowRightCircle, ArrowLeftCircle, 
  FileText, ShoppingCart, ShoppingBag, Receipt, 
  FileMinus, FilePlus, Truck 
} from 'lucide-react';

const VouchersIndex: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  const voucherTypes = [
    { 
      icon: <DollarSign size={20} />, 
      name: 'Payment', 
      path: '/vouchers/payment/create',
      color: theme === 'dark' ? 'bg-red-900' : 'bg-red-50',
      iconBg: theme === 'dark' ? 'bg-red-800' : 'bg-red-100'
    },
    { 
      icon: <ArrowRightCircle size={20} />, 
      name: 'Receipt', 
      path: '/vouchers/receipt/create',
      color: theme === 'dark' ? 'bg-green-900' : 'bg-green-50',
      iconBg: theme === 'dark' ? 'bg-green-800' : 'bg-green-100'
    },
    { 
      icon: <ArrowLeftCircle size={20} />, 
      name: 'Contra', 
      path: '/vouchers/contra/create',
      color: theme === 'dark' ? 'bg-purple-900' : 'bg-purple-50',
      iconBg: theme === 'dark' ? 'bg-purple-800' : 'bg-purple-100'
    },
    { 
      icon: <FileText size={20} />, 
      name: 'Journal', 
      path: '/vouchers/journal/create',
      color: theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-50',
      iconBg: theme === 'dark' ? 'bg-yellow-800' : 'bg-yellow-100'
    },
    { 
      icon: <ShoppingCart size={20} />, 
      name: 'Sales', 
      path: '/vouchers/sales/create',
      color: theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50',
      iconBg: theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
    },
    { 
      icon: <ShoppingBag size={20} />, 
      name: 'Purchase', 
      path: '/vouchers/purchase/create',
      color: theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-50',
      iconBg: theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-100'
    },
    { 
      icon: <FilePlus size={20} />, 
      name: 'Debit Note', 
      path: '/vouchers/debit-note/create',
      color: theme === 'dark' ? 'bg-pink-900' : 'bg-pink-50',
      iconBg: theme === 'dark' ? 'bg-pink-800' : 'bg-pink-100'
    },
    { 
      icon: <FileMinus size={20} />, 
      name: 'Credit Note', 
      path: '/vouchers/credit-note/create',
      color: theme === 'dark' ? 'bg-teal-900' : 'bg-teal-50',
      iconBg: theme === 'dark' ? 'bg-teal-800' : 'bg-teal-100'
    },
    { 
      icon: <Receipt size={20} />, 
      name: 'Stock Journal', 
      path: '/vouchers/stock-journal/create',
      color: theme === 'dark' ? 'bg-orange-900' : 'bg-orange-50',
      iconBg: theme === 'dark' ? 'bg-orange-800' : 'bg-orange-100'
    },
    { 
      icon: <Truck size={20} />, 
      name: 'Delivery Note', 
      path: '/vouchers/delivery-note/create',
      color: theme === 'dark' ? 'bg-cyan-900' : 'bg-cyan-50',
      iconBg: theme === 'dark' ? 'bg-cyan-800' : 'bg-cyan-100'
    }
  ];

  return (
    <div className='pt-[56px] px-4 '>
      <h1 className="text-2xl font-bold mb-6">Voucher Types</h1>
      
      <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {voucherTypes.map((voucher, index) => (
            <button
              key={index}
              onClick={() => navigate(voucher.path)}
              className={`p-4 rounded-lg flex flex-col items-center text-center transition-colors ${voucher.color}`}
            >
              <div className={`p-3 rounded-full mb-3 ${voucher.iconBg}`}>
                {voucher.icon}
              </div>
              <span className="font-medium">{voucher.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <h2 className="text-xl font-semibold mb-4">Recent Vouchers</h2>
        <p className="text-center py-4 opacity-70">No recent vouchers found.</p>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F5 to quickly access Vouchers, or use Ctrl+N to create a new Voucher.
        </p>
      </div>
    </div>
  );
};

export default VouchersIndex;