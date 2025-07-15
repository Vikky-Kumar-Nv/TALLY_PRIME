import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const StockItemList = () => {
  const navigate = useNavigate();
  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stock-items');
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

      <div className="rounded-lg bg-white shadow">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN/SAC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        No stock items found
                      </td>
                    </tr>
                  ) : (
                    stockItems.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stockGroupId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitName || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.openingBalance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.hsnCode || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.gstRate ? `${item.gstRate}%` : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.taxType || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => navigate(`/app/masters/stock-item/edit/${item.id}`)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert('Delete functionality not implemented')}
                            className="text-red-600 hover:text-red-800"
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
