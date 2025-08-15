import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Settings, FileText, Calculator } from 'lucide-react'; //Plus, Trash2, 

interface VoucherType {
  id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface VoucherTypeOption {
  value: string;
  label: string;
  description: string;
}

const VoucherTypeCreation: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Theme tokens
  const containerBg = theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm border border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const headerText = theme === 'dark' ? 'text-white' : 'text-gray-900';

  // Available voucher types from Tally
  const voucherTypeOptions: VoucherTypeOption[] = [
    { value: 'payment', label: 'Payment', description: 'Cash/Bank payments' },
    { value: 'receipt', label: 'Receipt', description: 'Cash/Bank receipts' },
    { value: 'contra', label: 'Contra', description: 'Transfer between cash/bank accounts' },
    { value: 'journal', label: 'Journal', description: 'General journal entries' },
    { value: 'sales', label: 'Sales', description: 'Sales transactions' },
    { value: 'purchase', label: 'Purchase', description: 'Purchase transactions' },
    { value: 'credit-note', label: 'Credit Note', description: 'Credit adjustments' },
    { value: 'debit-note', label: 'Debit Note', description: 'Debit adjustments' },
    { value: 'delivery-note', label: 'Delivery Note', description: 'Goods delivery notes' },
    { value: 'rejection-in', label: 'Rejection In', description: 'Inward rejections' },
    { value: 'rejection-out', label: 'Rejection Out', description: 'Outward rejections' },
    { value: 'sales-order', label: 'Sales Order', description: 'Sales orders' },
    { value: 'purchase-order', label: 'Purchase Order', description: 'Purchase orders' },
    { value: 'quotation', label: 'Quotation', description: 'Price quotations' },
    { value: 'indents', label: 'Indents', description: 'Material indents' },
    { value: 'stock-journal', label: 'Stock Journal', description: 'Stock adjustments' },
    { value: 'manufacturing-journal', label: 'Manufacturing Journal', description: 'Production entries' },
    { value: 'memo', label: 'Memo', description: 'Memorandum vouchers' },
    { value: 'reversing-journal', label: 'Reversing Journal', description: 'Reversing entries' },
  ];

