import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import type { VoucherEntry, Godown } from '../../../types';
import { Save, Plus, Trash2, ArrowLeft, Printer, Calendar, User, Package } from 'lucide-react';
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

const SalesOrder: React.FC = () => {
  const { theme, stockItems, ledgers, godowns = [], vouchers = [], companyInfo, addVoucher, updateVoucher } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const printRef = useRef<HTMLDivElement>(null);

  // Safe fallbacks for context data
  const safeStockItems = stockItems || [
    { id: '1', name: 'Laptop HP Pavilion', hsnCode: '8471', unit: 'Piece', gstRate: 18, openingBalance: 50, standardSaleRate: 45000 },
    { id: '2', name: 'Mobile Phone Samsung', hsnCode: '8517', unit: 'Piece', gstRate: 18, openingBalance: 100, standardSaleRate: 25000 },
    { id: '3', name: 'Printer Canon', hsnCode: '8443', unit: 'Piece', gstRate: 18, openingBalance: 30, standardSaleRate: 15000 },
    { id: '4', name: 'Office Chair', hsnCode: '9401', unit: 'Piece', gstRate: 18, openingBalance: 75, standardSaleRate: 8000 },
    { id: '5', name: 'LED Monitor', hsnCode: '8528', unit: 'Piece', gstRate: 18, openingBalance: 40, standardSaleRate: 12000 },
    { id: '6', name: 'Desktop Computer Dell', hsnCode: '8471', unit: 'Piece', gstRate: 18, openingBalance: 25, standardSaleRate: 35000 },
    { id: '7', name: 'Wireless Mouse Logitech', hsnCode: '8471', unit: 'Piece', gstRate: 18, openingBalance: 200, standardSaleRate: 1500 },
    { id: '8', name: 'Keyboard Mechanical', hsnCode: '8471', unit: 'Piece', gstRate: 18, openingBalance: 150, standardSaleRate: 3500 },
    { id: '9', name: 'Smartphone iPhone', hsnCode: '8517', unit: 'Piece', gstRate: 18, openingBalance: 60, standardSaleRate: 80000 },
    { id: '10', name: 'Tablet iPad', hsnCode: '8471', unit: 'Piece', gstRate: 18, openingBalance: 35, standardSaleRate: 45000 }
  ];

  const safeLedgers = ledgers || [
    { id: '1', name: 'ABC Electronics Pvt Ltd', type: 'sundry-debtors', address: '123 Business Street, Mumbai', gstNumber: '27ABCDE1234F1Z5', state: 'Maharashtra', openingBalance: 0 },
    { id: '2', name: 'XYZ Trading Co', type: 'sundry-debtors', address: '456 Market Road, Delhi', gstNumber: '07XYZAB5678G2H9', state: 'Delhi', openingBalance: 0 },
    { id: '3', name: 'Cash', type: 'cash', address: '', gstNumber: '', state: '', openingBalance: 0 },
    { id: '4', name: 'PQR Industries', type: 'sundry-debtors', address: '789 Industrial Area, Pune', gstNumber: '27PQRST9012I3J4', state: 'Maharashtra', openingBalance: 0 },
    { id: '5', name: 'LMN Enterprises', type: 'current-assets', address: '321 Commercial Zone, Bangalore', gstNumber: '29LMNOP6789K4L5', state: 'Karnataka', openingBalance: 0 }
  ];

  const safeCompanyInfo = companyInfo || {
    name: 'Your Company Name',
    address: 'Your Company Address',
    gstNumber: 'N/A',
    phoneNumber: 'N/A',
    state: 'Default State',
    panNumber: 'N/A'
  };

  // Generate sales order number (e.g., SO0001)
  const generateOrderNumber = () => {
    const salesOrders = vouchers.filter(v => v.type === 'sales' && v.mode === 'sales-order');
    const lastNumber = salesOrders.length > 0
      ? parseInt(salesOrders[salesOrders.length - 1].number.replace('SO', '')) || 0
      : 0;
    return `SO${(lastNumber + 1).toString().padStart(4, '0')}`;
  };

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
      mode: 'sales-order',
      number: generateOrderNumber(),
      narration: '',
      referenceNo: '',
      partyId: '',
      salesLedgerId: '',
      orderRef: '',
      termsOfDelivery: '',
      dispatchDetails: { docNo: '', through: '', destination: '' },
      entries: [
        { id: 'e1', itemId: '', quantity: 0, rate: 0, amount: 0, type: 'debit', cgstRate: 0, sgstRate: 0, igstRate: 0, godownId: '', discount: 0, hsnCode: '' }
      ]
    };
  };

  const [formData, setFormData] = useState<Omit<VoucherEntry, 'id'>>(getInitialFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfig, setShowConfig] = useState(false);

  // Helper functions
  const getItemDetails = (itemId: string) => {
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
    
    const itemMap: { [key: string]: { name: string; hsnCode: string; unit: string; gstRate: number; rate: number } } = {
      '1': { name: 'Laptop HP Pavilion', hsnCode: '8471', unit: 'Piece', gstRate: 18, rate: 45000 },
      '2': { name: 'Mobile Phone Samsung', hsnCode: '8517', unit: 'Piece', gstRate: 18, rate: 25000 },
      '3': { name: 'Printer Canon', hsnCode: '8443', unit: 'Piece', gstRate: 18, rate: 15000 },
      '4': { name: 'Office Chair', hsnCode: '9401', unit: 'Piece', gstRate: 18, rate: 8000 },
      '5': { name: 'LED Monitor', hsnCode: '8528', unit: 'Piece', gstRate: 18, rate: 12000 },
      '6': { name: 'Desktop Computer Dell', hsnCode: '8471', unit: 'Piece', gstRate: 18, rate: 35000 },
      '7': { name: 'Wireless Mouse Logitech', hsnCode: '8471', unit: 'Piece', gstRate: 18, rate: 1500 },
      '8': { name: 'Keyboard Mechanical', hsnCode: '8471', unit: 'Piece', gstRate: 18, rate: 3500 },
      '9': { name: 'Smartphone iPhone', hsnCode: '8517', unit: 'Piece', gstRate: 18, rate: 80000 },
      '10': { name: 'Tablet iPad', hsnCode: '8471', unit: 'Piece', gstRate: 18, rate: 45000 }
    };
    return itemMap[itemId] || { name: '-', hsnCode: '-', unit: '-', gstRate: 0, rate: 0 };
  };

  const getPartyName = (partyId: string) => {
    const party = safeLedgers.find(l => l.id === partyId);
    return party ? party.name : 'Unknown Party';
  };

  const getPartyBalance = (partyId: string) => {
    const party = safeLedgers.find(l => l.id === partyId);
    return party ? (party.openingBalance || 0) : 0;
  };

  const getSalesLedgerName = (salesLedgerId: string) => {
    const salesLedger = safeLedgers.find(l => l.id === salesLedgerId);
    return salesLedger ? salesLedger.name : 'Unknown Sales Ledger';
  };

  // Printing
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Sales_Order_${formData.number}`,
    onBeforePrint: () => {
      console.log('Starting print process...');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log('Print completed successfully');
    },
    onPrintError: (errorLocation: string, error: Error) => {
      console.error('Print error at:', errorLocation, error);
      alert('Print failed. Please try your browser\'s print function (Ctrl+P).');
    }
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
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEntryChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const updatedEntries = [...formData.entries];
    const entry = updatedEntries[index];
    const partyLedger = safeLedgers.find(l => l.id === formData.partyId);
    const isIntrastate = partyLedger?.state && safeCompanyInfo.state ? partyLedger.state === safeCompanyInfo.state : true;

    if (name === 'itemId') {
      const itemDetails = getItemDetails(value);
      const gstRate = itemDetails.gstRate;
      const cgstRate = isIntrastate ? gstRate / 2 : 0;
      const sgstRate = isIntrastate ? gstRate / 2 : 0;
      const igstRate = isIntrastate ? 0 : gstRate;
      updatedEntries[index] = {
        ...entry,
        itemId: value,
        rate: itemDetails.rate,
        hsnCode: itemDetails.hsnCode || '',
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
    if (!formData.number) newErrors.number = 'Order number is required';
    if (!formData.salesLedgerId) newErrors.salesLedgerId = 'Sales Ledger is required';
    
    formData.entries.forEach((entry, index) => {
      if (!entry.itemId) newErrors[`entry${index}.itemId`] = 'Item is required';
      if ((entry.quantity ?? 0) <= 0) newErrors[`entry${index}.quantity`] = 'Quantity must be greater than 0';
    });

    if (!formData.entries.length) {
      newErrors.entries = 'At least one entry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotals = () => {
    const subtotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0)), 0);
    const cgstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.cgstRate ?? 0) / 100), 0);
    const sgstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.sgstRate ?? 0) / 100), 0);
    const igstTotal = formData.entries.reduce((sum, e) => sum + ((e.quantity ?? 0) * (e.rate ?? 0) * (e.igstRate ?? 0) / 100), 0);
    const discountTotal = formData.entries.reduce((sum, e) => sum + (e.discount ?? 0), 0);
    const total = subtotal + cgstTotal + sgstTotal + igstTotal - discountTotal;
    return { subtotal, cgstTotal, sgstTotal, igstTotal, discountTotal, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }

    try {
      if (isEditMode && id) {
        updateVoucher(id, formData);
        await Swal.fire({
          title: 'Success',
          text: 'Sales order updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        const newVoucher: VoucherEntry = {
          ...formData,
          id: Math.random().toString(36).substring(2, 9)
        };
        addVoucher(newVoucher);
        await Swal.fire({
          title: 'Success',
          text: 'Sales order saved successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
      navigate('/app/vouchers');
    } catch (err) {
      console.error('Error:', err);
      Swal.fire('Error', 'Failed to save sales order', 'error');
    }
  };

  const { subtotal = 0, cgstTotal = 0, sgstTotal = 0, igstTotal = 0, discountTotal = 0, total = 0 } = calculateTotals();

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
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="mr-2" size={24} />
            Sales Order
          </h1>
        </div>

        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 flex items-center" htmlFor="date">
                  <Calendar size={16} className="mr-1" />
                  Order Date <span className="text-red-500">*</span>
                </label>              
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  title="Order Date"
                  className={FORM_STYLES.input(theme, !!errors.date)}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="number">
                  Order No. <span className="text-red-500">*</span>
                </label>              
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  readOnly
                  title="Order Number"
                  className={`${FORM_STYLES.input(theme, !!errors.number)} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                />
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
              </div>
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
            </div>

            {/* Party and Sales Ledger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 flex items-center" htmlFor="partyId">
                  <User size={16} className="mr-1" />
                  Party Name <span className="text-red-500">*</span>
                </label>               
                <select
                  title="Select Party"
                  id="partyId"
                  name="partyId"
                  value={formData.partyId}
                  onChange={handleChange}
                  required
                  className={FORM_STYLES.select(theme, !!errors.partyId)}
                >
                  <option value="" disabled>-- Select Party --</option>
                  {safeLedgers
                    .filter(ledger => ledger.type === 'sundry-debtors' || ledger.type === 'cash')
                    .map(ledger => (
                      <option key={ledger.id} value={ledger.id}>
                        {ledger.name} {ledger.openingBalance !== undefined && `(Bal: ₹${ledger.openingBalance.toLocaleString()})`}
                      </option>
                    ))
                  }
                </select>
                {errors.partyId && <p className="text-red-500 text-xs mt-1">{errors.partyId}</p>}
                {formData.partyId && (
                  <p className="text-xs mt-1 text-gray-500">
                    Current Balance: ₹{getPartyBalance(formData.partyId).toLocaleString()}
                  </p>
                )}
              </div>
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
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="orderRef">
                  Customer Order Ref.
                </label>              
                <input
                  type="text"
                  id="orderRef"
                  name="orderRef"
                  value={formData.orderRef || ''}
                  onChange={handleChange}
                  title="Customer Order Reference"
                  placeholder="Enter customer order reference"
                  className={FORM_STYLES.input(theme)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="termsOfDelivery">
                  Terms of Delivery
                </label>              
                <input
                  type="text"
                  id="termsOfDelivery"
                  name="termsOfDelivery"
                  value={formData.termsOfDelivery || ''}
                  onChange={handleChange}
                  title="Terms of Delivery"
                  placeholder="Enter delivery terms"
                  className={FORM_STYLES.input(theme)}
                />
              </div>
            </div>

            {/* Dispatch Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            </div>

            {/* Items Table */}
            <div className={`p-4 mb-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center">
                  <Package size={18} className="mr-2" />
                  Order Items
                </h3>
                <button
                  title='Add Item'
                  type="button"
                  onClick={addEntry}
                  className={`flex items-center text-sm px-3 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  <Plus size={16} className="mr-1" />
                  Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full mb-4">
                  <thead>
                    <tr className={`${theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-300'}`}>
                      <th className="px-4 py-2 text-left">S.No</th>
                      <th className="px-4 py-2 text-left">Item Name</th>
                      <th className="px-4 py-2 text-left">HSN/SAC</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-left">Unit</th>
                      <th className="px-4 py-2 text-right">Rate</th>
                      <th className="px-4 py-2 text-right">Discount</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-left">Godown</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
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
                              {safeStockItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} (Stock: {item.openingBalance})
                                </option>
                              ))}
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
                          <td className="px-4 py-2 text-right font-mono">₹{entry.amount.toLocaleString()}</td>
                          <td className="px-4 py-2">
                            <select
                              title='Select Godown'
                              name="godownId"
                              value={entry.godownId}
                              onChange={(e) => handleEntryChange(index, e)}
                              className={FORM_STYLES.tableSelect(theme)}
                            >
                              <option value="">Select Godown</option>
                              {godowns.length > 0 ? (
                                godowns.map((godown: Godown) => (
                                  <option key={godown.id} value={godown.id}>{godown.name}</option>
                                ))
                              ) : (
                                <option value="main-godown">Main Godown</option>
                              )}
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              title='Remove Item'
                              type="button"
                              onClick={() => removeEntry(index)}
                              disabled={formData.entries.length <= 1}
                              className={`p-1 rounded ${formData.entries.length <= 1 ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'hover:bg-gray-600 text-red-400' : 'hover:bg-gray-300 text-red-600'}`}
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
                      <td className="px-4 py-2 text-right font-mono">₹{subtotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>CGST Total:</td>
                      <td className="px-4 py-2 text-right font-mono">₹{cgstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>SGST Total:</td>
                      <td className="px-4 py-2 text-right font-mono">₹{sgstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>IGST Total:</td>
                      <td className="px-4 py-2 text-right font-mono">₹{igstTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-semibold ${theme === 'dark' ? 'border-t border-gray-600' : 'border-t border-gray-300'}`}>
                      <td className="px-4 py-2 text-right" colSpan={7}>Discount Total:</td>
                      <td className="px-4 py-2 text-right font-mono">₹{discountTotal.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    <tr className={`font-bold text-lg ${theme === 'dark' ? 'border-t-2 border-gray-500 bg-gray-600' : 'border-t-2 border-gray-400 bg-gray-100'}`}>
                      <td className="px-4 py-3 text-right" colSpan={7}>Grand Total:</td>
                      <td className="px-4 py-3 text-right font-mono">₹{total.toLocaleString()}</td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {errors.entries && <p className="text-red-500 text-xs mt-1">{errors.entries}</p>}
            </div>

            {/* Narration */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="narration">
                Order Notes
              </label>
              <textarea
                id="narration"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                rows={3}
                title="Order Notes"
                placeholder="Enter any special instructions or notes for this sales order"
                className={FORM_STYLES.input(theme)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                title='Cancel (Esc)'
                type="button"
                onClick={() => navigate('/app/vouchers')}
                className={`px-6 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                title='Print Order'
                type="button"
                onClick={() => {
                  if (formData.entries.filter(e => e.itemId).length === 0) {
                    alert('Please add at least one item before printing.');
                    return;
                  }
                  if (!formData.partyId) {
                    alert('Please select a party before printing.');
                    return;
                  }
                  handlePrint();
                }}
                className={`flex items-center px-6 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                <Printer size={18} className="mr-1" />
                Print
              </button>
              <button
                title='Save Sales Order (F9)'
                type="submit"
                className={`flex items-center px-6 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <Save size={18} className="mr-1" />
                {isEditMode ? 'Update' : 'Save'} Order
              </button>
            </div>
          </form>
        </div>

        {/* Configuration Modal (F12) */}
        {showConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
              <h2 className="text-xl font-bold mb-4">Configure Sales Order</h2>
              <p className="mb-4">Configure order format, default terms, etc.</p>
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

        {/* Print Layout */}
        <div className="absolute -left-[9999px] -top-[9999px] w-[210mm] min-h-[297mm]">
          <div ref={printRef} className="font-arial text-xs leading-tight p-4 bg-white text-black">
            <div className="border-2 border-black mb-2.5">
              <div className="bg-gray-100 p-2 text-center border-b border-black">
                <h1 className="text-lg font-bold m-0 tracking-wider">SALES ORDER</h1>
              </div>
              
              <div className="flex justify-between px-2.5 py-1.5 border-b border-black text-xs">
                <span><strong>ORDER NO:</strong> {formData.number}</span>
                <span><strong>DATE:</strong> {new Date(formData.date).toLocaleDateString('en-GB')}</span>
              </div>
              
              <div className="p-2.5 border-b border-black">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-base font-bold">{safeCompanyInfo.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold m-0 uppercase">{safeCompanyInfo.name}</h2>
                    <p className="my-0.5 text-xs">{safeCompanyInfo.address}</p>
                  </div>
                </div>
                <div className="text-xs flex gap-5">
                  <span><strong>GSTIN:</strong> {safeCompanyInfo.gstNumber}</span>
                  <span><strong>PAN NO:</strong> {safeCompanyInfo.panNumber}</span>
                </div>
              </div>
              
              <div className="p-2.5">
                <div className="mb-1.5">
                  <strong className="text-xs font-bold">CUSTOMER:</strong>
                </div>
                <div className="text-xs leading-relaxed">
                  <div><strong>{getPartyName(formData.partyId || '')}</strong></div>
                  <div><strong>Sales Ledger:</strong> {getSalesLedgerName(formData.salesLedgerId || '')}</div>
                  {formData.orderRef && <div><strong>Customer Order Ref:</strong> {formData.orderRef}</div>}
                  {formData.termsOfDelivery && <div><strong>Terms:</strong> {formData.termsOfDelivery}</div>}
                </div>
              </div>
            </div>
            
            <table className="w-full border-collapse mb-5 border border-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-black p-2 text-xs font-bold text-center w-12">Sr No</th>
                  <th className="border border-black p-2 text-xs font-bold">Item Description</th>
                  <th className="border border-black p-2 text-xs font-bold w-20">HSN Code</th>
                  <th className="border border-black p-2 text-xs font-bold text-center w-15">Qty</th>
                  <th className="border border-black p-2 text-xs font-bold text-right w-20">Rate</th>
                  <th className="border border-black p-2 text-xs font-bold text-right w-25">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.entries
                  .filter(entry => entry.itemId)
                  .map((entry, index) => {
                    const itemDetails = getItemDetails(entry.itemId || '');
                    return (
                      <tr key={index}>
                        <td className="border border-black p-2 text-xs text-center">{index + 1}</td>
                        <td className="border border-black p-2 text-xs">{itemDetails.name}</td>
                        <td className="border border-black p-2 text-xs text-center">{entry.hsnCode || itemDetails.hsnCode}</td>
                        <td className="border border-black p-2 text-xs text-center">{entry.quantity}</td>
                        <td className="border border-black p-2 text-xs text-right">₹{(entry.rate || 0).toLocaleString()}</td>
                        <td className="border border-black p-2 text-xs text-right">₹{entry.amount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                
                <tr>
                  <td className="border border-black p-1.5 text-xs text-right font-bold" colSpan={5}>Total Amount:</td>
                  <td className="border border-black p-1.5 text-xs text-right">₹{total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="border border-black p-2.5 mb-4">
              <strong className="text-xs font-bold">Amount in Words:</strong>
              <div className="text-xs mt-1.5 min-h-5">Rupees {total} Only</div>
            </div>

            <div className="flex justify-between mt-8">
              <div className="w-48per">
                <div className="text-xs font-bold mb-1.5">Customer Signature</div>
                <div className="mt-12 text-xs">
                  <div className="border-t border-black pt-1.5 text-center">Authorized Signatory</div>
                </div>
              </div>
              <div className="w-48per text-right">
                <div className="text-xs font-bold mb-1.5">For {safeCompanyInfo.name}</div>
                <div className="mt-12 text-xs">
                  <div className="border-t border-black pt-1.5 text-center">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <p className="text-sm">
            <span className="font-semibold">Note:</span> Use Sales Order for recording customer orders before actual sales. This helps track pending orders and delivery commitments.
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SalesOrder;
