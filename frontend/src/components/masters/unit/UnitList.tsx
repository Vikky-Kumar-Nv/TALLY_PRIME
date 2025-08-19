import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const UnitList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  interface Unit { id: string; name: string; symbol: string; }
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // fixed page size

  // 🔹 Fetch units from backend
  const fetchUnits = async () => {
    try {
      const res = await fetch('https://tally-backend-dyn3.onrender.com/api/stock-units');
      const data = await res.json();
      setUnits(data);
    } catch (err) {
      console.error('Failed to fetch units:', err);
    }
  };

  // 🔹 Delete unit with confirmation
  const handleDelete = async (unitId: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the unit.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/stock-units/${unitId}`, {
          method: 'DELETE'
        });

        const result = await res.json();

        if (!res.ok) {
          Swal.fire('Error', result.message || 'Failed to delete unit', 'error');
          return;
        }

        Swal.fire('Deleted!', result.message || 'Unit deleted successfully', 'success');
        fetchUnits(); // Refresh list
      } catch {
        Swal.fire('Error', 'Server error. Please try again later.', 'error');
      }
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination derived
  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + itemsPerPage);

  // Reset page on search change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);
  // Clamp if shrink
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  return (
    <div className='pt-[56px] px-4 '>
        <div className="flex justify-between items-center mb-6">
         <div className="flex items-center mb-6">        
          <button
            title="Back to Masters"
            onClick={() => navigate('/app/masters')}
            className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <ArrowLeft size={20} />
          </button>
        <h1 className="text-2xl font-bold">Units of Measurement</h1>
        </div>
        <button
          title='Create New Unit'
          onClick={() => navigate('/app/masters/unit/create')}
          className={`flex items-center px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Unit
        </button>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-4">
          <div className={`flex items-center w-full max-w-md px-3 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className="mr-2 opacity-70" />
            <input
              type="text"
              placeholder="Search units..."
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
              <tr className={`${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUnits.map((unit) => (
                <tr 
                  key={unit.id}
                  className={`${
                    theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
                  } hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className="px-4 py-3">{unit.name}</td>
                  <td className="px-4 py-3 font-mono">{unit.symbol}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title="Edit Unit"
                        onClick={() => navigate(`/app/masters/unit/edit/${unit.id}`)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Delete Unit"
                        onClick={() => handleDelete(unit.id)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
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

        {filteredUnits.length === 0 && (
          <div className="text-center py-8">
            <p className="opacity-70">No units found matching your search.</p>
          </div>
        )}
        {/* Pagination Controls */}
        {filteredUnits.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-xs opacity-70">
              Showing {filteredUnits.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUnits.length)} of {filteredUnits.length} units (Rows per page: {itemsPerPage})
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

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press Alt+F3 to access Masters, then use arrow keys to navigate to Units.
        </p>
      </div>
    </div>
  );
};

export default UnitList;
