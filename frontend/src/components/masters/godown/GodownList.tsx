import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const GodownList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [godowns, setGodowns] = useState<{ id: string, name: string, address: string }[]>([]);

  useEffect(() => {
  fetch('https://tally-backend-dyn3.onrender.com/api/godowns')
      .then(res => res.json())
      .then(data => {
        if (data.success) setGodowns(data.data);
        else Swal.fire('Error', 'Failed to load godowns', 'error');
      })
      .catch(() => {
        Swal.fire('Error', 'Something went wrong', 'error');
      });
  }, []);

  const filteredGodowns = godowns.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='pt-[56px] px-4 '>
<div className="flex justify-between items-center mb-6">
        <div className="flex items-center mb-6">
          <button
            title="Back to Masters"
            onClick={() => navigate('/app/masters')}
            className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <ArrowLeft size={20} />
          </button>        
          <h1 className="text-2xl font-bold">Godown List</h1>
        </div>
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

      {/* Search Bar */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGodowns.map(godown => (
                <tr key={godown.id} className={`hover:bg-opacity-10 hover:bg-blue-500 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                  <td className="px-4 py-3">{godown.name}</td>
                  <td className="px-4 py-3">{godown.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title="Edit Godown"
                        onClick={() => navigate(`/app/masters/godown/edit/${godown.id}`)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Delete Godown"
                        onClick={() => Swal.fire('Coming Soon', 'Delete functionality not yet implemented', 'info')}
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

        {filteredGodowns.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No godowns found matching your search.</p>
          </div>
        )}
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F3 to access Masters, then use arrow keys to navigate to Godowns.
        </p>
      </div>
    </div>
  );
};

export default GodownList;
