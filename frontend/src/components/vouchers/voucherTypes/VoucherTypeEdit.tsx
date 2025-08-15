import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, FileText, Info } from 'lucide-react';

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
}

const VoucherTypeEdit: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Theme tokens
  const containerBg = theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm border border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const mutedText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const headerText = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const [formData, setFormData] = useState<VoucherType>({
    name: '',
    type: 'payment',
    abbreviation: '',
    numberingMethod: 'automatic',
    useCommonNarration: false,
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
    narrationsForEachEntry: true,
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadVoucherType = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/voucher-types/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        console.error('Failed to load voucher type');
        navigate('/app/vouchers/types');
      }
    } catch (error) {
      console.error('Error loading voucher type:', error);
      navigate('/app/vouchers/types');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      loadVoucherType();
    } else {
      setLoading(false);
    }
  }, [id, loadVoucherType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Voucher type name is required';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Type selection is required';
    }

    if (!formData.abbreviation.trim()) {
      newErrors.abbreviation = 'Abbreviation is required';
    } else if (formData.abbreviation.length > 4) {
      newErrors.abbreviation = 'Abbreviation must be 4 characters or less';
    }

    if (formData.restartNumbering.applicable && formData.restartNumbering.startingNumber < 1) {
      newErrors.restartNumberingStartingNumber = 'Starting number must be at least 1';
    }

    if (formData.prefixDetails.applicable && !formData.prefixDetails.particulars.trim()) {
      newErrors.prefixParticulars = 'Prefix particulars are required when prefix is applicable';
    }

    if (formData.suffixDetails.applicable && !formData.suffixDetails.particulars.trim()) {
      newErrors.suffixParticulars = 'Suffix particulars are required when suffix is applicable';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const url = id 
        ? `http://localhost:5000/api/voucher-types/${id}`
        : 'http://localhost:5000/api/voucher-types';
      
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/app/vouchers/types');
      } else {
        const errorData = await response.json();
        console.error('Failed to save voucher type:', errorData);
        alert(errorData.message || 'Failed to save voucher type');
      }
    } catch (error) {
      console.error('Error saving voucher type:', error);
      alert('Error saving voucher type');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (section: string, field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof VoucherType] as Record<string, unknown>),
        [field]: value
      }
    }));
    
    // Clear related errors
    const errorKey = `${section}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const voucherTypeOptions = [
    { value: 'payment', label: 'Payment' },
    { value: 'receipt', label: 'Receipt' },
    { value: 'contra', label: 'Contra' },
    { value: 'journal', label: 'Journal' },
    { value: 'sales', label: 'Sales' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'credit-note', label: 'Credit Note' },
    { value: 'debit-note', label: 'Debit Note' },
    { value: 'delivery-note', label: 'Delivery Note' },
    { value: 'sales-order', label: 'Sales Order' },
    { value: 'purchase-order', label: 'Purchase Order' },
    { value: 'quotation', label: 'Quotation' },
    { value: 'stock-journal', label: 'Stock Journal' },
    { value: 'manufacturing-journal', label: 'Manufacturing Journal' },
    { value: 'physical-stock', label: 'Physical Stock' },
    { value: 'stock-transfer', label: 'Stock Transfer' },
    { value: 'memorandum', label: 'Memorandum' },
    { value: 'rejection-out', label: 'Rejection Out' },
    { value: 'rejection-in', label: 'Rejection In' }
  ];

  if (loading) {
    return (
      <div className="pt-[56px] px-4 min-h-screen flex items-center justify-center">
        <div className={`text-center ${mutedText}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading voucher type...</p>
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
              onClick={() => navigate('/app/vouchers/types')}
              className={`mr-4 p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              title="Back to Voucher Types"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${headerText} flex items-center`}>
                <FileText className="mr-3 text-blue-600" size={28} />
                {id ? 'Edit Voucher Type' : 'Create Voucher Type'}
              </h1>
              <p className={`text-sm mt-1 ${mutedText}`}>
                {id ? 'Update voucher type configuration' : 'Configure new voucher type settings'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Basic Details */}
        <div className={`p-6 rounded-lg mb-6 ${containerBg}`}>
          <h3 className={`text-lg font-semibold mb-4 ${headerText}`}>Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${mutedText}`}>
                Voucher Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="Enter voucher type name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${mutedText}`}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.type ? 'border-red-500' : ''
                }`}
                title="Select voucher type"
              >
                {voucherTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${mutedText}`}>
                Abbreviation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.abbreviation}
                onChange={(e) => handleInputChange('abbreviation', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                  errors.abbreviation ? 'border-red-500' : ''
                }`}
                placeholder="e.g., PAY, REC"
                maxLength={4}
              />
              {errors.abbreviation && <p className="text-red-500 text-sm mt-1">{errors.abbreviation}</p>}
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div className={`p-6 rounded-lg mb-6 ${containerBg}`}>
          <h3 className={`text-lg font-semibold mb-4 ${headerText}`}>Configuration Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Numbering Method</label>
              <select
                value={formData.numberingMethod}
                onChange={(e) => handleInputChange('numberingMethod', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                title="Select numbering method"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useCommonNarration}
                  onChange={(e) => handleInputChange('useCommonNarration', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Use Common Narration</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.printAfterSaving}
                  onChange={(e) => handleInputChange('printAfterSaving', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Print After Saving</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.useEffectiveDates}
                  onChange={(e) => handleInputChange('useEffectiveDates', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Use Effective Dates</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.makeOptionalDefault}
                  onChange={(e) => handleInputChange('makeOptionalDefault', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Make Optional by Default</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.narrationsForEachEntry}
                  onChange={(e) => handleInputChange('narrationsForEachEntry', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Narrations for Each Entry</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className={`p-6 rounded-lg mb-6 ${containerBg}`}>
          <h3 className={`text-lg font-semibold mb-4 ${headerText}`}>Advanced Settings</h3>
          
          {/* Restart Numbering */}
          <div className="mb-6">
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData.restartNumbering.applicable}
                onChange={(e) => handleNestedChange('restartNumbering', 'applicable', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Restart Numbering</span>
            </label>
            
            {formData.restartNumbering.applicable && (
              <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Starting Number</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.restartNumbering.startingNumber}
                    onChange={(e) => handleNestedChange('restartNumbering', 'startingNumber', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                      errors.restartNumberingStartingNumber ? 'border-red-500' : ''
                    }`}
                    title="Enter the starting number for voucher numbering"
                    placeholder="Enter starting number (e.g., 1)"
                  />
                  {errors.restartNumberingStartingNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.restartNumberingStartingNumber}</p>
                  )}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${mutedText}`}>Particulars</label>
                  <input
                    type="text"
                    value={formData.restartNumbering.particulars}
                    onChange={(e) => handleNestedChange('restartNumbering', 'particulars', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg}`}
                    placeholder="e.g., Financial Year, Monthly"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Prefix Details */}
          <div className="mb-6">
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData.prefixDetails.applicable}
                onChange={(e) => handleNestedChange('prefixDetails', 'applicable', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Prefix Details</span>
            </label>
            
            {formData.prefixDetails.applicable && (
              <div className="ml-6">
                <label className={`block text-sm font-medium mb-2 ${mutedText}`}>
                  Prefix Particulars <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prefixDetails.particulars}
                  onChange={(e) => handleNestedChange('prefixDetails', 'particulars', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                    errors.prefixParticulars ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Comp. Name, Location Code"
                />
                {errors.prefixParticulars && (
                  <p className="text-red-500 text-sm mt-1">{errors.prefixParticulars}</p>
                )}
              </div>
            )}
          </div>

          {/* Suffix Details */}
          <div>
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={formData.suffixDetails.applicable}
                onChange={(e) => handleNestedChange('suffixDetails', 'applicable', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Suffix Details</span>
            </label>
            
            {formData.suffixDetails.applicable && (
              <div className="ml-6">
                <label className={`block text-sm font-medium mb-2 ${mutedText}`}>
                  Suffix Particulars <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.suffixDetails.particulars}
                  onChange={(e) => handleNestedChange('suffixDetails', 'particulars', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${
                    errors.suffixParticulars ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., Year Code, Branch Code"
                />
                {errors.suffixParticulars && (
                  <p className="text-red-500 text-sm mt-1">{errors.suffixParticulars}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className={`p-6 rounded-lg mb-6 ${containerBg}`}>
          <h3 className={`text-lg font-semibold mb-4 ${headerText} flex items-center`}>
            <Info className="mr-2" size={20} />
            Preview
          </h3>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Name:</strong> {formData.name || 'Not specified'}
              </div>
              <div>
                <strong>Type:</strong> {voucherTypeOptions.find(opt => opt.value === formData.type)?.label}
              </div>
              <div>
                <strong>Abbreviation:</strong> {formData.abbreviation || 'Not specified'}
              </div>
              <div>
                <strong>Numbering:</strong> {formData.numberingMethod}
              </div>
              <div className="md:col-span-2">
                <strong>Sample Format:</strong>{' '}
                {formData.prefixDetails.applicable && formData.prefixDetails.particulars && (
                  <span>{formData.prefixDetails.particulars}-</span>
                )}
                <span>{formData.abbreviation || 'XXX'}</span>
                <span>-{formData.restartNumbering.applicable ? formData.restartNumbering.startingNumber : '0001'}</span>
                {formData.suffixDetails.applicable && formData.suffixDetails.particulars && (
                  <span>-{formData.suffixDetails.particulars}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pb-6">
          <button
            type="button"
            onClick={() => navigate('/app/vouchers/types')}
            className={`px-6 py-2 rounded-lg border transition-colors flex items-center ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <X size={16} className="mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : (id ? 'Update' : 'Create')} Voucher Type
          </button>
        </div>
      </form>
    </div>
  );
};

export default VoucherTypeEdit;
