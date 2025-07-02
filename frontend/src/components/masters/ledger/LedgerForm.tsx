import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { Ledger } from '../../../types';
import type { LedgerGroup } from '../../../types';
import { ArrowLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';

const LedgerForm: React.FC = () => {
const { theme, ledgers } = useAppContext();
const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>([]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState<Omit<Ledger, 'id'>>({
    name: '',
    groupId: '',
    openingBalance: 0,
    balanceType: 'debit',
    address: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: ''
  });

  useEffect(() => {
    const fetchLedgerGroups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ledger-groups");
        const data = await res.json();
        setLedgerGroups(data);
      } catch (err) {
        console.error("Failed to load ledger groups", err);
      }
    };

    fetchLedgerGroups();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      const ledger = ledgers.find(l => l.id === id);
      if (ledger) {
        setFormData({
          name: ledger.name,
          groupId: ledger.groupId,
          openingBalance: ledger.openingBalance,
          balanceType: ledger.balanceType,
          address: ledger.address || '',
          email: ledger.email || '',
          phone: ledger.phone || '',
          gstNumber: ledger.gstNumber || '',
          panNumber: ledger.panNumber || ''
        });
      }
    }
  }, [id, isEditMode, ledgers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (isEditMode && id) {
  //     // Update existing ledger (not implemented yet)
  //     // Would update the ledger with the id
  //   } else {
  //     // Create new ledger
  //     const newLedger: Ledger = {
  //       id: (ledgers.length + 1).toString(),
  //       ...formData
  //     };
      
  //     addLedger(newLedger);
  //   }
    
  //   navigate('/masters/ledger');
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/ledger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire("Success", data.message, "success"); // Use sweetalert2
      navigate("/app/masters/ledger");
    } else {
      Swal.fire("Error", data.message || "Failed to create ledger", "error");
    }
  } catch (err) {
    console.error("Submit error:", err);
    Swal.fire("Error", "Something went wrong!", "error");
  }
};

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/app/masters/ledger')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit' : 'Create'} Ledger</h1>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Ledger Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="groupId">
                Under Group
              </label>
              <select
                id="groupId"
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              >
                <option value="">Select Group</option>
                {ledgerGroups.map((group: LedgerGroup) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>

            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="openingBalance">
                Opening Balance
              </label>
              <input
                type="number"
                id="openingBalance"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                step="0.01"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="balanceType">
                Balance Type
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="balanceType"
                    value="debit"
                    checked={formData.balanceType === 'debit'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Dr (Debit)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="balanceType"
                    value="credit"
                    checked={formData.balanceType === 'credit'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Cr (Credit)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className={`p-4 mb-6 rounded ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className="font-semibold mb-4">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } outline-none transition-colors`}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500'
                    } outline-none transition-colors`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                        : 'bg-white border-gray-300 focus:border-blue-500'
                    } outline-none transition-colors`}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="gstNumber">
                  GST Number
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } outline-none transition-colors`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="panNumber">
                  PAN Number
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } outline-none transition-colors`}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/app/masters/ledger')}
              className={`px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center px-4 py-2 rounded ${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={18} className="mr-1" />
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerForm;