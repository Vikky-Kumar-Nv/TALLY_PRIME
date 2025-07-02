import React, { useState } from 'react';
import { Users, Search, Plus, Edit, Download, Upload,ArrowLeft } from 'lucide-react'; //, Filter 
import { useNavigate } from 'react-router-dom';

interface Deductee {
  id: string;
  name: string;
  pan: string;
  category: 'individual' | 'company' | 'huf' | 'firm' | 'aop' | 'trust';
  address: string;
  email: string;
  phone: string;
  tdsSection: string;
  rate: number;
  threshold: number;
  totalDeducted: number;
  lastDeduction: string;
  status: 'active' | 'inactive';
}

const DeducteeMaster: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const deductees: Deductee[] = [
    {
      id: '1',
      name: 'John Doe',
      pan: 'ABCDE1234F',
      category: 'individual',
      address: '123 Main St, Mumbai, Maharashtra',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      tdsSection: '194J',
      rate: 10,
      threshold: 30000,
      totalDeducted: 125000,
      lastDeduction: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'ABC Contractors Pvt Ltd',
      pan: 'ABCDE5678G',
      category: 'company',
      address: '456 Business Park, Delhi',
      email: 'info@abccontractors.com',
      phone: '+91 9876543211',
      tdsSection: '194C',
      rate: 2,
      threshold: 30000,
      totalDeducted: 450000,
      lastDeduction: '2024-01-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'XYZ Consultancy',
      pan: 'ABCDE9012H',
      category: 'firm',
      address: '789 Tech Hub, Bangalore',
      email: 'contact@xyzconsult.com',
      phone: '+91 9876543212',
      tdsSection: '194J',
      rate: 10,
      threshold: 30000,
      totalDeducted: 280000,
      lastDeduction: '2024-01-18',
      status: 'active'
    },
    {
      id: '4',
      name: 'Property Rentals LLP',
      pan: 'ABCDE3456I',
      category: 'firm',
      address: '321 Commercial Complex, Pune',
      email: 'rent@propertyrentals.com',
      phone: '+91 9876543213',
      tdsSection: '194I',
      rate: 10,
      threshold: 240000,
      totalDeducted: 360000,
      lastDeduction: '2024-01-10',
      status: 'active'
    }
  ];

  // const categories = ['all', 'individual', 'company', 'huf', 'firm', 'aop', 'trust'];

  const filteredDeductees = deductees.filter(deductee => {
    const matchesSearch = deductee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deductee.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deductee.tdsSection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deductee.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'individual':
        return 'bg-blue-100 text-blue-800';
      case 'company':
        return 'bg-green-100 text-green-800';
      case 'firm':
        return 'bg-purple-100 text-purple-800';
      case 'huf':
        return 'bg-yellow-100 text-yellow-800';
      case 'aop':
        return 'bg-orange-100 text-orange-800';
      case 'trust':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen pt-[56px] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
            <button
                title='Back to Reports'
                type='button'
                onClick={() => navigate('/app/tds')}
                className="mr-4 p-2 rounded-full hover:bg-gray-200"
                    >
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Deductee</h1>
         </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Deductee Master</h1>
            </div>
            <div className="flex gap-2">
              <button  
              title='add'
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Deductee
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, PAN, or TDS section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              title='all Categories'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="huf">HUF</option>
              <option value="firm">Firm/LLP</option>
              <option value="aop">AOP/BOI</option>
              <option value="trust">Trust</option>
            </select>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredDeductees.length} of {deductees.length} deductees
            </p>
          </div>

          {/* Deductees Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Name</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">PAN</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Category</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">TDS Section</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Rate</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Total Deducted</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Status</th>
                  <th className="text-left p-4 border-b font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeductees.map((deductee) => (
                  <tr key={deductee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b">
                      <div>
                        <div className="font-medium text-gray-900">{deductee.name}</div>
                        <div className="text-sm text-gray-600">{deductee.email}</div>
                      </div>
                    </td>
                    <td className="p-4 border-b">
                      <span className="font-mono text-sm text-gray-900">{deductee.pan}</span>
                    </td>
                    <td className="p-4 border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(deductee.category)}`}>
                        {deductee.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 border-b">
                      <span className="font-mono text-sm text-gray-900">{deductee.tdsSection}</span>
                    </td>
                    <td className="p-4 border-b">
                      <span className="text-gray-700">{deductee.rate}%</span>
                    </td>
                    <td className="p-4 border-b">
                      <span className="font-medium text-gray-900">₹{deductee.totalDeducted.toLocaleString()}</span>
                    </td>
                    <td className="p-4 border-b">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deductee.status)}`}>
                        {deductee.status}
                      </span>
                    </td>
                    <td className="p-4 border-b">
                      <div className="flex gap-2">
                        <button title='Edit' className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDeductees.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No deductees found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-gray-900">{deductees.length}</div>
            <div className="text-sm text-gray-600">Total Deductees</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600">{deductees.filter(d => d.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Deductees</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">
              ₹{deductees.reduce((sum, d) => sum + d.totalDeducted, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total TDS Deducted</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">
              {Array.from(new Set(deductees.map(d => d.tdsSection))).length}
            </div>
            <div className="text-sm text-gray-600">TDS Sections Used</div>
          </div>
        </div>
      </div>

      {/* Add Deductee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Deductee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="PAN Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select title='Pan Number' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select Category</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="huf">HUF</option>
                <option value="firm">Firm/LLP</option>
                <option value="aop">AOP/BOI</option>
                <option value="trust">Trust</option>
              </select>
              <select title='catogery' className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select TDS Section</option>
                <option value="194C">194C - Contractor</option>
                <option value="194J">194J - Professional</option>
                <option value="194I">194I - Rent</option>
                <option value="194A">194A - Interest</option>
              </select>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Address"
                rows={3}
                className="md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Deductee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeducteeMaster;