import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { UnitOfMeasurement } from '../../../types';
import Swal from 'sweetalert2'; // Add this at the top

const UnitForm: React.FC = () => {
  const { theme, units, addUnit } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<Omit<UnitOfMeasurement, 'id'>>({
    name: '',
    symbol: ''
  });

  useEffect(() => {
    if (isEditMode && id) {
      const unit = units.find(u => u.id === id);
      if (unit) {
        setFormData({
          name: unit.name,
          symbol: unit.symbol
        });
      }
    }
  }, [id, isEditMode, units]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const apiUrl = 'http://localhost:5000/api/stock-units';
  const method = isEditMode ? 'PUT' : 'POST';
  const url = isEditMode ? `${apiUrl}/${id}` : apiUrl;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (!response.ok) {
      Swal.fire('Error', result.message || 'Something went wrong', 'error');
      return;
    }

    Swal.fire({
      icon: 'success',
      title: isEditMode ? 'Updated Successfully' : 'Unit Created',
      text: result.message
    }).then(() => {
      navigate('/app/masters/units');
    });

  } catch (error) {
    Swal.fire('Error', 'Server error. Please try again later.', 'error');
  }
};


  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
        title='Back to Units'
          onClick={() => navigate('/app/masters/units')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Unit</h1>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Unit Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Kilogram"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="symbol">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
                placeholder="e.g., Kg"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/app/masters/unit')}
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
          <span className="font-semibold">Pro Tip:</span> Press F9 to save, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default UnitForm;