  const [voucherType, setVoucherType] = useState<VoucherType>({
    name: '',
    type: '',
    abbreviation: '',
    numberingMethod: 'automatic',
    useCommonNarration: true,
    printAfterSaving: false,
    useEffectiveDates: false,
    makeOptionalDefault: false,
    restartNumbering: {
      applicable: false,
      startingNumber: 1,
      particulars: ''
    },
    prefixDetails: {
      applicable: false,
      particulars: ''
    },
    suffixDetails: {
      applicable: false,
      particulars: ''
    },
    narrationsForEachEntry: false,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load voucher type for editing
  useEffect(() => {
    if (isEditing && id) {
      loadVoucherType(id);
    }
  }, [id, isEditing]);

  const loadVoucherType = async (voucherTypeId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/voucher-types/${voucherTypeId}`);
      if (response.ok) {
        const data = await response.json();
        setVoucherType(data);
      } else {
        console.error('Failed to load voucher type');
      }
    } catch (error) {
      console.error('Error loading voucher type:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!voucherType.name.trim()) {
      newErrors.name = 'Voucher type name is required';
    }

    if (!voucherType.type) {
      newErrors.type = 'Type of voucher is required';
    }

    if (!voucherType.abbreviation.trim()) {
      newErrors.abbreviation = 'Abbreviation is required';
    } else if (voucherType.abbreviation.length > 10) {
      newErrors.abbreviation = 'Abbreviation must be 10 characters or less';
    }

    if (voucherType.restartNumbering.applicable && voucherType.restartNumbering.startingNumber < 1) {
      newErrors.startingNumber = 'Starting number must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/voucher-types/${id}`
        : 'http://localhost:5000/api/voucher-types';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...voucherType,
          updatedAt: new Date().toISOString(),
          createdAt: isEditing ? voucherType.createdAt : new Date().toISOString()
        }),
      });

      if (response.ok) {
        navigate('/app/vouchers/types');
      } else {
        console.error('Failed to save voucher type');
      }
    } catch (error) {
      console.error('Error saving voucher type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VoucherType, value: string | boolean) => {
    setVoucherType(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedChange = (
    parent: 'restartNumbering' | 'prefixDetails' | 'suffixDetails',
    field: string,
    value: string | number | boolean
  ) => {
    setVoucherType(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const generateAbbreviation = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }
    return words.map(word => word.charAt(0)).join('').substring(0, 5).toUpperCase();
  };

  const handleNameChange = (name: string) => {
    handleInputChange('name', name);
    if (!voucherType.abbreviation || voucherType.abbreviation === generateAbbreviation(voucherType.name)) {
      handleInputChange('abbreviation', generateAbbreviation(name));
    }
  };

  if (loading) {
    return (
      <div className="pt-[56px] px-4 min-h-screen flex items-center justify-center">
        <div className={`text-center ${mutedText}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
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
                {isEditing ? 'Edit Voucher Type' : 'Voucher Type Creation'}
              </h1>
              <p className={`text-sm mt-1 ${mutedText}`}>
                {isEditing ? 'Modify voucher type settings' : 'Create a new voucher type with all configurations'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/app/vouchers')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details */}
        <div className={`p-6 rounded-lg ${containerBg}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2" size={20} />
            Basic Details
          </h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={voucherType.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter voucher type name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Type of Voucher */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                Type of Voucher <span className="text-red-500">*</span>
              </label>
              <select
                value={voucherType.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.type ? 'border-red-500' : ''
                }`}
                title="Select the type of voucher"
                aria-label="Select voucher type"
              >
                <option value="">Select voucher type</option>
                {voucherTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Abbreviation */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                Abbreviation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={voucherType.abbreviation}
                onChange={(e) => handleInputChange('abbreviation', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.abbreviation ? 'border-red-500' : ''
                }`}
                placeholder="e.g., PMT, RCP, JNL"
                maxLength={10}
              />
              {errors.abbreviation && <p className="text-red-500 text-xs mt-1">{errors.abbreviation}</p>}
            </div>

            {/* Method of Voucher Numbering */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                Method of Voucher Numbering
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="automatic"
                    checked={voucherType.numberingMethod === 'automatic'}
                    onChange={(e) => handleInputChange('numberingMethod', e.target.value)}
                    className="mr-2"
                  />
                  Automatic
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="manual"
                    checked={voucherType.numberingMethod === 'manual'}
                    onChange={(e) => handleInputChange('numberingMethod', e.target.value)}
                    className="mr-2"
                  />
                  Manual
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div className={`p-6 rounded-lg ${containerBg}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="mr-2" size={20} />
            Configuration Options
          </h2>
          
          <div className="space-y-4">
            {/* Boolean Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={voucherType.useCommonNarration}
                  onChange={(e) => handleInputChange('useCommonNarration', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className={labelText}>Use Common Narration</span>
                  <p className={`text-xs ${mutedText}`}>Single narration for entire voucher</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={voucherType.narrationsForEachEntry}
                  onChange={(e) => handleInputChange('narrationsForEachEntry', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className={labelText}>Narrations for each entry</span>
                  <p className={`text-xs ${mutedText}`}>Separate narration for each line item</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={voucherType.printAfterSaving}
                  onChange={(e) => handleInputChange('printAfterSaving', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className={labelText}>Print after saving Voucher</span>
                  <p className={`text-xs ${mutedText}`}>Auto-print voucher after saving</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={voucherType.useEffectiveDates}
                  onChange={(e) => handleInputChange('useEffectiveDates', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className={labelText}>Use EFFECTIVE Dates for Vouchers</span>
                  <p className={`text-xs ${mutedText}`}>Enable effective date functionality</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={voucherType.makeOptionalDefault}
                  onChange={(e) => handleInputChange('makeOptionalDefault', e.target.checked)}
                  className="mr-3"
                />
                <div>
                  <span className={labelText}>Make 'Optional' as default</span>
                  <p className={`text-xs ${mutedText}`}>Set optional fields as default</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Restart Numbering */}
        <div className={`p-6 rounded-lg ${containerBg}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calculator className="mr-2" size={20} />
            Restart Numbering
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={voucherType.restartNumbering.applicable}
                onChange={(e) => handleNestedChange('restartNumbering', 'applicable', e.target.checked)}
                className="mr-3"
              />
              <span className={labelText}>Applicable From</span>
            </label>

            {voucherType.restartNumbering.applicable && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                    Starting Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={voucherType.restartNumbering.startingNumber}
                    onChange={(e) => handleNestedChange('restartNumbering', 'startingNumber', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                    title="Enter the starting number for voucher numbering"
                    placeholder="Enter starting number (e.g., 1)"
                  />
                  {errors.startingNumber && <p className="text-red-500 text-xs mt-1">{errors.startingNumber}</p>}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                    Particulars
                  </label>
                  <input
                    type="text"
                    value={voucherType.restartNumbering.particulars}
                    onChange={(e) => handleNestedChange('restartNumbering', 'particulars', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                    placeholder="Additional details"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prefix & Suffix Details */}
        <div className={`p-6 rounded-lg ${containerBg}`}>
          <h2 className="text-lg font-semibold mb-4">Prefix & Suffix Details</h2>
          
          <div className="space-y-6">
            {/* Prefix Details */}
            <div>
              <h3 className="font-medium mb-3">Prefix Details</h3>
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={voucherType.prefixDetails.applicable}
                  onChange={(e) => handleNestedChange('prefixDetails', 'applicable', e.target.checked)}
                  className="mr-3"
                />
                <span className={labelText}>Applicable From</span>
              </label>

              {voucherType.prefixDetails.applicable && (
                <div className="ml-6">
                  <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                    Particulars
                  </label>
                  <input
                    type="text"
                    value={voucherType.prefixDetails.particulars}
                    onChange={(e) => handleNestedChange('prefixDetails', 'particulars', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                    placeholder="Prefix text"
                  />
                </div>
              )}
            </div>

            {/* Suffix Details */}
            <div>
              <h3 className="font-medium mb-3">Suffix Details</h3>
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={voucherType.suffixDetails.applicable}
                  onChange={(e) => handleNestedChange('suffixDetails', 'applicable', e.target.checked)}
                  className="mr-3"
                />
                <span className={labelText}>Applicable From</span>
              </label>

              {voucherType.suffixDetails.applicable && (
                <div className="ml-6">
                  <label className={`block text-sm font-medium mb-2 ${labelText}`}>
                    Particulars
                  </label>
                  <input
                    type="text"
                    value={voucherType.suffixDetails.particulars}
                    onChange={(e) => handleNestedChange('suffixDetails', 'particulars', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                    placeholder="Suffix text"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className={`mt-6 p-6 rounded-lg ${containerBg}`}>
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className={`p-4 rounded border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`font-medium ${labelText}`}>Voucher Type:</span>
              <span className="ml-2">{voucherType.name || 'Not specified'}</span>
            </div>
            <div>
              <span className={`font-medium ${labelText}`}>Type:</span>
              <span className="ml-2">{voucherType.type || 'Not specified'}</span>
            </div>
            <div>
              <span className={`font-medium ${labelText}`}>Abbreviation:</span>
              <span className="ml-2">{voucherType.abbreviation || 'Not specified'}</span>
            </div>
            <div>
              <span className={`font-medium ${labelText}`}>Numbering:</span>
              <span className="ml-2 capitalize">{voucherType.numberingMethod}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherTypeCreation;
