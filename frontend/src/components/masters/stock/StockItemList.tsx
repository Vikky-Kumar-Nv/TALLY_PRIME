import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, Upload } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
interface StockItem {
  id: string;
  name: string;
  stockGroupId: string;
  unit: string;
  openingBalance: number;
  hsnCode?: string;
  gstRate?: number;
  taxType?: string;
}
const StockItemList = () => {
  const { theme, stockGroups = [], units = [] } = useAppContext();
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/stock-items');
        const json = await res.json();

        if (json.success) {
          setStockItems(json.data);
        } else {
          console.error('API returned failure:', json.message);
        }
      } catch (err) {
        console.error('❌ Failed to fetch stock items:', err);
      }
    };

    fetchData();
  }, []);



  const handleDelete = (id: string) => {
    const itemToDelete = stockItems.find(item => item.id === id);
    if (!itemToDelete) {
      alert('Stock item not found.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`)) {
      // TODO: Implement proper delete functionality when deleteStockItem is available in context
      // For now, we'll just show a message since deletion requires backend integration
      alert('Delete functionality requires backend integration. Please implement the delete API endpoint and update the context.');
      console.log('Stock item to delete:', itemToDelete);
    }
  };

  const handleEdit = (id: string) => {
    const itemToEdit = stockItems.find(item => item.id === id);
    if (!itemToEdit) {
      alert('Stock item not found.');
      return;
    }
    navigate(`/app/masters/stock-item/edit/${id}`);
  };

  return (
    <div className="pt-[56px] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Items</h1>
        <div className="flex gap-3">
          <Link
            to="/app/masters/stock-item/batches"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Package size={18} />
            <span>Batch Management</span>
          </Link>
          <Link
            to="/app/masters/stock-item/bulk-create"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Upload size={18} />
            <span>Bulk Creation</span>
          </Link>
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
                            onClick={() => handleEdit(item.id)}
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