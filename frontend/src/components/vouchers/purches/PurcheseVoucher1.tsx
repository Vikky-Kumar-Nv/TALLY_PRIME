import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import type { VoucherEntry, StockItem, Ledger, Godown } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft, Printer } from 'lucide-react';
import styles from './PurchaseVoucher.module.css';

const PurchaseVoucher: React.FC = () => {
  const { theme, stockItems, ledgers, godowns = [], vouchers = [], updateStockItem, addVoucher, companyInfo } = useAppContext();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  // Generate voucher number (e.g., ABC0001)
  const generateVoucherNumber = () => {
    const purchaseVouchers = vouchers.filter(v => v.type === 'purchase');
    const lastNumber = purchaseVouchers.length > 0
      ? parseInt(purchaseVouchers[purchaseVouchers.length - 1].number.replace('ABC', '')) || 0
      : 0;
    return `ABC${(lastNumber + 1).toString().padStart(4, '0')}`;
  };

  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'purchase',
    number: generateVoucherNumber(),
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
  const [showConfig, setShowConfig] = useState(false);  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case 'F9':
        e.preventDefault();
        // Form submission handled by form onSubmit
        break;
      case 'F12':
        e.preventDefault();
        setShowConfig(true);
        break;
      case 'Escape':
        e.preventDefault();
        navigate('/vouchers');
        break;
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  // Printing
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Purchase_Voucher_${formData.number}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body { font-size: 12pt; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 5px; }
        .no-print { display: none; }
      }
    `
  });

  if (!stockItems || !ledgers) {
    console.warn('Stock items or ledgers are undefined in AppContext');
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <h1 className="text-2xl font-bold mb-4">Purchase Voucher</h1>
        <p className="text-red-500">Error: Stock items or ledgers are not available. Please configure them in the application.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;    if (name.startsWith('dispatchDetails.')) {
      const field = name.split('.')[1] as keyof typeof formData.dispatchDetails;
      setFormData(prev => ({
        ...prev,
        dispatchDetails: { 
          ...prev.dispatchDetails, 
          docNo: prev.dispatchDetails?.docNo || '',
          through: prev.dispatchDetails?.through || '',
          destination: prev.dispatchDetails?.destination || '',
          [field]: value 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'mode') {
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
    if (!formData.number) newErrors.number = 'Voucher number is required';

    if (formData.mode === 'item-invoice') {
      formData.entries.forEach((entry, index) => {
        if (!entry.itemId) newErrors[`entry${index}.itemId`] = 'Item is required';
        if ((entry.quantity ?? 0) <= 0) newErrors[`entry${index}.quantity`] = 'Quantity must be greater than 0';
        if (godowns.length > 0 && !entry.godownId) newErrors[`entry${index}.godownId`] = 'Godown is required';
      });
    } else {
      formData.entries.forEach((entry, index) => {
        if (!entry.ledgerId) newErrors[`entry${index}.ledgerId`] = 'Ledger is required';
        if ((entry.amount ?? 0) <= 0) newErrors[`entry${index}.amount`] = 'Amount must be greater than 0';
      });

      const debitTotal = formData.entries
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const creditTotal = formData.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
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
      return { subtotal, gstTotal, discountTotal, total };
    } else {
      const debitTotal = formData.entries
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const creditTotal = formData.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      return { debitTotal, creditTotal, total: debitTotal };
    }
  };
  const handleSubmit = () => {
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
      // Update stock quantities (increase for purchase)
      formData.entries.forEach(entry => {
        if (entry.itemId && entry.quantity) {
          const stockItem = stockItems.find(item => item.id === entry.itemId);
          if (stockItem) {
            updateStockItem(entry.itemId, { openingBalance: stockItem.openingBalance + (entry.quantity ?? 0) });
          }
        }
      });      // Post accounting entries (Note: addLedgerEntry function not available in context)
      const { subtotal = 0, gstTotal = 0, total = 0 } = calculateTotals();
      console.log('Accounting entries would be posted:', {
        subtotal,
        gstTotal,
        total,
        partyId: formData.partyId
      });
    } else {
      // Post ledger entries directly (Note: addLedgerEntry function not available in context)
      console.log('Ledger entries would be posted:', formData.entries);
    }

    navigate('/vouchers');
  };

  const { subtotal = 0, gstTotal = 0, discountTotal = 0, total = 0, debitTotal = 0, creditTotal = 0 } = calculateTotals();

  const getPartyDetails = () => {
    const party = ledgers.find(l => l.id === formData.partyId);
    return party ? `${party.name}${party.address ? ', ' + party.address : ''}${party.gstNumber ? ', GSTIN: ' + party.gstNumber : ''}` : 'N/A';
  };

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
        <h1 className="text-2xl font-bold">Purchase Voucher</h1>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
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
                readOnly
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'} outline-none transition-colors ${errors.number ? 'border-red-500' : ''}`}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
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
                {ledgers.filter(l => l.type && ['sundry-creditors', 'cash', 'current-assets'].includes(l.type)).map((ledger: Ledger) => (
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
                Receipt Doc No.
              </label>
              <input
                type="text"
                id="dispatchDetails.docNo"
                name="dispatchDetails.docNo"
                value={formData.dispatchDetails?.docNo ?? ''}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dispatchDetails.through">
                Receipt Through
              </label>
              <input
                type="text"
                id="dispatchDetails.through"
                name="dispatchDetails.through"
                value={formData.dispatchDetails?.through ?? ''}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dispatchDetails.destination">
                Origin
              </label>
              <input
                type="text"
                id="dispatchDetails.destination"
                name="dispatchDetails.destination"
                value={formData.dispatchDetails?.destination ?? ''}
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
                    {formData.entries.map((entry) => {
                      const selectedItem = stockItems.find(item => item.id === entry.itemId);
                      return (
                        <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                          <td className="px-4 py-2">
                            <select
                              title='Select Item'
                              name="itemId"
                              value={entry.itemId}
                              onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                              required
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${formData.entries.indexOf(entry)}.itemId`] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select Item</option>
                              {stockItems.map((item: StockItem) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                            </select>
                            {errors[`entry${formData.entries.indexOf(entry)}.itemId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${formData.entries.indexOf(entry)}.itemId`]}</p>}
                          </td>
                          <td className="px-4 py-2">
                            {selectedItem?.hsnCode || '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Quantity'
                              type="number"
                              name="quantity"
                              value={entry.quantity ?? ''}
                              onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                              required
                              min="0"
                              step="0.01"
                              className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${formData.entries.indexOf(entry)}.quantity`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`entry${formData.entries.indexOf(entry)}.quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${formData.entries.indexOf(entry)}.quantity`]}</p>}
                          </td>
                          <td className="px-4 py-2">
                            {selectedItem?.unit || '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Rate'
                              type="number"
                              name="rate"
                              value={entry.rate ?? ''}
                              onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                              min="0"
                              step="0.01"
                              className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            {entry.gstRate ?? '-'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Discount'
                              type="number"
                              name="discount"
                              value={entry.discount ?? ''}
                              onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
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
                              onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                              required={godowns.length > 0}
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${formData.entries.indexOf(entry)}.godownId`] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select Godown</option>
                              {godowns.length > 0 ? (
                                godowns.map((godown: Godown) => (
                                  <option key={godown.id} value={godown.id}>{godown.name}</option>
                                ))
                              ) : (
                                <option value="" disabled>No godowns available</option>
                              )}
                            </select>
                            {errors[`entry${formData.entries.indexOf(entry)}.godownId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${formData.entries.indexOf(entry)}.godownId`]}</p>}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              title='Remove Item'
                              type="button"
                              onClick={() => removeEntry(formData.entries.indexOf(entry))}
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
                    {formData.entries.map((entry) => (
                      <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                        <td className="px-4 py-2">
                          <select
                            title='Select Ledger'
                            name="ledgerId"
                            value={entry.ledgerId}
                            onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                            required
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${formData.entries.indexOf(entry)}.ledgerId`] ? 'border-red-500' : ''}`}
                          >
                            <option value="">Select Ledger</option>
                            {ledgers.map((ledger: Ledger) => (
                              <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                            ))}
                          </select>
                          {errors[`entry${formData.entries.indexOf(entry)}.ledgerId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${formData.entries.indexOf(entry)}.ledgerId`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <input
                            title='Enter Amount'
                            type="number"
                            name="amount"
                            value={entry.amount ?? ''}
                            onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${errors[`entry${formData.entries.indexOf(entry)}.amount`] ? 'border-red-500' : ''}`}
                          />
                          {errors[`entry${formData.entries.indexOf(entry)}.amount`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${formData.entries.indexOf(entry)}.amount`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            title='Select Type'
                            name="type"
                            value={entry.type}
                            onChange={(e) => handleEntryChange(formData.entries.indexOf(entry), e)}
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
                            onClick={() => removeEntry(formData.entries.indexOf(entry))}
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
              title='Cancel (Esc)'
              type="button"
              onClick={() => navigate('/vouchers')}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              title='Print'
              type="button"
              onClick={handlePrint}
              className={`flex items-center px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <Printer size={18} className="mr-1" />
              Print
            </button>
            <button
              title='Save Voucher (F9)'
              type="submit"
              className={`flex items-center px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <Save size={18} className="mr-1" />
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Configuration Modal (F12) */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h2 className="text-xl font-bold mb-4">Configure Purchase Voucher</h2>
            <p className="mb-4">Configure GST settings, invoice format, etc.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfig(false)}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}      {/* Print Layout */}
      <div className={styles.printContainer}>
        <div ref={printRef} className={styles.printContent}>
          <div className={styles.printHeader}>
            <div>
              <h1 className={styles.companyTitle}>{companyInfo?.name || 'Your Company'}</h1>
              <p>{companyInfo?.address || 'N/A'}</p>
              <p>GSTIN: {companyInfo?.gstNumber || 'N/A'}</p>
              <p>Phone: {companyInfo?.phoneNumber || 'N/A'}</p>
            </div>
            <div className={styles.invoiceTitle}>
              <h2 className={styles.invoiceHeading}>Purchase Invoice</h2>              <p>Date: {formData.date}</p>
              <p>Voucher No.: {formData.number}</p>
              <p>Reference No.: {formData.referenceNo || 'N/A'}</p>
            </div>
          </div>

          <div className={styles.section}>
            <p><strong>Supplier:</strong> {getPartyDetails()}</p>
            <p><strong>Receipt Details:</strong></p>
            <p>Doc No.: {formData.dispatchDetails?.docNo || 'N/A'}</p>
            <p>Through: {formData.dispatchDetails?.through || 'N/A'}</p>
            <p>Origin: {formData.dispatchDetails?.destination || 'N/A'}</p>
          </div>

          {formData.mode === 'item-invoice' ? (
            <table className={styles.printTable}>              <thead>
                <tr>
                  <th className={styles.printTableCell}>Item</th>
                  <th className={styles.printTableCell}>HSN/SAC</th>
                  <th className={styles.printTableCellRight}>Qty</th>
                  <th className={styles.printTableCell}>Unit</th>
                  <th className={styles.printTableCellRight}>Rate</th>
                  <th className={styles.printTableCellRight}>GST (%)</th>
                  <th className={styles.printTableCellRight}>Discount</th>
                  <th className={styles.printTableCellRight}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.entries.map((entry) => {
                  const selectedItem = stockItems.find(item => item.id === entry.itemId);
                  return (
                    <tr key={entry.id}>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{selectedItem?.name || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{selectedItem?.hsnCode || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.quantity ?? '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{selectedItem?.unit || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.rate?.toLocaleString() ?? '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.gstRate ?? '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.discount?.toLocaleString() ?? '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Subtotal:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={7} style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>GST Total:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{gstTotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={7} style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Discount Total:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{discountTotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={7} style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '5px' }}>Ledger</th>
                  <th style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>Amount</th>
                  <th style={{ border: '1px solid #000', padding: '5px' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {formData.entries.map((entry) => {
                  const selectedLedger = ledgers.find(l => l.id === entry.ledgerId);
                  return (
                    <tr key={entry.id}>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{selectedLedger?.name || '-'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{entry.amount.toLocaleString()}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}>{entry.type}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Debit Total:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{debitTotal.toLocaleString()}</td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>Credit Total:</td>
                  <td style={{ border: '1px solid #000', padding: '5px', textAlign: 'right' }}>{creditTotal.toLocaleString()}</td>
                  <td style={{ border: '1px solid #000', padding: '5px' }}></td>
                </tr>
              </tfoot>
            </table>
          )}

          <div style={{ marginBottom: '20px' }}>
            <p><strong>Narration:</strong> {formData.narration || 'N/A'}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <div>
              <p>For {companyInfo?.name || 'Your Company'}</p>
              <p style={{ marginTop: '40px' }}>Authorized Signatory</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p>Supplier's Signature</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Use Purchase Voucher for recording purchases. Press F8 to create, F9 to save, F12 to configure, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default PurchaseVoucher;