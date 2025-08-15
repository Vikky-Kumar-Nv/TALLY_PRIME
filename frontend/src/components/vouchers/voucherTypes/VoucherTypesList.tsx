import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Settings, FileText, Search, Filter } from 'lucide-react';

interface VoucherType {
  id: string;
  name: string;
  type: string;
  abbreviation: string;
  numberingMethod: 'automatic' | 'manual';
  useCommonNarration: boolean;
  printAfterSaving: boolean;
  useEffectiveDates: boolean;
  makeOptionalDefault: boolean;
  restartNumbering: {
    applicable: boolean;
    startingNumber: number;
    particulars: string;
  };
  prefixDetails: {
    applicable: boolean;
    particulars: string;
  };
  suffixDetails: {
    applicable: boolean;
    particulars: string;
  };
  narrationsForEachEntry: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const VoucherTypesList: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();

  // Theme tokens
  const containerBg = theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm border border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const headerText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const rowHover = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    loadVoucherTypes();
  }, []);

  const loadVoucherTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/voucher-types');
      if (response.ok) {
        const data = await response.json();
        setVoucherTypes(data || []);
      } else {
        console.error('Failed to load voucher types');
      }
    } catch (error) {
      console.error('Error loading voucher types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" voucher type?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/voucher-types/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadVoucherTypes();
        } else {
          alert('Failed to delete voucher type');
        }
      } catch (error) {
        console.error('Error deleting voucher type:', error);
        alert('Error deleting voucher type');
      }
    }
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/voucher-types/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (response.ok) {
        await loadVoucherTypes();
      } else {
        alert('Failed to update voucher type status');
      }
    } catch (error) {
      console.error('Error updating voucher type status:', error);
      alert('Error updating voucher type status');
    }
  };

  // Filter voucher types
  const filteredVoucherTypes = voucherTypes.filter(voucherType => {
    const matchesSearch = voucherType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucherType.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucherType.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filterType || voucherType.type === filterType;
    const matchesStatus = showInactive || voucherType.isActive;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get unique types for filter
  const uniqueTypes = [...new Set(voucherTypes.map(v => v.type))].sort();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'payment': 'Payment',
      'receipt': 'Receipt',
      'contra': 'Contra',
      'journal': 'Journal',
      'sales': 'Sales',
      'purchase': 'Purchase',
      'credit-note': 'Credit Note',
      'debit-note': 'Debit Note',
      'delivery-note': 'Delivery Note',
      'sales-order': 'Sales Order',
      'purchase-order': 'Purchase Order',
      'quotation': 'Quotation',
      'stock-journal': 'Stock Journal'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'payment': 'bg-red-100 text-red-800',
      'receipt': 'bg-green-100 text-green-800',
      'contra': 'bg-purple-100 text-purple-800',
      'journal': 'bg-amber-100 text-amber-800',
      'sales': 'bg-blue-100 text-blue-800',
      'purchase': 'bg-indigo-100 text-indigo-800',
      'credit-note': 'bg-teal-100 text-teal-800',
      'debit-note': 'bg-rose-100 text-rose-800',
      'delivery-note': 'bg-cyan-100 text-cyan-800',
      'sales-order': 'bg-sky-100 text-sky-800',
      'purchase-order': 'bg-violet-100 text-violet-800',
      'quotation': 'bg-pink-100 text-pink-800',
      'stock-journal': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="pt-[56px] px-4 min-h-screen flex items-center justify-center">
        <div className={`text-center ${mutedText}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading voucher types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[56px] px-4 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/app/vouchers')}
              className={`mr-4 p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Back to Vouchers"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${headerText} flex items-center`}>
                <Settings className="mr-3 text-blue-600" size={28} />
                Voucher Types Management
              </h1>
              <p className={`text-sm mt-1 ${mutedText}`}>
                Create and manage custom voucher types for your business
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/app/vouchers/types/create')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Plus size={16} className="mr-2" />
            Create Voucher Type
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-lg mb-6 ${containerBg}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Search</label>
            <div className="relative">
              <Search size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${mutedText}`} />
              <input
                type="text"
                placeholder="Search voucher types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
              title="Filter voucher types by category"
              aria-label="Filter by voucher type"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Status</label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show Inactive</span>
            </label>
          </div>

          <div className="flex items-end">
            <div className={`text-sm ${mutedText}`}>
              Showing {filteredVoucherTypes.length} of {voucherTypes.length} voucher types
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Types List */}
      <div className={`rounded-lg overflow-hidden ${containerBg}`}>
        {filteredVoucherTypes.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className={`mx-auto mb-4 opacity-50 ${mutedText}`} />
            <p className="text-lg font-medium mb-2">No voucher types found</p>
            <p className={`text-sm ${mutedText} mb-4`}>
              {voucherTypes.length === 0 
                ? 'Create your first voucher type to get started!'
                : 'Try adjusting your search or filters.'}
            </p>
            {voucherTypes.length === 0 && (
              <button
                onClick={() => navigate('/app/vouchers/types/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Voucher Type
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Abbreviation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Numbering</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Options</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${borderColor}`}>
                {filteredVoucherTypes.map((voucherType) => (
                  <tr key={voucherType.id} className={`${rowHover} transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{voucherType.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(voucherType.type)}`}>
                        {getTypeLabel(voucherType.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium">{voucherType.abbreviation}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm">{voucherType.numberingMethod}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {voucherType.useCommonNarration && (
                          <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                            Common Narration
                          </span>
                        )}
                        {voucherType.printAfterSaving && (
                          <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                            Auto Print
                          </span>
                        )}
                        {voucherType.useEffectiveDates && (
                          <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            Effective Dates
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActiveStatus(voucherType.id, voucherType.isActive)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voucherType.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {voucherType.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(voucherType.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/app/vouchers/types/edit/${voucherType.id}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                          title="Edit voucher type"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(voucherType.id, voucherType.name)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-600'
                          }`}
                          title="Delete voucher type"
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
        )}
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg ${containerBg}`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{voucherTypes.length}</h3>
              <p className={`text-sm ${mutedText}`}>Total Types</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${containerBg}`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'}`}>
              <Settings size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{voucherTypes.filter(v => v.isActive).length}</h3>
              <p className={`text-sm ${mutedText}`}>Active Types</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${containerBg}`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${theme === 'dark' ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
              <Settings size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{voucherTypes.filter(v => v.numberingMethod === 'automatic').length}</h3>
              <p className={`text-sm ${mutedText}`}>Auto Numbering</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${containerBg}`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg mr-4 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
              <Filter size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{uniqueTypes.length}</h3>
              <p className={`text-sm ${mutedText}`}>Unique Categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherTypesList;
