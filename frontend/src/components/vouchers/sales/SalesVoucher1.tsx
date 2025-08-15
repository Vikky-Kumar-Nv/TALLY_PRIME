import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { VoucherEntry, Ledger, Godown, CompanyInfo } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft, Printer } from 'lucide-react';
import Swal from 'sweetalert2';
import EWayBillGeneration from './EWayBillGeneration';
import InvoicePrint from './InvoicePrint';
import PrintOptions from './PrintOptions';
import EInvoiceGeneration from './EInvoiceGeneration';

// DRY Constants for Tailwind Classes
const FORM_STYLES = {
  input: (theme: string, hasError?: boolean) => 
    `w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${hasError ? 'border-red-500' : ''}`,
  select: (theme: string, hasError?: boolean) => 
    `w-full p-2 rounded border cursor-pointer ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors ${hasError ? 'border-red-500' : ''}`,
  tableInput: (theme: string) => 
    `w-full p-1 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`,
  tableSelect: (theme: string) => 
    `w-full p-1 rounded border cursor-pointer ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} outline-none transition-colors`
};

const SalesVoucher: React.FC = () => {
  const { theme, stockItems, ledgers, godowns = [], vouchers = [], companyInfo, addVoucher, updateVoucher } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;
  
  // Check if quotation mode is requested via URL
  const isQuotationMode = searchParams.get('mode') === 'quotation';

  // Safe fallbacks for context data - Remove demo data and use only from context
  const safeStockItems = stockItems || [];
  const safeLedgers = ledgers || [];
  const safeCompanyInfo = companyInfo || {
    name: 'Your Company Name',
    address: 'Your Company Address',
    gstNumber: 'N/A',
    phoneNumber: 'N/A',
    state: 'Default State',
    panNumber: 'N/A',
    pin: '000000'
  } as CompanyInfo;

  // State initialization first
  const [isQuotation, setIsQuotation] = useState(isQuotationMode); // Initialize with URL parameter

  // Generate voucher number (e.g., ABCDEF0001 or QT0001)
  const generateVoucherNumber = useCallback(() => {
    const salesVouchers = vouchers.filter(v => v.type === 'sales');
    const prefix = isQuotation ? 'QT' : 'XYZ';
    const lastNumber = salesVouchers.length > 0
      ? parseInt(salesVouchers[salesVouchers.length - 1].number.replace(/^(XYZ|QT)/, '')) || 0
      : 0;
    return `${prefix}${(lastNumber + 1).toString().padStart(4, '0')}`;
  }, [vouchers, isQuotation]);

  const getInitialFormData = (): Omit<VoucherEntry, 'id'> => {
    if (isEditMode && id) {
      const existingVoucher = vouchers.find(v => v.id === id);
      if (existingVoucher) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...voucherData } = existingVoucher;
        return voucherData;
      }
    }
    return {
      date: new Date().toISOString().split('T')[0],
      type: isQuotation ? 'quotation' : 'sales',
      number: `${isQuotation ? 'QT' : 'XYZ'}0001`, // Will be updated by useEffect
      narration: '',
      referenceNo: '',
      partyId: '',
      mode: 'item-invoice',
      dispatchDetails: { docNo: '', through: '', destination: '' },
      salesLedgerId: '', // Add sales ledger field
      entries: [
        { id: 'e1', itemId: '', quantity: 0, rate: 0, amount: 0, type: 'debit', cgstRate: 0, sgstRate: 0, igstRate: 0, godownId: '', discount: 0, hsnCode: '' }
      ]
    };
  };

  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>(getInitialFormData());
  const [godownEnabled, setGodownEnabled] = useState<'yes' | 'no'>('yes'); // Add state for godown selection visibility
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPrintOptions, setShowPrintOptions] = useState(false); // Print options popup state
  const [showEWayBill, setShowEWayBill] = useState(false); // E-way Bill modal state
  const [showInvoicePrint, setShowInvoicePrint] = useState(false); // Invoice print modal state
  const [showEInvoice, setShowEInvoice] = useState(false); // e-Invoice generation modal state

  // Regenerate voucher number when quotation mode changes
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        number: generateVoucherNumber(),
        type: isQuotation ? 'quotation' : 'sales'
      }));
    }
  }, [isQuotation, isEditMode, generateVoucherNumber]);
  const [showConfig, setShowConfig] = useState(false);
  // Keyboard shortcuts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dispatchDetails.')) {
      const field = name.split('.')[1] as keyof typeof formData.dispatchDetails;
      setFormData(prev => ({
        ...prev,
        dispatchDetails: { 
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
              cgstRate: 0,
              sgstRate: 0,
              igstRate: 0,
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
    const partyLedger = safeLedgers.find(l => l.id === formData.partyId);
    const isIntrastate = partyLedger?.state && safeCompanyInfo.state ? partyLedger.state === safeCompanyInfo.state : true;    if (formData.mode === 'item-invoice') {
      if (name === 'itemId') {
        const itemDetails = getItemDetails(value);
        const gstRate = itemDetails.gstRate;
        const cgstRate = isIntrastate ? gstRate / 2 : 0;
        const sgstRate = isIntrastate ? gstRate / 2 : 0;
        const igstRate = isIntrastate ? 0 : gstRate;
        updatedEntries[index] = {
          ...entry,
          itemId: value,
          ledgerId: undefined,
          rate: itemDetails.rate, // Auto-fill the rate from item details
          hsnCode: itemDetails.hsnCode || '', // Auto-fill HSN code from item
          cgstRate,
          sgstRate,
          igstRate,
          amount: ((entry.quantity ?? 0) * itemDetails.rate * (1 + gstRate / 100)) - (entry.discount ?? 0)
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
      if (name === 'ledgerId') {
        updatedEntries[index] = {
          ...entry,
          ledgerId: value,
          itemId: undefined,
          quantity: undefined,
          rate: undefined,
          cgstRate: undefined,
          sgstRate: undefined,
          igstRate: undefined,
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
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
          godownId: '',
          discount: 0,
          hsnCode: '' // Add HSN code for manual editing
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
      if (!formData.salesLedgerId) newErrors.salesLedgerId = 'Sales Ledger is required';
      
      formData.entries.forEach((entry, index) => {
        if (!entry.itemId) newErrors[`entry${index}.itemId`] = 'Item is required';
        if ((entry.quantity ?? 0) <= 0) newErrors[`entry${index}.quantity`] = 'Quantity must be greater than 0';
        if (godownEnabled === 'yes' && godowns.length > 0 && !entry.godownId) newErrors[`entry${index}.godownId`] = 'Godown is required';

        if (entry.itemId) {
          const stockItem = safeStockItems.find(item => item.id === entry.itemId);
          if (stockItem && (entry.quantity ?? 0) > stockItem.openingBalance) {
            newErrors[`entry${index}.quantity`] = `Quantity exceeds available stock (${stockItem.openingBalance})`;
          }
        }
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
      const cgstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.cgstRate ?? 0) / 100), 0);
      const sgstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.sgstRate ?? 0) / 100), 0);
      const igstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.igstRate ?? 0) / 100), 0);
      const discountTotal = formData.entries.reduce((sum, e) => sum + (e.discount ?? 0), 0);
      const total = subtotal + cgstTotal + sgstTotal + igstTotal - discountTotal;
      return { subtotal, cgstTotal, sgstTotal, igstTotal, discountTotal, total, debitTotal: 0, creditTotal: 0 };
    } else {
      const debitTotal = formData.entries
        .filter(e => e.type === 'debit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      const creditTotal = formData.entries
        .filter(e => e.type === 'credit')
        .reduce((sum, e) => sum + (e.amount ?? 0), 0);
      return { debitTotal, creditTotal, total: debitTotal, subtotal: 0, cgstTotal: 0, sgstTotal: 0, igstTotal: 0, discountTotal: 0 };
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) {
  //     alert('Please fix the errors before submitting');
  //     return;
  //   }

  //   const newVoucher: VoucherEntry = {
  //     id: Math.random().toString(36).substring(2, 9),
  //     ...formData
  //   };
    
  //   console.log('=== SAVING VOUCHER ===');
  //   console.log('Voucher Data:', newVoucher);    console.log('Selected Party:', formData.partyId, formData.partyId ? getPartyName(formData.partyId) : 'No Party');
  //   console.log('Entries Count:', formData.entries.length);
  //   console.log('Totals:', calculateTotals());
    
  //   addVoucher(newVoucher);
  //   alert(`Voucher ${newVoucher.number} saved successfully! Party: ${formData.partyId ? getPartyName(formData.partyId) : 'No Party'}`);
    
  //   if (formData.mode === 'item-invoice') {
  //     // Update stock quantities (decrease for sales)
  //     formData.entries.forEach(entry => {
  //       if (entry.itemId && entry.quantity) {
  //         const stockItem = safeStockItems.find(item => item.id === entry.itemId);
  //         if (stockItem) {
  //           updateStockItem(entry.itemId, { openingBalance: stockItem.openingBalance - (entry.quantity ?? 0) });
  //         }
  //       }
  //     });
  //   }    navigate('/vouchers');
  // };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    alert('Please fix the errors before submitting');
    return;
  }

  try {
    // Add quotation flag to form data and set correct type
    const voucherData = {
      ...formData,
      type: isQuotation ? 'quotation' as VoucherEntry['type'] : 'sales' as VoucherEntry['type'], // Set type as VoucherType
      isQuotation: isQuotation
    };

    if (isEditMode && id) {
      // Update existing voucher via backend
  const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/vouchers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voucherData)
      });

      const data = await res.json();
      console.log('Update response:', data);

      if (res.ok) {
        // Also update context
        updateVoucher(id, voucherData);
        await Swal.fire({
          title: 'Success',
          text: `Sales ${isQuotation ? 'quotation' : 'voucher'} updated successfully!`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to update voucher', 'error');
        return;
      }
    } else {
      // Create new voucher via backend
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voucherData)
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (res.ok) {
        // Also add to context
        const newVoucher: VoucherEntry = {
          ...voucherData,
          id: data.id || Math.random().toString(36).substring(2, 9)
        };
        addVoucher(newVoucher);
        
        await Swal.fire({
          title: 'Success',
          text: `Sales ${isQuotation ? 'quotation' : 'voucher'} saved successfully!`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire('Error', data.message || 'Failed to save voucher', 'error');
        return;
      }
    }
    
    navigate('/app/vouchers');
  } catch (err) {
    console.error('Error:', err);
    Swal.fire('Error', 'Network or server issue', 'error');
  }
};

  // Print Options Handlers
  const handlePrintClick = () => {
    console.log('Print button clicked');
    const selectedItems = formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select');
    
    if (selectedItems.length === 0) {
      alert('Please select at least one item before printing the invoice.');
      return;
    }
    if (!formData.partyId) {
      alert('Please select a party before printing the invoice.');
      return;
    }
    
    // Show print options popup instead of direct print
    setShowPrintOptions(true);
  };

  const handleGenerateInvoice = () => {
    console.log('Generating Invoice...');
    setShowPrintOptions(false);
    setShowInvoicePrint(true); // Show separate invoice print modal
  };

  const handleGenerateEWayBill = () => {
    console.log('Generating E-way Bill...');
    setShowPrintOptions(false);
    setShowEWayBill(true); // Show E-way Bill generation modal
  };

  const handleGenerateEInvoice = () => {
    console.log('Opening e-Invoice Generation modal...');
    setShowPrintOptions(false);
    setShowEInvoice(true);
  };

  const handleSendToEmail = () => {
    console.log('Sending to Email...');
    // TODO: Implement email functionality
    alert('Email sending feature will be implemented soon!');
    setShowPrintOptions(false);
  };

  const handleSendToWhatsApp = () => {
    console.log('Sending to WhatsApp...');
    // TODO: Implement WhatsApp sharing
    alert('WhatsApp sharing feature will be implemented soon!');
    setShowPrintOptions(false);
  };

  const { subtotal = 0, cgstTotal = 0, sgstTotal = 0, igstTotal = 0, discountTotal = 0, total = 0, debitTotal = 0, creditTotal = 0 } = calculateTotals();

  // Helper functions for print layout
  const getItemDetails = (itemId: string) => {
    // First try to get from context stockItems if available
    if (safeStockItems && safeStockItems.length > 0) {
      const stockItem = safeStockItems.find(item => item.id === itemId);
      if (stockItem) {
        return {
          name: stockItem.name,
          hsnCode: stockItem.hsnCode || '-',
          unit: stockItem.unit,
          gstRate: stockItem.gstRate || 0,
          rate: stockItem.standardSaleRate || 0
        };
      }
    }
    
    // Return default item structure if item not found
    return { name: '-', hsnCode: '-', unit: '-', gstRate: 0, rate: 0 };
  };

  const getPartyName = (partyId: string) => {
    if (!safeLedgers || safeLedgers.length === 0) return 'Unknown Party';
    
    const party = safeLedgers.find(ledger => ledger.id === partyId);
    return party ? party.name : 'Unknown Party';
  };

  // Function to get GST rate breakdown and count for invoice
  const getGstRateInfo = () => {
    const selectedItems = formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select');
    const gstRates = new Set<number>();
    const gstBreakdown: { [key: number]: { count: number; totalAmount: number; gstAmount: number; items: string[] } } = {};
    
    selectedItems.forEach(entry => {
      const itemDetails = getItemDetails(entry.itemId || '');
      const gstRate = itemDetails.gstRate || 0;
      const baseAmount = (entry.quantity || 0) * (entry.rate || 0);
      const gstAmount = baseAmount * gstRate / 100;
      
      gstRates.add(gstRate);
      
      if (!gstBreakdown[gstRate]) {
        gstBreakdown[gstRate] = { count: 0, totalAmount: 0, gstAmount: 0, items: [] };
      }
      
      gstBreakdown[gstRate].count += 1;
      gstBreakdown[gstRate].totalAmount += baseAmount;
      gstBreakdown[gstRate].gstAmount += gstAmount;
      gstBreakdown[gstRate].items.push(itemDetails.name);
    });
    
    return {
      uniqueGstRatesCount: gstRates.size,
      gstRatesUsed: Array.from(gstRates).sort((a, b) => a - b),
      totalItems: selectedItems.length,
      breakdown: gstBreakdown
    };
  };

  return (
    <React.Fragment>
      <div className='pt-[56px] px-4'>
      <div className="flex items-center mb-6">
        <button
          title='Back to Vouchers'
          onClick={() => navigate('/app/vouchers')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {isQuotation ? '📋 Sales Quotation' : '📝 Sales Voucher'}
        </h1>
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
                title="Sale Date"
                className={FORM_STYLES.input(theme, !!errors.date)}
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
                title="Voucher Number"
                className={`${FORM_STYLES.input(theme, !!errors.number)} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="partyId">
                Party Name
              </label>               
               <select
               title="Select Party"
                id="partyId"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
                className={`min-h-10 text-14 ${FORM_STYLES.select(theme, !!errors.partyId)}`}
              >
                <option value="" disabled>-- Select Party --</option>
                {safeLedgers && safeLedgers.length > 0 ? (
                  safeLedgers
                    .filter(ledger => ledger.type === 'sundry-debtors' || ledger.type === 'cash')
                    .map(ledger => (
                      <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                    ))
                ) : (
                  <option value="" disabled>No parties available</option>
                )}
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
                title="Reference Number"
                placeholder="Enter reference number"
                className={FORM_STYLES.input(theme)}
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
                value={formData.dispatchDetails?.docNo ?? ''}
                onChange={handleChange}
                title="Dispatch Document Number"
                placeholder="Enter dispatch document number"
                className={FORM_STYLES.input(theme)}
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
                value={formData.dispatchDetails?.through ?? ''}
                onChange={handleChange}
                title="Dispatch Through"
                placeholder="Enter dispatch method"
                className={FORM_STYLES.input(theme)}
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
                value={formData.dispatchDetails?.destination ?? ''}
                onChange={handleChange}
                title="Destination"
                placeholder="Enter destination"
                className={FORM_STYLES.input(theme)}
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
                title="Voucher Mode"
                className={FORM_STYLES.select(theme)}
              >
                <option value="item-invoice">Item Invoice</option>
                <option value="accounting-invoice">Accounting Invoice</option>
                <option value="as-voucher">As Voucher</option>
              </select>
            </div>
          </div>

          {/* Quotation Mode Checkbox - Similar to Tally Prime */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="quotationMode"
                checked={isQuotation}
                onChange={(e) => setIsQuotation(e.target.checked)}
                title="Convert to Quotation Voucher"
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
              <label htmlFor="quotationMode" className="text-sm font-medium cursor-pointer">
                {isQuotation ? '📋 Quotation Mode' : '📝 Sales Mode'}
              </label>
              <span className="text-xs text-gray-500">
                {isQuotation ? '(This will be treated as a quotation)' : '(Check to convert to quotation)'}
              </span>
            </div>
          </div>

          {/* Sales Ledger selection for item-invoice mode */}
          {formData.mode === 'item-invoice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="salesLedgerId">
                  Sales Ledger <span className="text-red-500">*</span>
                </label>              
                <select
                  id="salesLedgerId"
                  name="salesLedgerId"
                  value={formData.salesLedgerId || ''}
                  onChange={handleChange}
                  title="Select Sales Ledger"
                  required
                  className={FORM_STYLES.select(theme, !!errors.salesLedgerId)}
                >
                  <option value="">-- Select Sales Ledger --</option>
                  {safeLedgers
                    .filter(ledger => ledger.type === 'sales' || ledger.name.toLowerCase().includes('sales'))
                    .map(ledger => (
                      <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                    ))
                  }
                  {/* Fallback options if no sales ledgers found */}
                  <option value="sales-general">Sales - General</option>
                  <option value="sales-local">Sales - Local</option>
                  <option value="sales-export">Sales - Export</option>
                </select>
                {errors.salesLedgerId && <p className="text-red-500 text-xs mt-1">{errors.salesLedgerId}</p>}
              </div>
              
              {/* Godown Enable/Disable toggle */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="godownEnabled">
                  Enable Godown Selection
                </label>              
                <select
                  id="godownEnabled"
                  value={godownEnabled}
                  onChange={(e) => setGodownEnabled(e.target.value as 'yes' | 'no')}
                  className={FORM_STYLES.select(theme)}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          )}

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
                      <th className="px-4 py-2 text-left">S.No</th>
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">HSN/SAC</th>
                      <th className="px-4 py-2 text-left">Batch</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">Discount</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      {godownEnabled === 'yes' && (
                        <th className="px-4 py-2 text-left">Godown</th>
                      )}
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>                  <tbody>
                    {formData.entries.map((entry, index) => {
                      const itemDetails = getItemDetails(entry.itemId || '');
                      return (
                        <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">                            
                            <select
                              title='Select Item'
                              name="itemId"
                              value={entry.itemId}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              className={FORM_STYLES.tableSelect(theme)}
                            >
                              <option value="" disabled>-- Select Item --</option>
                              {safeStockItems && safeStockItems.length > 0 ? (
                                safeStockItems.map(item => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                                ))
                              ) : (
                                <option value="" disabled>No items available</option>
                              )}
                            </select>
                            {errors[`entry${index}.itemId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.itemId`]}</p>}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter HSN/SAC Code'
                              type="text"
                              name="hsnCode"
                              value={entry.hsnCode || ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              placeholder="HSN/SAC"
                              className={FORM_STYLES.tableInput(theme)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Batch Number'
                              type="text"
                              name="batchNumber"
                              value={entry.batchNumber || ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              placeholder="Batch No."
                              className={FORM_STYLES.tableInput(theme)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Quantity'
                              type="number"
                              name="quantity"
                              value={entry.quantity ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              required
                              min="0"
                              step="0.01"
                              className={`${FORM_STYLES.tableInput(theme)} text-right ${errors[`entry${index}.quantity`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`entry${index}.quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.quantity`]}</p>}
                          </td>
                          <td className="px-4 py-2">{itemDetails.unit}</td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Rate'
                              type="number"
                              name="rate"
                              value={entry.rate ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`${FORM_STYLES.tableInput(theme)} text-right`}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              title='Enter Discount'
                              type="number"
                              name="discount"
                              value={entry.discount ?? ''}
                              onChange={(e) => handleEntryChange(index, e)}
                              min="0"
                              step="0.01"
                              className={`${FORM_STYLES.tableInput(theme)} text-right`}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">{entry.amount.toLocaleString()}</td>
                          {godownEnabled === 'yes' && (
                            <td className="px-4 py-2">
                              <select
                                title='Select Godown'
                                name="godownId"
                                value={entry.godownId}
                                onChange={(e) => handleEntryChange(index, e)}
                                required={godowns.length > 0}
                                className={`${FORM_STYLES.tableSelect(theme)} ${errors[`entry${index}.godownId`] ? 'border-red-500' : ''}`}
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
                              {errors[`entry${index}.godownId`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.godownId`]}</p>}
                            </td>
                          )}
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
                  </tbody>                  <tfoot>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={8}>Subtotal:</td>
                      <td className="px-4 py-2 text-right">{subtotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={8}>CGST Total:</td>
                      <td className="px-4 py-2 text-right">{cgstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={8}>SGST Total:</td>
                      <td className="px-4 py-2 text-right">{sgstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={8}>IGST Total:</td>
                      <td className="px-4 py-2 text-right">{igstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={8}>Discount Total:</td>
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
                      <th className="px-4 py-2 text-left">S.No</th>
                      <th className="px-4 py-2 text-left">Ledger</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr key={entry.id} className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">
                          <select
                            title='Select Ledger'
                            name="ledgerId"
                            value={entry.ledgerId ?? ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            className={`${FORM_STYLES.tableSelect(theme)} ${errors[`entry${index}.ledgerId`] ? 'border-red-500' : ''}`}
                          >
                            <option value="">Select Ledger</option>
                            {safeLedgers.map((ledger: Ledger) => (
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
                            value={entry.amount ?? ''}
                            onChange={(e) => handleEntryChange(index, e)}
                            required
                            min="0"
                            step="0.01"
                            className={`${FORM_STYLES.tableInput(theme)} text-right ${errors[`entry${index}.amount`] ? 'border-red-500' : ''}`}
                          />
                          {errors[`entry${index}.amount`] && <p className="text-red-500 text-xs mt-1">{errors[`entry${index}.amount`]}</p>}
                        </td>
                        <td className="px-4 py-2">
                          <select
                            title='Select Type'
                            name="type"
                            value={entry.type}
                            onChange={(e) => handleEntryChange(index, e)}
                            className={FORM_STYLES.tableInput(theme)}
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
                  </tbody>                  <tfoot>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={2}>Debit Total:</td>
                      <td className="px-4 py-2 text-right">{debitTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={2}>Credit Total:</td>
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
              title="Voucher Narration"
              placeholder="Enter narration for this sales voucher"
              className={FORM_STYLES.input(theme)}
            />
          </div>          <div className="flex justify-end space-x-4">
            <button
              title='Cancel (Esc)'
              type="button"
              onClick={() => navigate('/app/vouchers')}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button><button
              title='Print'
              type="button"
              onClick={handlePrintClick}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
            <h2 className="text-xl font-bold mb-4">Configure Sales Voucher</h2>
            <p className="mb-4">Configure GST settings, invoice format, etc.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfig(false)}
                title="Close Configuration"
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Options Component */}
      <PrintOptions
        theme={theme}
        showPrintOptions={showPrintOptions}
        onClose={() => setShowPrintOptions(false)}
        onGenerateInvoice={handleGenerateInvoice}
        onGenerateEWayBill={handleGenerateEWayBill}
        onGenerateEInvoice={handleGenerateEInvoice}
        onSendToEmail={handleSendToEmail}
        onSendToWhatsApp={handleSendToWhatsApp}
      />

      {/* E-way Bill Generation Modal */}
      {showEWayBill && (
        <EWayBillGeneration
          theme={theme}
          voucherData={formData}
          onClose={() => setShowEWayBill(false)}
          getPartyName={getPartyName}
          getItemDetails={getItemDetails}
          calculateTotals={calculateTotals}
        />
      )}

      {/* Invoice Print Modal */}
      {showInvoicePrint && (
        <InvoicePrint
          theme={theme}
          voucherData={formData}
          isQuotation={isQuotation}
          onClose={() => setShowInvoicePrint(false)}
          getPartyName={getPartyName}
          getItemDetails={getItemDetails}
          calculateTotals={calculateTotals}
          getGstRateInfo={getGstRateInfo}
          companyInfo={safeCompanyInfo}
          ledgers={safeLedgers}
        />
      )}

      {/* e-Invoice Generation Modal */}
      {showEInvoice && (
        <EInvoiceGeneration
          theme={theme}
          onClose={() => setShowEInvoice(false)}
          seller={{
            gstin: safeCompanyInfo.gstNumber || 'N/A',
            name: safeCompanyInfo.name || 'Company',
            addressLines: (safeCompanyInfo.address || '').split(/,|\n/).map((l: string) => l.trim()).filter(Boolean),
            pin: safeCompanyInfo.pin || '000000',
            state: safeCompanyInfo.state || 'State'
          }}
          purchaser={{
            gstin: (safeLedgers.find(l => l.id === formData.partyId)?.gstNumber) || 'URP',
            name: getPartyName(formData.partyId || ''),
            addressLines: (safeLedgers.find(l => l.id === formData.partyId)?.address || 'Address').split(/,|\n/).map((l: string) => l.trim()).filter(Boolean),
            pin: '000000',
            state: safeLedgers.find(l => l.id === formData.partyId)?.state || safeCompanyInfo.state || 'State',
            place: safeLedgers.find(l => l.id === formData.partyId)?.state || safeCompanyInfo.state || 'State'
          }}
          docInfo={{
            number: formData.number,
            date: formData.date,
            category: 'B2B',
            type: 'Tax Invoice'
          }}
          items={formData.entries
            .filter(e => e.itemId)
            .map(e => {
              const item = getItemDetails(e.itemId || '');
              const totalGstRate = (e.cgstRate || 0) + (e.sgstRate || 0) + (e.igstRate || 0);
              return {
                description: item.name,
                hsn: e.hsnCode || item.hsnCode || '0000',
                quantity: e.quantity || 0,
                unitPrice: e.rate || 0,
                discount: e.discount || 0,
                gstRate: totalGstRate,
                igst: (e.igstRate || 0) > 0
              };
            })
          }
          roundOff={0}
        />
      )}

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Use Sales Voucher for recording sales. Press F8 to create, F9 to save, F12 to configure, Esc to cancel.
        </p>
      </div>
    </div>
    </React.Fragment>
  );
};

export default SalesVoucher;