import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { ArrowLeft, Save, Printer } from 'lucide-react';
import type { StockCategory } from '../../../types';
import Swal from 'sweetalert2';

// Runtime error helper
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try { return JSON.stringify(err); } catch { return 'Unknown error'; }
};

const StockCategoryForm: React.FC = () => {
  const { theme, companyInfo } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Mock stockCategories and functions since they're not in context
  const stockCategories = useMemo<StockCategory[]>(() => [], []);
  // Keep placeholders (could be replaced with context if available)
  const addStockCategory = useCallback((category: StockCategory) => {
    console.log('Add stock category (local placeholder):', category);
  }, []);
  const updateStockCategory = useCallback((category: StockCategory) => {
    console.log('Update stock category (local placeholder):', category);
  }, []);

  const initialFormData: StockCategory = {
    id: '',
    name: '',
    parent: '',
    description: '',
  };

  const [formData, setFormData] = useState<StockCategory>(
    isEditMode ? stockCategories.find((c: StockCategory) => c.id === id) || initialFormData : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Stock category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    if (!isEditMode) {
      const newCategory: StockCategory = {
        ...formData,
        id: `SC-${Date.now()}`
      };
      try {
        const res = await fetch('https://tally-backend-dyn3.onrender.com/api/stock-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        });
        const data = await res.json();
        if (res.ok) {
          addStockCategory(newCategory);
          Swal.fire('Success', data.message || 'Stock Category created', 'success');
          navigate('/app/masters/stock-categories');
        } else {
          Swal.fire('Error', data.message || 'Failed to create Stock Category', 'error');
        }
      } catch (err) {
        Swal.fire('Error', getErrorMessage(err), 'error');
      }
    } else {
      // Edit mode
      if (!id) return; // safety
      const updated: StockCategory = { ...formData, id };
      try {
        const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/stock-categories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        const data = await res.json();
        if (res.ok) {
          updateStockCategory(updated);
          Swal.fire('Success', data.message || 'Stock Category updated', 'success');
          navigate('/app/masters/stock-categories');
        } else {
          Swal.fire('Error', data.message || 'Failed to update Stock Category', 'error');
        }
      } catch (err) {
        Swal.fire('Error', getErrorMessage(err), 'error');
      }
    }
  }, [isEditMode, formData, id, navigate, validateForm, addStockCategory, updateStockCategory]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Stock Category Details</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { font-size: 24px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            </style>
          </head>
          <body>
            <h1>${companyInfo?.name || 'Hanuman Car Wash'} - Stock Category Details</h1>
            <table>
              <tr><th>Name</th><td>${formData.name}</td></tr>
              <tr><th>Parent Category</th><td>${stockCategories.find((c: StockCategory) => c.id === formData.parent)?.name || 'None'}</td></tr>
              <tr><th>Description</th><td>${formData.description || 'N/A'}</td></tr>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [formData, stockCategories, companyInfo]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSubmit();
    } else if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      handlePrint();
    } else if (e.key === 'Escape') {
      navigate('/app/masters/stock-categories');
    }
  }, [handleSubmit, handlePrint, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`pt-[56px] px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center mb-6">
        <button
          title="Back to Stock Categories"
          onClick={() => navigate('/app/masters')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {isEditMode ? 'Edit Stock Category' : 'New Stock Category'}
        </h1>
        <div className="ml-auto flex space-x-2">
          <button
            title="Save Stock Category"
            onClick={handleSubmit}
            className={`p-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center`}
          >
            <Save size={18} className="mr-2" /> Save
          </button>
          <button
            title="Print Stock Category"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter stock category name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Name Under (Parent Category)
            </label>
            <select
              title="Select Parent Category"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
            >
              <option value="">None</option>
              {stockCategories.filter((c: StockCategory) => c.id !== formData.id).map((category: StockCategory) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+S to save, Ctrl+P to print, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default StockCategoryForm;