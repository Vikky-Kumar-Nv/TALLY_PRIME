import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const GodownList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data - replace with actual godown data from context
  const godowns = [
    { id: '1', name: 'Main Warehouse', address: '123 Industrial Area, City' },
    { id: '2', name: 'Branch Store', address: '456 Commercial Street, City' },
    { id: '3', name: 'Cold Storage', address: '789 Storage Complex, City' }
  ];

  const filteredGodowns = godowns.filter(godown =>
    godown.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    godown.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Godown List</h1>
        <button
        title='Create New Godown'
          onClick={() => navigate('/app/masters/godown/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Godown
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
              placeholder="Search godowns..."
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
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGodowns.map((godown) => (
                <tr 
                  key={godown.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3">{godown.name}</td>
                  <td className="px-4 py-3">{godown.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                      title='Edit Godown'
                        onClick={() => navigate(`/app/masters/godown/edit/${godown.id}`)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                      title='Delete Godown'
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
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
        
        {filteredGodowns.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No godowns found matching your search.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F3 to access Masters, then use arrow keys to navigate to Godowns.
        </p>
      </div>
    </div>
  );
};

export default GodownList;