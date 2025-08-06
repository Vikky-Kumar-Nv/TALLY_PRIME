import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { VoucherEntry, Ledger, Godown } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft, Printer } from 'lucide-react';
import Swal from 'sweetalert2';

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

const PRINT_STYLES = {
  container: 'absolute -left-[9999px] -top-[9999px] w-[210mm] min-h-[297mm]',
  printArea: 'font-arial text-xs leading-tight p-4 bg-white text-black',
  invoice: {
    border: 'border-2 border-black mb-2.5',
    header: 'bg-gray-100 p-2 text-center border-b border-black',
    title: 'text-lg font-bold m-0 tracking-wider',
    infoRow: 'flex justify-between px-2.5 py-1.5 border-b border-black text-xs',
    infoFlex: 'flex gap-5',
    companySection: 'p-2.5 border-b border-black',
    companyHeader: 'flex items-center mb-2',
    companyLogo: 'w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4',
    companyLogoText: 'text-white text-base font-bold',
    companyName: 'text-base font-bold m-0 uppercase',
    companyAddress: 'my-0.5 text-xs',
    companyInfo: 'text-xs flex gap-5',
    partySection: 'p-2.5',
    partyHeader: 'mb-1.5',
    partyLabel: 'text-xs font-bold',
    partyDetails: 'text-xs leading-relaxed'
  },
  table: {
    main: 'w-full border-collapse mb-5 border border-black',
    headerRow: 'bg-gray-50',
    headerCell: 'border border-black p-2 text-xs font-bold',
    headerCellCenter: 'border border-black p-2 text-xs font-bold text-center',
    headerCellRight: 'border border-black p-2 text-xs font-bold text-right',
    dataCell: 'border border-black p-2 text-xs',
    dataCellCenter: 'border border-black p-2 text-xs text-center',
    dataCellRight: 'border border-black p-2 text-xs text-right',
    emptyCell: 'border border-black p-5 text-xs',
    totalCell: 'border border-black p-1.5 text-xs text-right font-bold',
    totalValues: 'border border-black p-1.5 text-xs text-right'
  },
  totals: {
    amountWords: 'border border-black p-2.5 mb-4',
    amountWordsLabel: 'text-xs font-bold',
    amountWordsText: 'text-xs mt-1.5 min-h-5',
    gstSummary: 'border border-black p-2.5 mb-4',
    gstSummaryLabel: 'text-xs font-bold mb-2 block',
    gstSummaryContent: 'text-xs',
    gstRateHeader: 'flex justify-between mb-2 font-bold',
    gstRateDetails: 'text-xs mb-2',
    gstRateRow: 'flex justify-between mb-1 border-b border-dotted border-gray-300 pb-0.5',
    gstNote: 'mt-2 text-center text-xs italic text-gray-600'
  },
  signatures: {
    container: 'flex justify-between mt-8',
    section: 'w-48per',
    sectionRight: 'w-48per text-right',
    label: 'text-xs font-bold mb-1.5',
    signatureArea: 'mt-12 text-xs',
    signatureLine: 'border-t border-black pt-1.5 text-center'
  }
};

const SalesVoucher: React.FC = () => {
  const { theme, stockItems, ledgers, godowns = [], vouchers = [], companyInfo, addVoucher, updateVoucher } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const printRef = useRef<HTMLDivElement>(null);

  // Safe fallbacks for context data - Remove demo data and use only from context
  const safeStockItems = stockItems || [];
  const safeLedgers = ledgers || [];
  const safeCompanyInfo = companyInfo || {
    name: 'Your Company Name',
    address: 'Your Company Address',
    gstNumber: 'N/A',
    phoneNumber: 'N/A',
    state: 'Default State',
    panNumber: 'N/A'
  };

  // State initialization first
  const [isQuotation, setIsQuotation] = useState(false); // State for quotation mode

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
      type: 'sales',
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

  // Regenerate voucher number when quotation mode changes
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        number: generateVoucherNumber()
      }));
    }
  }, [isQuotation, isEditMode, generateVoucherNumber]);
  const [showConfig, setShowConfig] = useState(false);
  // Keyboard shortcuts
 
  // Printing
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${isQuotation ? 'Sales_Quotation' : 'Sales_Voucher'}_${formData.number}`,
    onBeforePrint: () => {
      console.log('Starting print process...');
      const selectedItems = formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select');
      console.log('Selected items for print:', selectedItems.length);
      
      console.log('Print data:', { 
        party: formData.partyId ? getPartyName(formData.partyId) : 'No Party', 
        items: selectedItems.length,
        totals: calculateTotals()
      });
      
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log('Print completed successfully');
    },    onPrintError: (errorLocation: string, error: Error) => {
      console.error('Print error at:', errorLocation, error);
      alert('Print failed. Please try your browser\'s print function (Ctrl+P).');
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body { 
          font-size: 12pt; 
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          page-break-inside: avoid;
        }
        th, td { 
          border: 1px solid #000; 
          padding: 8px; 
          font-size: 10pt;
        }
        .no-print { display: none; }
      }
    `
  });

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
    // Add quotation flag to form data
    const voucherData = {
      ...formData,
      isQuotation: isQuotation
    };

    if (isEditMode && id) {
      // Update existing voucher via backend
      const res = await fetch(`http://localhost:5000/api/vouchers/${id}`, {
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
      const res = await fetch('http://localhost:5000/api/vouchers', {
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
              onClick={() => {
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
                
                console.log('Calling handlePrint...');
                handlePrint();
              }}
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
      )}      {/* Print Layout */}
      <div className={PRINT_STYLES.container}>
        <div ref={printRef} className={PRINT_STYLES.printArea}>
          {/* Header Section */}
          <div className={PRINT_STYLES.invoice.border}>
            {/* Top Header with TAX INVOICE */}
            <div className={PRINT_STYLES.invoice.header}>
              <h1 className={PRINT_STYLES.invoice.title}>
                {isQuotation ? 'SALES QUOTATION' : 'TAX INVOICE'}
              </h1>
              {isQuotation && (
                <div className="text-center text-sm text-gray-600 mt-1 font-medium">
                  📋 This is a Quotation - Not a Tax Invoice
                </div>
              )}
            </div>
              {/* Invoice Details Row */}
            <div className={PRINT_STYLES.invoice.infoRow}>
              <span><strong>INVOICE NO:</strong> {formData.number}</span>
              <span><strong>DATE:</strong> {new Date(formData.date).toLocaleDateString('en-GB')}</span>
            </div>
            
            {/* Reference and Dispatch Details Row */}
            <div className={PRINT_STYLES.invoice.infoRow}>
              <div className={PRINT_STYLES.invoice.infoFlex}>
                {formData.referenceNo && <span><strong>REF NO:</strong> {formData.referenceNo}</span>}
                {formData.dispatchDetails?.docNo && <span><strong>DISPATCH DOC NO:</strong> {formData.dispatchDetails.docNo}</span>}
              </div>
              <div className={PRINT_STYLES.invoice.infoFlex}>
                {formData.dispatchDetails?.through && <span><strong>DISPATCH THROUGH:</strong> {formData.dispatchDetails.through}</span>}
                {formData.dispatchDetails?.destination && <span><strong>DESTINATION:</strong> {formData.dispatchDetails.destination}</span>}
              </div>
            </div>
            
            {/* Company Details Section */}
            <div className={PRINT_STYLES.invoice.companySection}>
              <div className={PRINT_STYLES.invoice.companyHeader}>
                <div className={PRINT_STYLES.invoice.companyLogo}>
                  <span className={PRINT_STYLES.invoice.companyLogoText}>
                    {safeCompanyInfo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className={PRINT_STYLES.invoice.companyName}>
                    {safeCompanyInfo.name}
                  </h2>
                  <p className={PRINT_STYLES.invoice.companyAddress}>{safeCompanyInfo.address || 'Your Business Address'}</p>
                </div>
              </div>
              <div className={PRINT_STYLES.invoice.companyInfo}>
                <span><strong>GSTIN:</strong> {safeCompanyInfo.gstNumber || 'N/A'}</span>
                <span><strong>PAN NO:</strong> {safeCompanyInfo.panNumber || 'N/A'}</span>
              </div>
            </div>
              {/* Customer Details Section */}
            <div className={PRINT_STYLES.invoice.partySection}>
              <div className={PRINT_STYLES.invoice.partyHeader}>
                <strong className={PRINT_STYLES.invoice.partyLabel}>PARTY'S NAME:</strong>
              </div>
              <div className={PRINT_STYLES.invoice.partyDetails}>
                <div><strong>{formData.partyId ? getPartyName(formData.partyId) : 'No Party Selected'}</strong></div>
                {formData.partyId && (
                  <>
                    <div>GSTIN: {safeLedgers.find(l => l.id === formData.partyId)?.gstNumber || 'N/A'}</div>
                    <div>Address: {safeLedgers.find(l => l.id === formData.partyId)?.address || 'N/A'}</div>
                    <div>State: {safeLedgers.find(l => l.id === formData.partyId)?.state || 'N/A'}</div>
                  </>
                )}
              </div>
            </div>
          </div>          {/* Particulars Table */}
          <table className={PRINT_STYLES.table.main}>            <thead>
              <tr className={PRINT_STYLES.table.headerRow}>
                <th className={`${PRINT_STYLES.table.headerCellCenter} w-12`}>Sr No</th>
                <th className={PRINT_STYLES.table.headerCell}>Particulars (Description & Specifications)</th>
                <th className={`${PRINT_STYLES.table.headerCell} w-20`}>HSN Code</th>
                <th className={`${PRINT_STYLES.table.headerCellCenter} w-15`}>Qty</th>
                <th className={`${PRINT_STYLES.table.headerCellRight} w-20`}>Rate</th>
                <th className={`${PRINT_STYLES.table.headerCellCenter} w-15`}>GST %</th>
                <th className={`${PRINT_STYLES.table.headerCellRight} w-25`}>Amount</th>
              </tr>
            </thead>            <tbody>
              {formData.entries
                .filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select')
                .map((entry, index) => {
                  const itemDetails = getItemDetails(entry.itemId || '');
                  const baseAmount = (entry.quantity || 0) * (entry.rate || 0);
                  const gstRate = itemDetails.gstRate || 0;
                  
                  return (
                    <tr key={entry.id}>
                      <td className={PRINT_STYLES.table.dataCellCenter}>
                        {index + 1}
                      </td>
                      <td className={PRINT_STYLES.table.dataCell}>
                        <strong>{itemDetails.name}</strong>
                      </td>
                      <td className={PRINT_STYLES.table.dataCellCenter}>
                        {itemDetails.hsnCode}
                      </td>
                      <td className={PRINT_STYLES.table.dataCellCenter}>
                        {entry.quantity?.toLocaleString() || '0'} {itemDetails.unit}
                      </td>
                      <td className={PRINT_STYLES.table.dataCellRight}>
                        ₹{entry.rate?.toLocaleString() || '0'}
                      </td>
                      <td className={PRINT_STYLES.table.dataCellCenter}>
                        {gstRate}%
                      </td>
                      <td className={PRINT_STYLES.table.dataCellRight}>
                        ₹{baseAmount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              
              {/* Add empty rows for spacing if no items */}
              {formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select').length === 0 && (
                <>                  <tr>
                    <td className={`${PRINT_STYLES.table.emptyCell} text-center`} colSpan={7}>
                      No items selected
                    </td>
                  </tr>
                  {Array(3).fill(0).map((_, index) => (
                    <tr key={`empty-${index}`}>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                      <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    </tr>
                  ))}
                </>
              )}
              
              {/* Add empty rows for spacing when items exist */}
              {formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select').length > 0 && formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select').length < 4 &&
                Array(Math.max(0, 4 - formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select').length)).fill(0).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                    <td className={PRINT_STYLES.table.emptyCell}>&nbsp;</td>
                  </tr>
                ))
              }
            </tbody>

            {/* Tax Summary */}
            <tfoot>
              <tr>
                <td colSpan={5} className="border border-black p-1_5 text-9pt">
                  <strong>Terms & Conditions:</strong><br/>
                  <span className="text-8pt">
                    • Goods once sold will not be taken back.<br/>
                    • Interest @ 18% p.a. will be charged on delayed payments.<br/>
                    • Subject to {safeCompanyInfo.address || 'Local'} Jurisdiction only.<br/>
                    • Our responsibility ceases as soon as goods leave our premises.<br/>
                    • Delivery charges extra as applicable.
                  </span>
                </td>
                <td className={PRINT_STYLES.table.totalCell}>
                  <div className="mb-1_5">Subtotal</div>
                  {cgstTotal > 0 && <div className="mb-1_5"> CGST</div>}
                  {sgstTotal > 0 && <div className="mb-1_5"> SGST</div>}
                  {igstTotal > 0 && <div className="mb-1_5"> IGST</div>}
                  {discountTotal > 0 && <div className="mb-1_5">Less: Discount</div>}
                  <div className="font-bold text-11pt">Grand Total</div>
                </td>
                <td className={PRINT_STYLES.table.totalValues}>
                  <div className="mb-1_5">₹{subtotal.toLocaleString()}</div>
                  {cgstTotal > 0 && <div className="mb-1_5">₹{cgstTotal.toLocaleString()}</div>}
                  {sgstTotal > 0 && <div className="mb-1_5">₹{sgstTotal.toLocaleString()}</div>}
                  {igstTotal > 0 && <div className="mb-1_5">₹{igstTotal.toLocaleString()}</div>}
                  {discountTotal > 0 && <div className="mb-1_5">₹{discountTotal.toLocaleString()}</div>}
                  <div className="font-bold text-11pt">₹{total.toLocaleString()}</div>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Amount in Words */}
          <div className={PRINT_STYLES.totals.amountWords}>
            <strong className={PRINT_STYLES.totals.amountWordsLabel}>Total Amount (Rs. in Words):</strong>
            <div className={PRINT_STYLES.totals.amountWordsText}>
              Rupees {total > 0 ? total.toLocaleString() : 'Zero'} Only
              {total > 0 && ` (₹${total.toLocaleString()})`}
            </div>
          </div>

          {/* GST Calculation Summary */}
          {formData.entries.filter(entry => entry.itemId && entry.itemId !== '' && entry.itemId !== 'select').length > 0 && (
            <div className={PRINT_STYLES.totals.gstSummary}>
              <strong className={PRINT_STYLES.totals.gstSummaryLabel}>GST Calculation Summary:</strong>
              <div className={PRINT_STYLES.totals.gstSummaryContent}>
                {(() => {
                  const gstInfo = getGstRateInfo();
                  return (
                    <div>
                      <div className={PRINT_STYLES.totals.gstRateHeader}>
                        <span>Total Items: {gstInfo.totalItems}</span>
                        <span>GST Rates Applied: {gstInfo.uniqueGstRatesCount}</span>
                      </div>
                      <div className={PRINT_STYLES.totals.gstRateDetails}>
                        <strong>GST Rates Used:</strong> {gstInfo.gstRatesUsed.join('%, ')}%
                      </div>
                      {Object.entries(gstInfo.breakdown).map(([rate, data]) => (
                        <div key={rate} className={PRINT_STYLES.totals.gstRateRow}>
                          <span>GST {rate}%: {data.count} item{data.count > 1 ? 's' : ''}</span>
                          <span>₹{data.gstAmount.toLocaleString()} GST</span>
                        </div>
                      ))}
                      <div className={PRINT_STYLES.totals.gstNote}>
                        This invoice includes {gstInfo.uniqueGstRatesCount} different GST rate{gstInfo.uniqueGstRatesCount > 1 ? 's' : ''} as per item specifications
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Footer Section */}
          <div className={PRINT_STYLES.signatures.container}>
            <div className={PRINT_STYLES.signatures.section}>
              <div className={PRINT_STYLES.signatures.label}>
                For {safeCompanyInfo.name.toUpperCase()}
              </div>
              <div className={PRINT_STYLES.signatures.signatureArea}>
                <div className={PRINT_STYLES.signatures.signatureLine}>
                  Authorised Signatory
                </div>
              </div>
            </div>
            <div className={PRINT_STYLES.signatures.sectionRight}>
              <div className={PRINT_STYLES.signatures.label}>
                Customer's Signature
              </div>
              <div className={PRINT_STYLES.signatures.signatureArea}>
                <div className={PRINT_STYLES.signatures.signatureLine}>
                  Receiver's Signature
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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