import React, { useState , useEffect} from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { LedgerGroup } from '../../../types';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const GroupList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<LedgerGroup[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/ledger-groups');
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Group List</h1>
        <button
        type='button'
          onClick={() => navigate('/masters/group/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Group
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
              placeholder="Search groups..."
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
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Parent Group</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group: LedgerGroup) => (
                <tr 
                  key={group.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3">{group.name}</td>
                  <td className="px-4 py-3">{group.type}</td>
                  <td className="px-4 py-3">
                    {group.parent ? filteredGroups.find(g => g.id === group.parent)?.name : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title="Edit Group"
                        onClick={() => navigate(`/masters/group/edit/${group.id}`)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                      title='Delete Group'
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
        
        {filteredGroups.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No groups found matching your search.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+C to create a new group, Ctrl+A to alter, Ctrl+D to delete.
        </p>
      </div>
    </div>
  );
};

export default GroupList;