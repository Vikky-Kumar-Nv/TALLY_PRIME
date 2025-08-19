import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { LedgerGroup, GstClassification } from '../../../types';
import { Edit, Trash2, Plus, Search , ArrowLeft } from 'lucide-react';

const GroupList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<LedgerGroup[]>([]);
  const [gstClassifications] = useState<GstClassification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // fixed page size

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes] = await Promise.all([
          fetch('https://tally-backend-dyn3.onrender.com/api/ledger-groups'),
        ]);
        const groups = await groupsRes.json();
        setGroups(groups);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    try {
  const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/ledger-groups/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setGroups((prev) => prev.filter((group) => group.id !== id));
        alert(data.message || 'Group deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete group');
      }
    } catch (err) {
      console.error('Group delete error:', err);
      alert('Something went wrong!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      navigate('/app/masters/group/create');
    } else if (e.ctrlKey && e.key === 'a' && groups.length > 0) {
      e.preventDefault();
      navigate(`/app/masters/group/edit/${groups[0].id}`);
    } else if (e.ctrlKey && e.key === 'd' && groups.length > 0) {
      e.preventDefault();
      handleDelete(groups[0].id);
    } else if (e.key === 'F12') {
      e.preventDefault();
      alert('Configuration options not implemented yet.');
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination derived data
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);
  // Clamp current page if data shrinks
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  return (
    <div className="pt-[56px] px-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center mb-6">
        <button
          title="Back to Group List"
          onClick={() => navigate('/app/masters')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Group List</h1>
      </div>
        <button
          type="button"
          title="Create Group"
          onClick={() => navigate('/app/masters/group/create')}
          className={`flex items-center px-4 py-2 rounded text-sm font-medium ${
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus size={18} className="mr-1" />
          Create Group
        </button>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="flex items-center mb-4">
          <div className={`flex items-center w-full max-w-md px-3 py-2 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={18} className={`mr-2 opacity-70 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-transparent border-none outline-none ${
                theme === 'dark' ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Type</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Parent Group</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Allocation Method</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>GST Classification</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>HSN/SAC</th>
                <th className={`px-4 py-3 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Taxability</th>
                <th className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map((group: LedgerGroup) => (
                <tr
                  key={group.id}
                  className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:bg-opacity-10 hover:bg-blue-500`}
                >
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{group.name}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{group.type?.replace(/-/g, ' ').toUpperCase()}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {group.parent ? groups.find((g) => g.id === group.parent)?.name || '-' : '-'}
                  </td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{group.allocationMethod || '-'}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {group.gstDetails?.gstClassificationId
                      ? gstClassifications.find(c => c.id === group.gstDetails?.gstClassificationId)?.name || '-'
                      : '-'}
                  </td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{group.gstDetails?.hsnCode || '-'}</td>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{group.gstDetails?.taxability || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        title="Edit Group"
                        onClick={() => navigate(`/app/masters/group/edit/${group.id}`)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Edit size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                      <button
                        title="Delete Group"
                        onClick={() => handleDelete(group.id)}
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      >
                        <Trash2 size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-8">
            <p className={`opacity-70 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No groups found matching your search.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredGroups.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
            <div className="text-xs opacity-70">
              Showing {filteredGroups.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGroups.length)} of {filteredGroups.length} groups (Rows per page: {itemsPerPage})
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
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+C to create a new group, Ctrl+A to edit first group, Ctrl+D to delete first group, F12 to configure.
        </p>
      </div>
    </div>
  );
};

export default GroupList;