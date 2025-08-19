import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';

interface Budget {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active';
}

const BudgetList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // fixed page size

  useEffect(() => {
  fetch('https://tally-backend-dyn3.onrender.com/api/budgets')
      .then(res => res.json())
      .then(data => setBudgets(data))
      .catch(err => console.error('Failed to fetch budgets:', err));
  }, []);

  const filteredBudgets = budgets.filter(budget =>
    budget.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination derived data
  const totalPages = Math.max(1, Math.ceil(filteredBudgets.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBudgets = filteredBudgets.slice(startIndex, startIndex + itemsPerPage);

  // Reset page on search change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);
  // Clamp if shrink
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button title="Back to Dashboard"
                  onClick={() => navigate('/app/masters')}
                  className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <ArrowLeft size={20} />
                </button>
        <h1 className="text-2xl font-bold">Budget List</h1>
        <div className="ml-auto flex space-x-2">

        <button
          title='Create New Budget'
          onClick={() => navigate('/app/masters/budget/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Budget
        </button>
      </div>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-4">
          <div className={`flex items-center w-full max-w-md px-3 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className="mr-2 opacity-70" />
            <input
              type="text"
              placeholder="Search budgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <th className="px-4 py-3 text-left">Budget Name</th>
                <th className="px-4 py-3 text-left">Start Date</th>
                <th className="px-4 py-3 text-left">End Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBudgets.map((budget) => (
                <tr 
                  key={budget.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3">{budget.name}</td>
                  <td className="px-4 py-3">{budget.start_date}</td>
                  <td className="px-4 py-3">{budget.end_date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      budget.status === 'active'
                        ? theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                        : theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {budget.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title='Edit Budget'
                        onClick={() => navigate(`/app/masters/budget/edit/${budget.id}`)}
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title='Delete Budget'
                        className={`p-1 rounded ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBudgets.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No budgets found matching your search.</p>
          </div>
        )}
        {/* Pagination Controls */}
        {filteredBudgets.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-xs opacity-70">
              Showing {filteredBudgets.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBudgets.length)} of {filteredBudgets.length} budgets (Rows per page: {itemsPerPage})
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-md border font-medium text-base ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'}`}
                aria-label="Previous Page"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md text-base border font-medium transition-colors ${page === currentPage ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
              {totalPages > 7 && (
                <span className="px-4 text-base">...</span>
              )}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded-md border font-medium text-base ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} ${theme === 'dark' ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'}`}
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+N to create a new budget, Ctrl+E to edit, Ctrl+D to delete.
        </p>
      </div>
    </div>
  );
};

export default BudgetList;
