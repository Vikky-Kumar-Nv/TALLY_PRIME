import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { VoucherEntry, StockItem, Ledger, Godown } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';

const SalesVoucher: React.FC = () => {
  const { theme, stockItems, ledgers, godowns = [], updateStockItem, addVoucher } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'sales',
    number: '',
    narration: '',
    referenceNo: '',
    partyId: '',
    mode: 'item-invoice',
    dispatchDetails: { docNo: '', through: '', destination: '' },
    entries: [
      { id: 'e1', itemId: '', quantity: 0, rate: 0, amount: 0, type: 'debit', gstRate: 0, godownId: '', discount: 0 }
    ]
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!stockItems || !ledgers) {
    console.warn('Stock items or ledgers are undefined in AppContext');
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <h1 className="text-2xl font-bold mb-4">Sales Voucher</h1>
        <p className="text-red-500">Error: Stock items or ledgers are not available. Please configure them in the application.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dispatchDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dispatchDetails: { 
          docNo: field === 'docNo' ? value : prev.dispatchDetails?.docNo || '',
          through: field === 'through' ? value : prev.dispatchDetails?.through || '',
          destination: field === 'destination' ? value : prev.dispatchDetails?.destination || ''
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'mode') {
        // Reset entries when mode changes
        setFormData(prev => ({
          ...prev,
          entries: [
            {
              id: 'e1',
              itemId: '',
              ledgerId: '',
              quantity: 0,
              rate: 0,
              amount: 0,
              type: value === 'item-invoice' ? 'debit' : 'debit',
              gstRate: 0,
              godownId: '',
              discount: 0
            }
          ]
        }));
      }
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const updatedEntries = [...formData.entries];
    const entry = updatedEntries[index];

    if (formData.mode === 'item-invoice') {
      if (name === 'itemId') {
        const selectedItem = stockItems.find(item => item.id === value);
        updatedEntries[index] = {
          ...entry,
          itemId: value,
          ledgerId: undefined,
          gstRate: selectedItem?.gstRate ?? 0,
          amount: ((entry.quantity ?? 0) * (entry.rate ?? 0) * (1 + (selectedItem?.gstRate ?? 0) / 100)) - (entry.discount ?? 0)
        };
      } else if (name === 'quantity' || name === 'rate' || name === 'discount') {
        const quantity = name === 'quantity' ? parseFloat(value) || 0 : (entry.quantity ?? 0);
        const rate = name === 'rate' ? parseFloat(value) || 0 : (entry.rate ?? 0);
        const discount = name === 'discount' ? parseFloat(value) || 0 : (entry.discount ?? 0);
        const baseAmount = quantity * rate;
        const gstAmount = baseAmount * (entry.gstRate ?? 0) / 100;
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
      if (name === 'ledgerId') {
        updatedEntries[index] = {
          ...entry,
          ledgerId: value,
          itemId: undefined,
          quantity: undefined,
          rate: undefined,
          gstRate: undefined,
          godownId: undefined,
          discount: undefined
        };
      } else if (name === 'amount') {
        updatedEntries[index] = {
          ...entry,
          amount: parseFloat(value) || 0
        };
      } else {
        updatedEntries[index] = {
          ...entry,
          [name]: value
        };
      }
    }

    setFormData(prev => ({ ...prev, entries: updatedEntries }));
    setErrors(prev => ({ ...prev, [`entry${index}.${name}`]: '' }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: `e${prev.entries.length + 1}`,
          itemId: '',
          ledgerId: '',
          quantity: 0,
          rate: 0,
          amount: 0,
          type: formData.mode === 'item-invoice' ? 'debit' : 'debit',
          gstRate: 0,
          godownId: '',
          discount: 0
        }
      ]
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.entries.length <= 1) return;
    const updatedEntries = [...formData.entries];
    updatedEntries.splice(index, 1);
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.partyId) newErrors.partyId = 'Party is required';

    if (formData.mode === 'item-invoice') {
      formData.entries.forEach((entry, index) => {
        if (!entry.itemId) newErrors[`entry${index}.itemId`] = 'Item is required';
        if ((entry.quantity ?? 0) <= 0) newErrors[`entry${index}.quantity`] = 'Quantity must be greater than 0';
        if (godowns?.length > 0 && !entry.godownId) newErrors[`entry${index}.godownId`] = 'Godown is required';

        if (entry.itemId) {
          const stockItem = stockItems.find(item => item.id === entry.itemId);
          if (stockItem && (entry.quantity ?? 0) > stockItem.openingBalance) {
            newErrors[`entry${index}.quantity`] = `Quantity exceeds available stock (${stockItem.openingBalance})`;
          }
        }
      });
    } else {
      formData.entries.forEach((entry, index) => {
        if (!entry.ledgerId) newErrors[`entry${index}.ledgerId`] = 'Ledger is required';
        if (entry.amount <= 0) newErrors[`entry${index}.amount`] = 'Amount must be greater than 0';
      });

      const debitTotal = formData.entries
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = formData.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);
      if (Math.abs(debitTotal - creditTotal) > 0.01) {
        newErrors.entries = 'Debit and credit amounts must balance';
      }
    }

    if (!formData.entries.length) {
      newErrors.entries = 'At least one entry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    if (formData.mode === 'item-invoice') {
      const subtotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0)), 0);
      const gstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.gstRate ?? 0) / 100), 0);
      const discountTotal = formData.entries.reduce((sum, e) => sum + (e.discount ?? 0), 0);
      const total = subtotal + gstTotal - discountTotal;
      return { 
        subtotal, 
        gstTotal, 
        discountTotal, 
        total,
        debitTotal: 0,
        creditTotal: 0
      };
    } else {
      const debitTotal = formData.entries
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = formData.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);
      return { 
        debitTotal, 
        creditTotal, 
        total: debitTotal,
        subtotal: 0,
        gstTotal: 0,
        discountTotal: 0
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }

    const newVoucher: VoucherEntry = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData
    };
    addVoucher(newVoucher);

    if (formData.mode === 'item-invoice') {
      // Update stock quantities
      formData.entries.forEach(entry => {
        if (entry.itemId && entry.quantity) {
          const stockItem = stockItems.find(item => item.id === entry.itemId);
          if (stockItem) {
            updateStockItem(entry.itemId, { openingBalance: stockItem.openingBalance - entry.quantity });
          }
        }
      });

      // TODO: Implement ledger entry posting when AppContext supports it
      // For now, we only update stock and create the voucher record
    }

    navigate('/vouchers');
  };

  const { subtotal, gstTotal, discountTotal, total, debitTotal, creditTotal } = calculateTotals();

  return (
    <div className='pt-[56px] px-4'>
      <div className="flex items-center mb-6">
        <button
          title='Back to Vouchers'
          onClick={() => navigate('/vouchers')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Sales Voucher</h1>
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
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="number">
                Voucher No.
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Auto"
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="partyId">
                Party Name
              </label>
              <select
                id="partyId"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors.partyId ? 'border-red-500' : ''}`}
              >
                <option value="">Select Party</option>
                {ledgers.filter(l => l.type === 'sundry-debtors' || l.type === 'current-assets').map((ledger: Ledger) => (
                  <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                ))}
              </select>
              {errors.partyId && <p className="text-red-500 text-xs mt-1">{errors.partyId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="referenceNo">
                Reference No.
              </label>
              <input
                type="text"
                id="referenceNo"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dispatchDetails.docNo">
                Dispatch Doc No.
              </label>
              <input
                type="text"
                id="dispatchDetails.docNo"
                name="dispatchDetails.docNo"
                value={formData.dispatchDetails?.docNo}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dispatchDetails.through">
                Dispatch Through
              </label>
              <input
                type="text"
                id="dispatchDetails.through"
                name="dispatchDetails.through"
                value={formData.dispatchDetails?.through}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dispatchDetails.destination">
                Destination
              </label>
              <input
                type="text"
                id="dispatchDetails.destination"
                name="dispatchDetails.destination"
                value={formData.dispatchDetails?.destination}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
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
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              >
                <option value="item-invoice">Item Invoice</option>
                <option value="accounting-invoice">Accounting Invoice</option>
                <option value="as-voucher">As Voucher</option>
              </select>
            </div>
          </div>

          <div className={`p-4 mb-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{formData.mode === 'item-invoice' ? 'Items' : 'Ledger Entries'}</h3>
              <button
                title='Add Entry'
                type="button"
                onClick={addEntry}
                className={`flex items-center text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <Plus size={16} className="mr-1" />
                Add {formData.mode === 'item-invoice' ? 'Item' : 'Ledger'}
              </button>
            </div>
            <div className="overflow-x-auto">
              {formData.mode === 'item-invoice' ? (
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">HSN/SAC</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">GST (%)</th>
                      <th className="px-4 py-2 text-right">Discount</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Godown</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => {
                      const selectedItem = stockItems.find(item => item.id === entry.itemId);
                      return (
                        <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                          <td className="px-4 py-2">
                            <select
                              title='Select Item'
                              name="itemId"
                              value={entry.itemId}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${index}.itemId`] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select Item</option>
                              {stockItems.map((item: StockItem) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                            </select>
                            {errors[`entry${index}.itemId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.itemId`]}</p>}
                          </td>
                          <td className="px-4 py-2">
                            {selectedItem?.hsnCode || '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Quantity'
                              type="number"
                              name="quantity"
                              value={entry.quantity}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              min="0"
                              step="0.01"
                              className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${index}.quantity`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`entry${index}.quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.quantity`]}</p>}
                          </td>
                          <td className="px-4 py-2">
                            {selectedItem?.unit || '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Rate'
                              type="number"
                              name="rate"
                              value={entry.rate}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.gstRate || '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Discount'
                              type="number"
                              name="discount"
                              value={entry.discount}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              title='Select Godown'
                              name="godownId"
                              value={entry.godownId}
                              onChange={(e) => handleEntryChange(index, e)}
                              required={godowns?.length > 0}
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${index}.godownId`] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select Godown</option>
                              {godowns?.length > 0 ? (
                                godowns.map((godown: Godown) => (
                                  <option key={godown.id} value={godown.id}>{godown.name}</option>
                                ))
                              ) : (
                                <option value="" disabled>No godowns available</option>
                              )}
                            </select>
                            {errors[`entry${index}.godownId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.godownId`]}</p>}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              title='Remove Item'
                              type="button"
                              onClick={() => removeEntry(index)}
                              disabled={formData.entries.length <= 1}
                              className={`p-1 rounded ${formData.entries.length <= 1 ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>Subtotal:</td>
                      <td className="px-4 py-2 text-right">{subtotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>GST Total:</td>
                      <td className="px-4 py-2 text-right">{gstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>Discount Total:</td>
                      <td className="px-4 py-2 text-right">{discountTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>Grand Total:</td>
                      <td className="px-4 py-2 text-right">{total.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                      <th className="px-4 py-2 text-left">Ledger</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                        <td className="px-4 py-2">
                          <select
                            title='Select Ledger'
                            name="ledgerId"
                            value={entry.ledgerId}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${index}.ledgerId`] ? 'border-red-500' : ''}`}
                          >
                            <option value="">Select Ledger</option>
                            {ledgers.map((ledger: Ledger) => (
                              <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                            ))}
                          </select>
                          {errors[`entry${index}.ledgerId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.ledgerId`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            title='Enter Amount'
                            type="number"
                            name="amount"
                            value={entry.amount}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${index}.amount`] ? 'border-red-500' : ''}`}
                          />
                          {errors[`entry${index}.amount`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.amount`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            title='Select Type'
                            name="type"
                            value={entry.type}
                            onChange={(e) => handleEntryChange(index, e)}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
                          >
                            <option value="debit">Debit</option>
                            <option value="credit">Credit</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            title='Remove Ledger'
                            type="button"
                            onClick={() => removeEntry(index)}
                            disabled={formData.entries.length <= 1}
                            className={`p-1 rounded ${formData.entries.length <= 1 ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right">Debit Total:</td>
                      <td className="px-4 py-2 text-right">{debitTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right">Credit Total:</td>
                      <td className="px-4 py-2 text-right">{creditTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
            {errors.entries && <p className="text-red-500 text-xs mt-1">{errors.entries}</p>}
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
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              title='Cancel'
              type="button"
              onClick={() => navigate('/vouchers')}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              title='Save Voucher'
              type="submit"
              className={`flex items-center px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <Save size={18} className="mr-1" />
              Save
            </button>
          </div>
        </form>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Use Sales Voucher for recording sales. Press F8 to create, F9 to save, F12 to configure, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default SalesVoucher;
