import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search,ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { Ledger } from '../../../types';

const LedgerList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ledger");
        const data = await res.json();
        setLedgers(data);
      } catch (err) {
        console.error("Failed to load ledgers", err);
      }
    };

    fetchLedgers();
  }, []);

  const filteredLedgers = ledgers.filter(ledger => 
    ledger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ledger.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center mb-6">
        <button
          title="Back to Group List"
          onClick={() => navigate('/app/masters')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Group List</h1>
      </div>
        
        <button
        title="Create Ledger"
          aria-label="Create Ledger"
          type='button'
          onClick={() => navigate('/app/masters/ledger/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Ledger
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
              placeholder="Search ledgers..."
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
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Under Group</th>
                <th className="px-4 py-3 text-right">Opening Balance</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgers.map((ledger:any) => (
                <tr key={ledger.id} className={`hover:bg-opacity-10 hover:bg-blue-500 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                  <td className="px-4 py-3">{ledger.name}</td>
                  <td className="px-4 py-3">{ledger.groupName}</td>
                  <td className="px-4 py-3 text-right font-mono">{ledger.openingBalance}</td>                  
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ledger.balanceType === 'debit'
                        ? theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                        : theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                    }`}>
                    {ledger.balanceType?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                      title='Edit Ledger'
                      type='button'
                        onClick={() => navigate(`/app/masters/ledger/edit/${ledger.id}`)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                      
                      title='Delete Ledger'
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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
        
        {filteredLedgers.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No ledgers found matching your search.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+C to create a new ledger, Ctrl+A to alter, Ctrl+D to delete.
        </p>
      </div>
    </div>
  );
};

export default LedgerList;