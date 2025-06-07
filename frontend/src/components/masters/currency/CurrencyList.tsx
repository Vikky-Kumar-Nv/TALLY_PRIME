import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const CurrencyList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const currencies = [
    { id: '1', code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1, isBase: true },
    { id: '2', code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 82.50, isBase: false },
    { id: '3', code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 89.75, isBase: false },
    { id: '4', code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 104.25, isBase: false }
  ];

  const filteredCurrencies = currencies.filter(currency => 
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Currency List</h1>
        <button
        title='Create New Currency'
          onClick={() => navigate('/masters/currency/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Currency
        </button>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-4">
          <div className={`flex items-center w-full max-w-md px-3 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className="mr-2 opacity-70" />
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-right">Exchange Rate</th>
                <th className="px-4 py-3 text-center">Base</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCurrencies.map((currency) => (
                <tr 
                  key={currency.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3 font-mono">{currency.code}</td>
                  <td className="px-4 py-3">{currency.symbol}</td>
                  <td className="px-4 py-3">{currency.name}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {currency.exchangeRate.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {currency.isBase && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      }`}>
                        Base
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                      title='Edit Currency'
                        onClick={() => navigate(`/masters/currency/edit/${currency.id}`)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                      title='Delete Currency'
                        disabled={currency.isBase}
                        className={`p-1 rounded ${
                          currency.isBase
                            ? 'opacity-50 cursor-not-allowed'
                            : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCurrencies.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No currencies found matching your search.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F3 to access Masters, then use arrow keys to navigate to Currency.
        </p>
      </div>
    </div>
  );
};

export default CurrencyList;