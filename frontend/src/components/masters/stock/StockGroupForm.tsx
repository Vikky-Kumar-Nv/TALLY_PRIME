import { useNavigate } from 'react-router-dom';
import { Save, X,ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const StockGroupForm = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className={`pt-[56px] p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/masters/stock-group')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
          }`}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          New Stock Group
        </h1>
      </div>

      <form className={`rounded-lg shadow p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          <div>
            <label 
              htmlFor="parentGroup" 
              className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Parent Group
            </label>
            <select
              id="parentGroup"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select a parent group</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/masters/stock-group')}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
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