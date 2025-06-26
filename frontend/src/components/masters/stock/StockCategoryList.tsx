
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const StockCategoryList = () => {
  const { theme } = useAppContext();
  return (
    <div className={`pt-[56px] p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Stock Categories
        </h1>
        <Link
          to="/masters/stock-category/create"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </Link>
      </div>

      <div className={`rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th 
                      scope="col" 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      Name
                    </th>
                    <th 
                      scope="col" 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      Description
                    </th>
                    <th 
                      scope="col" 
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  theme === 'dark' 
                    ? 'bg-gray-800 divide-gray-700' 
                    : 'bg-white divide-gray-200'
                }`}>
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No categories found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCategoryList;