import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { LedgerGroup } from '../../../types';
import { ArrowLeft, Save } from 'lucide-react';

const GroupForm: React.FC = () => {
  const { theme, ledgerGroups, addLedgerGroup } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<Omit<LedgerGroup, 'id'>>({
    name: '',
    type: 'capital',
    parent: undefined
  });

  useEffect(() => {
    if (isEditMode && id) {
      const group = ledgerGroups.find(g => g.id === id);
      if (group) {
        setFormData({
          name: group.name,
          type: group.type,
          parent: group.parent
        });
      }
    }
  }, [id, isEditMode, ledgerGroups]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && id) {
      // Update existing group (not implemented yet)
    } else {
      // Create new group
      const newGroup: LedgerGroup = {
        id: (ledgerGroups.length + 1).toString(),
        ...formData
      };
      
      addLedgerGroup(newGroup);
    }
    
    navigate('/masters/group');
  };

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
            title="Back to Group List"
          onClick={() => navigate('/masters/group')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Group</h1>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Group Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="type">
                Group Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              >
                <option value="capital">Capital Account</option>
                <option value="loans">Loans (Liability)</option>
                <option value="current-liabilities">Current Liabilities</option>
                <option value="fixed-assets">Fixed Assets</option>
                <option value="current-assets">Current Assets</option>
                <option value="purchase">Purchases</option>
                <option value="direct-expenses">Direct Expenses</option>
                <option value="sales">Sales</option>
                <option value="indirect-expenses">Indirect Expenses</option>
                <option value="indirect-income">Indirect Income</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="parent">
                Parent Group
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parent || ''}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              >
                <option value="">No Parent Group</option>
                {ledgerGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
            title='Cancel Group Creation'
              type="button"
              onClick={() => navigate('/masters/group')}
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
            title='Save Group'
              type="submit"
              className={`flex items-center px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={18} className="mr-1" />
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Keyboard Shortcuts:</span> F9 to save, F12 to configure, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default GroupForm;