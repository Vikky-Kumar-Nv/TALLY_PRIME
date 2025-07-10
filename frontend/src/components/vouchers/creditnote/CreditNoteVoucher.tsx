import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { VoucherEntry } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';

const CreditNoteVoucher: React.FC = () => {
  const { theme, ledgers, stockItems, addVoucher } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'credit-note',
    number: '',
    narration: '',
    mode: 'accounting-invoice', // Default to accounting mode
    partyId: '',
    entries: [
      { id: '1', ledgerId: '', amount: 0, type: 'debit' },
      { id: '2', ledgerId: '', amount: 0, type: 'credit' }
    ]
  });

  // Safe fallbacks for context data
  const safeStockItems = stockItems || [];
  const safeLedgers = ledgers || [];

  // Helper functions
  const getPartyBalance = (partyId: string) => {
    const party = safeLedgers.find(l => l.id === partyId);
    return party ? (party.openingBalance || 0) : 0;
  };

  const getItemDetails = (itemId: string) => {
    const item = safeStockItems.find(i => i.id === itemId);
    return item ? {
      name: item.name,
      unit: item.unit,
      rate: item.standardSaleRate || 0,
      hsnCode: item.hsnCode || '',
      gstRate: item.gstRate || 0
    } : {
      name: '',
      unit: '',
      rate: 0,
      hsnCode: '',
      gstRate: 0
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle mode change - reset entries when mode changes
    if (name === 'mode') {
      const newMode = value as 'item-invoice' | 'accounting-invoice' | 'as-voucher';
      setFormData(prev => ({
        ...prev,
        mode: newMode,
        entries: newMode === 'item-invoice' ? [
          { id: 'e1', itemId: '', quantity: 0, rate: 0, amount: 0, type: 'debit', cgstRate: 0, sgstRate: 0, igstRate: 0, godownId: '', discount: 0, hsnCode: '' }
        ] : [
          { id: '1', ledgerId: '', amount: 0, type: 'debit' },
          { id: '2', ledgerId: '', amount: 0, type: 'credit' }
        ]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const updatedEntries = [...formData.entries];
    const entry = updatedEntries[index];

    if (formData.mode === 'item-invoice') {
      if (name === 'itemId') {
        const itemDetails = getItemDetails(value);
        updatedEntries[index] = {
          ...entry,
          itemId: value,
          rate: itemDetails.rate,
          hsnCode: itemDetails.hsnCode,
          cgstRate: itemDetails.gstRate / 2, // Assuming intrastate
          sgstRate: itemDetails.gstRate / 2,
          igstRate: 0,
          amount: ((entry.quantity ?? 0) * itemDetails.rate * (1 + itemDetails.gstRate / 100)) - (entry.discount ?? 0)
        };
      } else if (name === 'quantity' || name === 'rate' || name === 'discount') {
        const quantity = name === 'quantity' ? parseFloat(value) || 0 : (entry.quantity ?? 0);
        const rate = name === 'rate' ? parseFloat(value) || 0 : (entry.rate ?? 0);
        const discount = name === 'discount' ? parseFloat(value) || 0 : (entry.discount ?? 0);
        const baseAmount = quantity * rate;
        const gstRate = (entry.cgstRate ?? 0) + (entry.sgstRate ?? 0) + (entry.igstRate ?? 0);
        const gstAmount = baseAmount * gstRate / 100;
        updatedEntries[index] = {
          ...entry,
          [name]: parseFloat(value) || 0,
          amount: (baseAmount + gstAmount) - discount
        };
      } else {
        updatedEntries[index] = {
          ...entry,
          [name]: type === 'number' ? parseFloat(value) || 0 : value
        };
      }
    } else {
      // Accounting mode
      updatedEntries[index] = {
        ...entry,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      };
    }
    
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [
        ...prev.entries,
        formData.mode === 'item-invoice' ? {
          id: `e${prev.entries.length + 1}`,
          itemId: '',
          quantity: 0,
          rate: 0,
          amount: 0,
          type: 'debit',
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
          godownId: '',
          discount: 0,
          hsnCode: ''
        } : {
          id: (prev.entries.length + 1).toString(),
          ledgerId: '',
          amount: 0,
          type: 'credit'
        }
      ]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.entries.length <= 2) return;
    
    const updatedEntries = [...formData.entries];
    updatedEntries.splice(index, 1);
    
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const totalDebit = formData.mode === 'as-voucher' 
    ? formData.entries
        .filter(entry => entry.type === 'debit')
        .reduce((sum, entry) => sum + entry.amount, 0)
    : 0;
    
  const totalCredit = formData.mode === 'as-voucher'
    ? formData.entries
        .filter(entry => entry.type === 'credit')
        .reduce((sum, entry) => sum + entry.amount, 0)
    : 0;
    
  const isBalanced = formData.mode === 'as-voucher' ? totalDebit === totalCredit : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation based on mode
    if (formData.mode === 'as-voucher' && !isBalanced) {
      alert('Total debit must equal total credit');
      return;
    }
    
    if ((formData.mode === 'item-invoice' || formData.mode === 'accounting-invoice') && !formData.partyId) {
      alert('Please select a party');
      return;
    }
    
    const newVoucher: VoucherEntry = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData
    };
    
    addVoucher(newVoucher);
    navigate('/app/vouchers');
  };

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
        title='Back to Vouchers'
          type="button"
          onClick={() => navigate('/app/vouchers')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Credit Note Voucher</h1>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
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
              <label className="block text-sm font-medium mb-1" htmlFor="number">
                Credit Note No.
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Auto"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="mode">
                Voucher Mode
              </label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-500'
                } outline-none transition-colors`}
              >
                <option value="item-invoice">Item Invoice</option>
                <option value="accounting-invoice">Accounting Invoice</option>
                <option value="as-voucher">As Voucher</option>
              </select>
            </div>
          </div>

          {/* Party Selection */}
          {(formData.mode === 'item-invoice' || formData.mode === 'accounting-invoice') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="partyId">
                  Party Name <span className="text-red-500">*</span>
                </label>
                <select
                  id="partyId"
                  name="partyId"
                  value={formData.partyId}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  } outline-none transition-colors`}
                >
                  <option value="">-- Select Party --</option>
                  {safeLedgers
                    .filter(ledger => ledger.type === 'sundry-debtors' || ledger.type === 'sundry-creditors')
                    .map(ledger => (
                      <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                    ))
                  }
                </select>
              </div>
              
              {formData.partyId && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Balance
                  </label>
                  <div className={`w-full p-2 rounded border bg-gray-100 ${
                    theme === 'dark' ? 'bg-gray-600 border-gray-600' : 'border-gray-300'
                  }`}>
                    ₹ {getPartyBalance(formData.partyId).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className={`p-4 mb-6 rounded ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                {formData.mode === 'item-invoice' ? 'Items' : 'Entries'}
              </h3>
              <button
              title='Add Entry'
                type="button"
                onClick={addEntry}
                className={`flex items-center text-sm px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus size={16} className="mr-1" />
                Add {formData.mode === 'item-invoice' ? 'Item' : 'Line'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              {formData.mode === 'item-invoice' ? (
                // Item Invoice Table
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${
                      theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                    }`}>
                      <th className="px-4 py-2 text-left">S.No</th>
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">HSN/SAC</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">Discount</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => {
                      const itemDetails = getItemDetails(entry.itemId || '');
                      return (
                        <tr 
                          key={index}
                          className={`${
                            theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                          }`}
                        >
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">
                            <select
                              title='Select Item'
                              name="itemId"
                              value={entry.itemId || ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              className={`w-full p-1 rounded border ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500'
                              } outline-none transition-colors`}
                            >
                              <option value="">-- Select Item --</option>
                              {safeStockItems.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='HSN/SAC Code'
                              type="text"
                              name="hsnCode"
                              value={entry.hsnCode || ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              placeholder="HSN/SAC"
                              className={`w-full p-1 rounded border ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500'
                              } outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Quantity'
                              type="number"
                              name="quantity"
                              value={entry.quantity ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              min="0"
                              step="0.01"
                              className={`w-full p-1 rounded border text-right ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500'
                              } outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2">{itemDetails.unit}</td>
                          <td className="px-4 py-2">
                            <input
                              title='Rate'
                              type="number"
                              name="rate"
                              value={entry.rate ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`w-full p-1 rounded border text-right ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500'
                              } outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Discount'
                              type="number"
                              name="discount"
                              value={entry.discount ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`w-full p-1 rounded border text-right ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                  : 'bg-white border-gray-300 focus:border-blue-500'
                              } outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">{(entry.amount || 0).toLocaleString()}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              title='Remove Item'
                              type="button"
                              onClick={() => removeEntry(index)}
                              disabled={formData.entries.length <= 1}
                              className={`p-1 rounded ${
                                formData.entries.length <= 1
                                  ? 'opacity-50 cursor-not-allowed'
                                  : theme === 'dark' 
                                    ? 'hover:bg-gray-600' 
                                    : 'hover:bg-gray-300'
                              }`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : formData.mode === 'accounting-invoice' ? (
                // Accounting Invoice Table
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${
                      theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                    }`}>
                      <th className="px-4 py-2 text-left">Particulars</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Ledger</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr 
                        key={index}
                        className={`${
                          theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                        }`}
                      >
                        <td className="px-4 py-2">
                          <input
                            title='Particulars'
                            type="text"
                            name="narration"
                            value={entry.narration || ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            placeholder="Enter particulars"
                            className={`w-full p-2 rounded border ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            title='Rate'
                            type="number"
                            name="rate"
                            value={entry.rate ?? ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            min="0"
                            step="0.01"
                            className={`w-full p-2 rounded border text-right ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            title='Amount'
                            type="number"
                            name="amount"
                            value={entry.amount}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full p-2 rounded border text-right ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <select
                            title='Select Ledger Account'
                            name="ledgerId"
                            value={entry.ledgerId || ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            className={`w-full p-2 rounded border ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          >
                            <option value="">Select Ledger</option>
                            {safeLedgers.map((ledger) => (
                              <option key={ledger.id} value={ledger.id}>
                                {ledger.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            title='Remove Entry'
                            type="button"
                            onClick={() => removeEntry(index)}
                            disabled={formData.entries.length <= 1}
                            className={`p-1 rounded ${
                              formData.entries.length <= 1
                                ? 'opacity-50 cursor-not-allowed'
                                : theme === 'dark' 
                                  ? 'hover:bg-gray-600' 
                                  : 'hover:bg-gray-300'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // As Voucher Table (Traditional Double Entry)
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${
                      theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                    }`}>
                      <th className="px-4 py-2 text-left">Ledger Account</th>
                      <th className="px-4 py-2 text-left">Dr/Cr</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr 
                        key={index}
                        className={`${
                          theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'
                        }`}
                      >
                        <td className="px-4 py-2">
                          <select
                              title='Select Ledger Account'
                            name="ledgerId"
                            value={entry.ledgerId || ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            className={`w-full p-2 rounded border ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          >
                            <option value="">Select Ledger</option>
                            {safeLedgers.map((ledger) => (
                              <option key={ledger.id} value={ledger.id}>
                                {ledger.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select
                          title='Debit or Credit'
                            name="type"
                            value={entry.type}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            className={`w-full p-2 rounded border ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          >
                            <option value="debit">Dr</option>
                            <option value="credit">Cr</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                          title='Amount'
                            type="number"
                            name="amount"
                            value={entry.amount}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full p-2 rounded border text-right ${
                              theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                                : 'bg-white border-gray-300 focus:border-blue-500'
                            } outline-none transition-colors`}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                          title='Remove Entry'
                            type="button"
                            onClick={() => removeEntry(index)}
                            disabled={formData.entries.length <= 2}
                            className={`p-1 rounded ${
                              formData.entries.length <= 2
                                ? 'opacity-50 cursor-not-allowed'
                                : theme === 'dark' 
                                  ? 'hover:bg-gray-600' 
                                  : 'hover:bg-gray-300'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={`font-semibold ${
                      theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'
                    }`}>
                      <td className="px-4 py-2 text-right" colSpan={2}>Totals:</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col">
                          <span>Dr: {totalDebit.toLocaleString()}</span>
                          <span>Cr: {totalCredit.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {isBalanced ? (
                          <span className={`px-2 py-1 rounded text-xs ${
                            theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                          }`}>
                            Balanced
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${
                            theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                          }`}>
                            Unbalanced
                          </span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="narration">
              Narration
            </label>
            <textarea
              id="narration"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              rows={3}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } outline-none transition-colors`}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/app/vouchers')}
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
              disabled={!isBalanced}
              className={`flex items-center px-4 py-2 rounded ${
                !isBalanced
                  ? 'opacity-50 cursor-not-allowed bg-blue-600'
                  : theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={18} className="mr-1" />
              Save
            </button>
          </div>
        </form>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Credit notes are issued to reduce the amount due from a customer or to a supplier.
        </p>
      </div>
    </div>
  );
};

export default CreditNoteVoucher;