import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAppContext } from '../../../context/AppContext';
import { Save, Plus, Trash2, ArrowLeft, Printer, Settings } from 'lucide-react';
import type { VoucherEntry, Ledger } from '../../../types';

const ReceiptVoucher: React.FC = () => {
  const { theme, companyInfo, vouchers, addVoucher, updateVoucher } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  const generateVoucherNumber = () => {
  const prefix = 'RV';
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit
  return `${prefix}${randomNumber}`;
};
  const initialFormData: Omit<VoucherEntry, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    type: 'receipt',
    number: isEditMode ? '' : generateVoucherNumber(),
    narration: '',
    entries: [
      { id: '1', ledgerId: '', amount: 0, type: 'debit', narration: '' },
      { id: '2', ledgerId: '', amount: 0, type: 'credit', narration: '' },
    ],
    mode: 'double-entry',
    referenceNo: '',
    supplierInvoiceDate: '',
  };

  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>(
    isEditMode ? vouchers.find(v => v.id === id) || initialFormData : initialFormData
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [config, setConfig] = useState({
    autoNumbering: true,
    showReference: true,
    showBankDetails: true,
    showCostCentre: false,
    showEntryNarration: false,
  });

  // Mock cost centres
  const costCentres = useMemo(() => [
    { id: 'CC1', name: 'Washing Department' },
    { id: 'CC2', name: 'Polishing Department' },
  ], []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.number) newErrors.number = 'Voucher number is required';
    if (formData.mode === 'single-entry' && formData.entries.length !== 2) {
      newErrors.entries = 'Single entry mode requires exactly one debit and one credit';
    }
    if (formData.mode === 'single-entry' && formData.entries[0].type !== 'debit') {
      newErrors.entries = 'First entry must be debit (cash/bank) in single entry mode';
    }
    if (formData.mode === 'single-entry' && formData.entries[1].type !== 'credit') {
      newErrors.entries = 'Second entry must be credit (party/income) in single entry mode';
    }
    formData.entries.forEach((entry, index) => {
      if (!entry.ledgerId) newErrors[`ledgerId${index}`] = `Ledger is required for entry ${index + 1}`;
      if (entry.amount <= 0) newErrors[`amount${index}`] = `Amount must be greater than 0 for entry ${index + 1}`;
      if (formData.mode === 'single-entry' && index === 0) {
        const ledger = ledgers.find(l => l.id === entry.ledgerId);
        if (ledger && ledger.type !== 'cash' && ledger.type !== 'bank') {
          newErrors[`ledgerId${index}`] = 'Debit ledger must be Cash or Bank in single entry mode';
        }
      }
      if (formData.mode === 'single-entry' && index === 1) {
        const ledger = ledgers.find(l => l.id === entry.ledgerId);
        if (ledger && ledger.type !== 'sundry-debtors' && ledger.type !== 'indirect-income') {
          newErrors[`ledgerId${index}`] = 'Credit ledger must be Sundry Debtors or Income in single entry mode';
        }
      }
    });
    const totalDebit = formData.entries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    const totalCredit = formData.entries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    if (formData.mode === 'double-entry' && totalDebit !== totalCredit) {
      newErrors.balance = 'Total debit must equal total credit';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEntryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    };
    if (formData.mode === 'single-entry') {
      if (index === 0) updatedEntries[0].type = 'debit';
      if (index === 1) updatedEntries[1].type = 'credit';
      if (name === 'amount' && index === 0) updatedEntries[1].amount = updatedEntries[0].amount;
      if (name === 'amount' && index === 1) updatedEntries[0].amount = updatedEntries[1].amount;
    }
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
    setErrors(prev => ({ ...prev, [`${name}${index}`]: '' }));
  };

  const addEntry = () => {
    if (formData.mode === 'single-entry') return; // No additional entries in single entry mode
    setFormData(prev => ({
      ...prev,
      entries: [
        ...prev.entries,
        { id: (prev.entries.length + 1).toString(), ledgerId: '', amount: 0, type: 'credit', narration: '' },
      ],
    }));
  };

  const removeEntry = (index: number) => {
    if (formData.mode === 'single-entry' || formData.entries.length <= 2) return; // Minimum 2 entries
    const updatedEntries = [...formData.entries];
    updatedEntries.splice(index, 1);
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
    setErrors(prev => ({ ...prev, [`ledgerId${index}`]: '', [`amount${index}`]: '' }));
  };
useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ledger");
        const data = await res.json();
        setLedgers(data);
      } catch (err) {
        console.error("Failed to load ledgers", err);
      }
    };

    fetchLedgers();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    Swal.fire('Validation Error', 'Please fix the errors before submitting.', 'warning');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/vouchers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // your state
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: data.message,
      }).then(() => {
        navigate('/vouchers'); // or your route to go back
      });
    } else {
      Swal.fire('Error', data.message || 'Something went wrong', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire('Network Error', 'Failed to connect to the server.', 'error');
  }
};


  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Receipt Voucher</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { font-size: 24px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            </style>
          </head>
          <body>
            <h1>${companyInfo?.name || 'Hanuman Car Wash'} - Receipt Voucher</h1>
            <table>
              <tr><th>Voucher No.</th><td>${formData.number}</td></tr>
              <tr><th>Date</th><td>${formData.date}</td></tr>
              <tr><th>Mode</th><td>${formData.mode === 'double-entry' ? 'Double Entry' : 'Single Entry'}</td></tr>
              ${formData.referenceNo ? `<tr><th>Reference No.</th><td>${formData.referenceNo}</td></tr>` : ''}
              ${formData.supplierInvoiceDate ? `<tr><th>Reference Date</th><td>${formData.supplierInvoiceDate}</td></tr>` : ''}
              <tr><th>Narration</th><td>${formData.narration || 'N/A'}</td></tr>
            </table>
            <h2>Entries</h2>
            <table>
              <thead>
                <tr>
                  <th>Ledger</th>
                  <th>Type</th>
                  <th>Amount</th>
                  ${config.showEntryNarration ? '<th>Narration</th>' : ''}
                  ${config.showCostCentre ? '<th>Cost Centre</th>' : ''}
                  ${config.showBankDetails && formData.mode === 'single-entry' ? '<th>Bank Details</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${formData.entries.map(entry => `
                  <tr>
                    <td>${ledgers.find(l => l.id === entry.ledgerId)?.name || 'N/A'}</td>
                    <td>${entry.type === 'debit' ? 'Dr' : 'Cr'}</td>
                    <td>${entry.amount.toLocaleString()}</td>
                    ${config.showEntryNarration ? `<td>${entry.narration || 'N/A'}</td>` : ''}
                    ${config.showCostCentre ? `<td>${entry.costCentreId ? costCentres.find(c => c.id === entry.costCentreId)?.name || 'N/A' : 'N/A'}</td>` : ''}
                    ${config.showBankDetails && formData.mode === 'single-entry' && entry.type === 'debit' ? `<td>${entry.bankName || ''} ${entry.chequeNumber || ''}</td>` : ''}
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td>Totals</td>
                  <td></td>
                  <td>Dr: ${formData.entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}<br/>
                      Cr: ${formData.entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</td>
                  ${config.showEntryNarration ? '<td></td>' : ''}
                  ${config.showCostCentre ? '<td></td>' : ''}
                  ${config.showBankDetails && formData.mode === 'single-entry' ? '<td></td>' : ''}
                </tr>
              </tfoot>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [companyInfo, formData, config, ledgers, costCentres]);
    
  useEffect(() => {
    const handleKeyDownWrapper = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
          const event = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(event);
        }
      } else if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (e.key === 'F12') {
        e.preventDefault();
        setShowConfigPanel(!showConfigPanel);
      } else if (e.key === 'Escape') {
        navigate('/vouchers');
      }
    };

    window.addEventListener('keydown', handleKeyDownWrapper);
    return () => window.removeEventListener('keydown', handleKeyDownWrapper);
  }, [showConfigPanel, navigate, handlePrint]);

  const totalDebit = formData.entries
    .filter(entry => entry.type === 'debit')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalCredit = formData.entries
    .filter(entry => entry.type === 'credit')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <div className={`pt-[56px] px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center mb-6">
        <button
          title="Back to Vouchers"
          type="button"
          onClick={() => navigate('/vouchers')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {isEditMode ? 'Edit Receipt Voucher' : 'New Receipt Voucher'}
        </h1>
        <div className="ml-auto flex space-x-2">
          <button
            title="Save Voucher"
            onClick={handleSubmit}
            className={`p-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center`}
            disabled={!isBalanced}
          >
            <Save size={18} className="mr-2" /> Save
          </button>
          <button
            title="Print Voucher"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
          <button
            title="Configure"
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Date
              </label>                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  title="Receipt Date"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Voucher No.
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                readOnly={config.autoNumbering}
                required
                title="Voucher Number"
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500 ${config.autoNumbering ? 'opacity-50' : ''}`}
                placeholder={config.autoNumbering ? 'Auto' : 'Enter voucher number'}
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                title="Entry Mode"
                onChange={e => {
                  const mode = e.target.value as 'double-entry' | 'single-entry';
                  setFormData(prev => ({
                    ...prev,
                    mode,
                    entries: mode === 'single-entry' ? [
                      { id: '1', ledgerId: '', amount: 0, type: 'debit', narration: '' },
                      { id: '2', ledgerId: '', amount: 0, type: 'credit', narration: '' },
                    ] : prev.entries,
                  }));
                }}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
              >
                <option value="double-entry">Double Entry</option>
                <option value="single-entry">Single Entry</option>
              </select>
            </div>
            {config.showReference && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reference No.
                  </label>
                  <input
                    type="text"
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleChange}
                    title="Reference Number"
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                    placeholder="Enter reference number"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reference Date
                  </label>
                  <input
                    type="date"
                    name="supplierInvoiceDate"
                    value={formData.supplierInvoiceDate}
                    onChange={handleChange}
                    title="Reference Date"
                    className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                  />
                </div>
              </>
            )}
          </div>

          {formData.mode === 'single-entry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Receipt Ledger (Cash/Bank)
                </label>
                <select
                  name="ledgerId"
                  value={formData.entries[0].ledgerId}
                  onChange={e => handleEntryChange(0, e)}
                  required
                  title="Receipt Ledger"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                >
                  <option value="">Select Cash/Bank Ledger</option>
                  {ledgers.filter(l => l.type === 'cash' || l.type === 'bank').map((ledger: Ledger) => (
                    <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                  ))}
                </select>
                {errors.ledgerId0 && <p className="text-red-500 text-sm mt-1">{errors.ledgerId0}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Party Ledger
                </label>
                <select
                  name="ledgerId"
                  value={formData.entries[1].ledgerId}
                  onChange={e => handleEntryChange(1, e)}
                  required
                  title="Party Ledger"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                >
                  <option value="">Select Party/Income Ledger</option>
                  {ledgers.filter(l => l.type === 'sundry-debtors' || l.type === 'indirect-income').map((ledger: Ledger) => (
                    <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                  ))}
                </select>
                {errors.ledgerId1 && <p className="text-red-500 text-sm mt-1">{errors.ledgerId1}</p>}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.entries[0].amount}
                  onChange={e => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      entries: [
                        { ...prev.entries[0], amount: value },
                        { ...prev.entries[1], amount: value },
                      ],
                    }));
                    setErrors(prev => ({ ...prev, amount0: '', amount1: '' }));
                  }}
                  required
                  min="0"
                  step="0.01"
                  title="Receipt Amount"
                  placeholder="0.00"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                />
                {errors.amount0 && <p className="text-red-500 text-sm mt-1">{errors.amount0}</p>}
              </div>
              {config.showBankDetails && formData.entries[0].ledgerId && ledgers.find(l => l.id === formData.entries[0].ledgerId)?.type === 'bank' && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.entries[0].bankName || ''}
                      onChange={e => handleEntryChange(0, e)}
                      title="Bank Name"
                      className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Cheque/Transaction ID
                    </label>
                    <input
                      type="text"
                      name="chequeNumber"
                      value={formData.entries[0].chequeNumber || ''}
                      onChange={e => handleEntryChange(0, e)}
                      title="Cheque Number or Transaction ID"
                      className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                      placeholder="Enter cheque number or transaction ID"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {formData.mode === 'double-entry' && (
            <div className={`p-4 mb-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Entries</h3>
                <button
                  type="button"
                  onClick={addEntry}
                  title="Add New Entry Line"
                  className={`flex items-center text-sm px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <Plus size={16} className="mr-1" /> Add Line
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                      <th className="px-4 py-2 text-left">Ledger Account</th>
                      <th className="px-4 py-2 text-left">Dr/Cr</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      {config.showCostCentre && <th className="px-4 py-2 text-left">Cost Centre</th>}
                      {config.showEntryNarration && <th className="px-4 py-2 text-left">Narration</th>}
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr key={index} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                        <td className="px-4 py-2">
                          <select
                            name="ledgerId"
                            value={entry.ledgerId}
                            onChange={e => handleEntryChange(index, e)}
                            required
                            title="Ledger Account"
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                          >
                            <option value="">Select Ledger</option>
                            {ledgers.map((ledger: Ledger) => (
                              <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                            ))}
                          </select>
                          {errors[`ledgerId${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`ledgerId${index}`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            name="type"
                            value={entry.type}
                            onChange={e => handleEntryChange(index, e)}
                            required
                            title="Entry Type"
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                          >
                            <option value="debit">Dr</option>
                            <option value="credit">Cr</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            name="amount"
                            value={entry.amount}
                            onChange={e => handleEntryChange(index, e)}
                            required
                            min="0"
                            step="0.01"
                            title="Entry Amount"
                            placeholder="0.00"
                            className={`w-full p-2 rounded border text-right ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                          />
                          {errors[`amount${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`amount${index}`]}</p>}
                        </td>
                        {config.showCostCentre && (
                          <td className="px-4 py-2">
                            <select
                              name="costCentreId"
                              value={entry.costCentreId || ''}
                              onChange={e => handleEntryChange(index, e)}
                              title="Cost Centre"
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                            >
                              <option value="">None</option>
                              {costCentres.map(cc => (
                                <option key={cc.id} value={cc.id}>{cc.name}</option>
                              ))}
                            </select>
                          </td>
                        )}
                        {config.showEntryNarration && (
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              name="narration"
                              value={entry.narration || ''}
                              onChange={e => handleEntryChange(index, e)}
                              title="Entry Narration"
                              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                              placeholder="Entry narration"
                            />
                          </td>
                        )}
                        <td className="px-4 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeEntry(index)}
                            disabled={formData.entries.length <= 2}
                            title="Remove Entry"
                            className={`p-1 rounded ${formData.entries.length <= 2 ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={2}>Totals:</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col">
                          <span>Dr: {totalDebit.toLocaleString()}</span>
                          <span>Cr: {totalCredit.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center" colSpan={config.showCostCentre && config.showEntryNarration ? 3 : config.showCostCentre || config.showEntryNarration ? 2 : 1}>
                        {isBalanced ? (
                          <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                            Balanced
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
                            Unbalanced
                          </span>
                        )}
                      </td>
                    </tr>
                    {errors.balance && (
                      <tr>
                        <td colSpan={config.showCostCentre && config.showEntryNarration ? 5 : config.showCostCentre || config.showEntryNarration ? 4 : 3}>
                          <p className="text-red-500 text-sm mt-1">{errors.balance}</p>
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Narration
            </label>
            <textarea
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              rows={3}
              title="Voucher Narration"
              placeholder="Enter narration for this voucher"
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
            />
          </div>

          {showConfigPanel && (
            <div className={`p-4 mb-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-4">Configuration (F12)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.autoNumbering}
                    onChange={e => {
                      setConfig(prev => ({ ...prev, autoNumbering: e.target.checked }));
                      if (e.target.checked && !isEditMode) {
                        setFormData(prev => ({ ...prev, number: generateVoucherNumber() }));
                      }
                    }}
                    className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                  />
                  Auto Numbering
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showReference}
                    onChange={e => setConfig(prev => ({ ...prev, showReference: e.target.checked }))}
                    className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                  />
                  Show Reference Fields
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showBankDetails}
                    onChange={e => setConfig(prev => ({ ...prev, showBankDetails: e.target.checked }))}
                    className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                  />
                  Show Bank Details
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showCostCentre}
                    onChange={e => setConfig(prev => ({ ...prev, showCostCentre: e.target.checked }))}
                    className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                  />
                  Show Cost Centre
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.showEntryNarration}
                    onChange={e => setConfig(prev => ({ ...prev, showEntryNarration: e.target.checked }))}
                    className={`mr-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}
                  />
                  Show Narration per Entry
                </label>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+S to save, Ctrl+P to print, F12 to configure, Esc to cancel.
        </p>
      </div>
    </div>
  );
};

export default ReceiptVoucher;