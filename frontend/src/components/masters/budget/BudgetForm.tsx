import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';

interface BudgetFormData {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'draft' | 'active';
}

const BudgetForm: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'draft'
  });

  useEffect(() => {
    if (isEditMode && id) {
      // Fetch budget data by id and set form data
      // This is a placeholder - implement actual data fetching
      setFormData({
        name: 'Sample Budget',
        startDate: '2024-04-01',
        endDate: '2025-03-31',
        description: 'Annual budget for FY 2024-25',
        status: 'draft'
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log("Response:", res.status, data); // ✅ Debug

    if (res.ok) {
            Swal.fire('Success', data.message, 'success');
            navigate('/masters/budgets');
          } else {
            Swal.fire('Error', data.message || 'Insert failed', 'error');
          }
  } catch (err) {
    console.error('Submit Error:', err);
    Swal.fire('Error', 'Something went wrong!', 'error');
  }
};




  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
            title='Back to Budget List'
          onClick={() => navigate('/masters/budgets')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Budget</h1>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Budget Name
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
              <label className="block text-sm font-medium mb-1" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
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
              <label className="block text-sm font-medium mb-1" htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } outline-none transition-colors`}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/masters/budgets')}
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
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
          <span className="font-semibold">Keyboard Shortcuts:</span> F9 to save, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default BudgetForm;