import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const StockItemList = () => {
  const { theme, stockItems = [], stockGroups = [], units = [], updateStockItem, addStockItem } = useAppContext();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stock item?')) {
      addStockItem({ ...stockItems.find(item => item.id === id)!, id: '' }); // Remove by filtering
      updateStockItem(id, { id: '' }); // Dummy update to trigger re-render
    }
  };

  return (
    <div className="pt-[56px] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Items</h1>
        <Link
          to="/app/masters/stock-item/create"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} />
          <span>New Stock Item</span>
        </Link>
      </div>

      <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Name
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Group
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Unit
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Opening Balance
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      HSN/SAC
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      GST Rate
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Tax Type
                    </th>
                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  theme === 'dark' ? 'bg-gray-800 divide-gray-600' : 'bg-white divide-gray-200'
                }`}>
                  {stockItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No stock items found
                      </td>
                    </tr>
                  ) : (
                    stockItems.filter(item => item.id).map((item) => (
                      <tr key={item.id} className={`${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                        }`}>{item.name}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {stockGroups.find(g => g.id === item.stockGroupId)?.name || 'N/A'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {units.find(u => u.id === item.unit)?.name || 'N/A'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.openingBalance}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.hsnCode || 'N/A'}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.gstRate ? `${item.gstRate}%` : 'N/A'}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{item.taxType || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            title='Edit Stock Item'
                            onClick={() => navigate(`/app/masters/stock-item/edit/${item.id}`)}
                            className={`mr-2 p-1 rounded ${
                              theme === 'dark' 
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' 
                                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            title='Delete Stock Item'
                            onClick={() => handleDelete(item.id)}
                            className={`p-1 rounded ${
                              theme === 'dark' 
                                ? 'text-red-400 hover:text-red-300 hover:bg-gray-600' 
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockItemList;