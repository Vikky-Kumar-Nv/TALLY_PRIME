import { useNavigate } from 'react-router-dom';
import { Save, X,ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const StockGroupForm = () => {
    const { theme, } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className='pt-[56px] p-4 '>
      <div className="flex  items-center mb-6">
         <button
          onClick={() => navigate('/masters/ledger')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="text-2xl font-semibold text-gray-900">New Stock Group</h1>
      </div>

      <form className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="parentGroup" className="block text-sm font-medium text-gray-700">
              Parent Group
            </label>
            <select
              id="parentGroup"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a parent group</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/masters/stock-group')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockGroupForm;