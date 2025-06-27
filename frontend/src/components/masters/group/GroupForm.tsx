import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { LedgerGroup, GstClassification, LedgerType } from '../../../types';

interface FormData {
  name: string;
  alias: string;
  under: string;
  type: LedgerType | '';
  nature: 'Assets' | 'Liabilities' | 'Income' | 'Expenses' | '';
  behavesLikeSubLedger: string;
  nettBalancesForReporting: string;
  usedForCalculation: string;
  allocationMethod: 'Appropriate by Qty' | 'Appropriate by Value' | 'No Appropriation' | '';
  setAlterHSNSAC: string;
  hsnSacClassificationId: string;
  hsnCode: string;
  hsnSacDescription: string;
  setAlterGST: string;
  gstClassificationId: string;
  typeOfSupply: string;
  taxability: 'Taxable' | 'Exempt' | 'Nil-rated' | '';
  integratedTaxRate: string;
  cess: string;
}

const GroupForm: React.FC = () => {
  const { theme, addLedgerGroup } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>([]);
  const [gstClassifications, setGstClassifications] = useState<GstClassification[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    alias: '',
    under: '',
    type: '',
    nature: '',
    behavesLikeSubLedger: 'no',
    nettBalancesForReporting: 'yes',
    usedForCalculation: 'no',
    allocationMethod: 'No Appropriation',
    setAlterHSNSAC: 'no',
    hsnSacClassificationId: '',
    hsnCode: '',
    hsnSacDescription: '',
    setAlterGST: 'no',
    gstClassificationId: '',
    typeOfSupply: '',
    taxability: '',
    integratedTaxRate: '',
    cess: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, classificationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/ledger-groups'),
          fetch('http://localhost:5000/api/gst-classifications'),
        ]);
        if (!groupsRes.ok || !classificationsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        const groups = await groupsRes.json();
        const classifications = await classificationsRes.json();
        setLedgerGroups(groups);
        setGstClassifications(classifications);
      } catch (err) {
        console.error('Failed to load data', err);
        alert('Failed to load groups or classifications');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      const group = ledgerGroups.find((g) => g.id === id);
      if (group) {
        setFormData({
          name: group.name,
          alias: group.alias || '',
          under: group.parent || 'Primary',
          type: group.parent ? '' : group.type,
          nature: '',
          behavesLikeSubLedger: group.behavesLikeSubLedger ? 'yes' : 'no',
          nettBalancesForReporting: group.nettBalancesForReporting ? 'yes' : 'no',
          usedForCalculation: group.usedForCalculation ? 'yes' : 'no',
          allocationMethod: group.allocationMethod || 'No Appropriation',
          setAlterHSNSAC: group.gstDetails?.setAlterHSNSAC ? 'yes' : 'no',
          hsnSacClassificationId: group.gstDetails?.hsnSacClassificationId || '',
          hsnCode: group.gstDetails?.hsnCode || '',
          hsnSacDescription: '',
          setAlterGST: group.gstDetails?.setAlterGST ? 'yes' : 'no',
          gstClassificationId: group.gstDetails?.gstClassificationId || '',
          typeOfSupply: group.gstDetails?.typeOfSupply || '',
          taxability: group.gstDetails?.taxability || '',
          integratedTaxRate: group.gstDetails?.integratedTaxRate?.toString() || '',
          cess: group.gstDetails?.cess?.toString() || '',
        });
      }
    }
  }, [id, isEditMode, ledgerGroups]);

  useEffect(() => {
    if (formData.setAlterHSNSAC === 'yes' && formData.hsnSacClassificationId) {
      const classification = gstClassifications.find(c => c.id === formData.hsnSacClassificationId);
      if (classification) {
        setFormData(prev => ({
          ...prev,
          hsnCode: classification.hsnCode || prev.hsnCode,
          hsnSacDescription: classification.name || prev.hsnSacDescription,
        }));
      }
    }
    if (formData.setAlterGST === 'yes' && formData.gstClassificationId) {
      const classification = gstClassifications.find(c => c.id === formData.gstClassificationId);
      if (classification) {
        setFormData(prev => ({
          ...prev,
          integratedTaxRate: classification.gstRate?.toString() || prev.integratedTaxRate,
          cess: classification.cess?.toString() || prev.cess,
        }));
      }
    }
  }, [formData.hsnSacClassificationId, formData.gstClassificationId, formData.setAlterHSNSAC, formData.setAlterGST, gstClassifications]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name) newErrors.name = 'Group Name is required';
    if (!formData.under) newErrors.under = 'Under Group is required';
    if (formData.under === 'Primary' && !formData.nature)
      newErrors.nature = 'Nature of Group is required for Primary groups';
    if (formData.setAlterHSNSAC === 'yes' && !formData.hsnSacClassificationId)
      newErrors.hsnSacClassificationId = 'HSN/SAC Classification is required';
    if (formData.setAlterGST === 'yes' && !formData.gstClassificationId)
      newErrors.gstClassificationId = 'GST Classification is required';
    if (formData.setAlterGST === 'yes' && !formData.typeOfSupply)
      newErrors.typeOfSupply = 'Type of Supply is required';
    if (formData.setAlterGST === 'yes' && !formData.taxability)
      newErrors.taxability = 'Taxability is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'under' && value !== 'Primary' ? { nature: '' } : {}),
      ...(name === 'setAlterHSNSAC' && value === 'no' ? { hsnSacClassificationId: '', hsnCode: '', hsnSacDescription: '' } : {}),
      ...(name === 'setAlterGST' && value === 'no' ? { gstClassificationId: '', typeOfSupply: '', taxability: '', integratedTaxRate: '', cess: '' } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const groupData: LedgerGroup = {
      id: isEditMode && id ? id : (ledgerGroups.length + 1).toString(),
      name: formData.name,
      alias: formData.alias || undefined,
      parent: formData.under === 'Primary' ? undefined : formData.under,
      type: formData.under === 'Primary' ? formData.type as LedgerType : ledgerGroups.find(g => g.id === formData.under)?.type || 'current-assets',
      behavesLikeSubLedger: formData.behavesLikeSubLedger === 'yes',
      nettBalancesForReporting: formData.nettBalancesForReporting === 'yes',
      usedForCalculation: formData.usedForCalculation === 'yes',
      allocationMethod: formData.allocationMethod || undefined,
      gstDetails: {
        setAlterHSNSAC: formData.setAlterHSNSAC === 'yes',
        hsnSacClassificationId: formData.setAlterHSNSAC === 'yes' ? formData.hsnSacClassificationId : undefined,
        hsnCode: formData.setAlterHSNSAC === 'yes' ? formData.hsnCode : undefined,
        setAlterGST: formData.setAlterGST === 'yes',
        gstClassificationId: formData.setAlterGST === 'yes' ? formData.gstClassificationId : undefined,
        typeOfSupply: formData.setAlterGST === 'yes' ? formData.typeOfSupply as 'Goods' | 'Services' : undefined,
        taxability: formData.setAlterGST === 'yes' ? formData.taxability as 'Taxable' | 'Exempt' | 'Nil-rated' : undefined,
        integratedTaxRate: formData.setAlterGST === 'yes' && formData.integratedTaxRate ? parseFloat(formData.integratedTaxRate) : undefined,
        cess: formData.setAlterGST === 'yes' && formData.cess ? parseFloat(formData.cess) : undefined,
      },
    };

    try {
      const url = isEditMode && id ? `http://localhost:5000/api/ledger-groups/${id}` : 'http://localhost:5000/api/ledger-groups';
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });

      const data = await res.json();

      if (res.ok) {
        if (!isEditMode) addLedgerGroup(groupData);
        alert(data.message || `Group ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/masters/group');
      } else {
        alert(data.message || `Failed to ${isEditMode ? 'update' : 'create'} group`);
      }
    } catch (err) {
      console.error(`Group ${isEditMode ? 'update' : 'create'} error:`, err);
      alert('Something went wrong!');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate('/masters/group');
    } else if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'F12') {
      e.preventDefault();
      alert('Configuration options not implemented yet.');
    }
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const allocationOptions = [
    { value: 'Appropriate by Qty', label: 'Appropriate by Qty' },
    { value: 'Appropriate by Value', label: 'Appropriate by Value' },
    { value: 'No Appropriation', label: 'No Appropriation' },
  ];

  const typeOfSupplyOptions = [
    { value: 'Goods', label: 'Goods' },
    { value: 'Services', label: 'Services' },
  ];

  const taxabilityOptions = [
    { value: 'Taxable', label: 'Taxable' },
    { value: 'Exempt', label: 'Exempt' },
    { value: 'Nil-rated', label: 'Nil-rated' },
  ];

  const gstRateOptions = [
    '0', '0.1', '0.25', '1', '1.5', '3', '5', '6', '7.5', '12', '18', '28',
  ];

  const isPurchaseRelated = formData.under === 'Primary'
    ? formData.nature === 'Expenses'
    : formData.under.includes('expense') || formData.under.includes('purchase');

  return (
    <div className="pt-[56px] px-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex items-center mb-6">
        <button
          title="Back to Group List"
          onClick={() => navigate('/masters/group')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{isEditMode ? 'Edit' : 'Create'} Group</h1>
      </div>

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="name">
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  errors.name ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="alias">
                Alias
              </label>
              <input
                type="text"
                id="alias"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="under">
                Under *
              </label>
              <select
                id="under"
                name="under"
                value={formData.under}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                <option value="">Select Group</option>
                <option value="Primary">Primary</option>
                {ledgerGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.under && <p className="text-red-500 text-xs mt-1">{errors.under}</p>}
            </div>

            {formData.under === 'Primary' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="nature">
                  Nature of Group *
                </label>
                <select
                  id="nature"
                  name="nature"
                  value={formData.nature}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                >
                  <option value="">Select Nature</option>
                  <option value="Assets">Assets</option>
                  <option value="Liabilities">Liabilities</option>
                  <option value="Income">Income</option>
                  <option value="Expenses">Expenses</option>
                </select>
                {errors.nature && <p className="text-red-500 text-xs mt-1">{errors.nature}</p>}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="behavesLikeSubLedger">
                Group Behaves Like a Sub-Ledger
              </label>
              <select
                id="behavesLikeSubLedger"
                name="behavesLikeSubLedger"
                value={formData.behavesLikeSubLedger}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="nettBalancesForReporting">
                Nett Debit/Credit Balances for Reporting
              </label>
              <select
                id="nettBalancesForReporting"
                name="nettBalancesForReporting"
                value={formData.nettBalancesForReporting}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="usedForCalculation">
                Used for Calculation (e.g., Taxes, Discounts)
              </label>
              <select
                id="usedForCalculation"
                name="usedForCalculation"
                value={formData.usedForCalculation}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {isPurchaseRelated && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="allocationMethod">
                  Method to Allocate when Used in Purchase Ledger
                </label>
                <select
                  id="allocationMethod"
                  name="allocationMethod"
                  value={formData.allocationMethod}
                  onChange={handleChange}
                  className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                >
                  {allocationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="setAlterHSNSAC">
                Set/Alter HSN/SAC Details
              </label>
              <select
                id="setAlterHSNSAC"
                name="setAlterHSNSAC"
                value={formData.setAlterHSNSAC}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.setAlterHSNSAC === 'yes' && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}    htmlFor="hsnSacClassificationId">
                    HSN/SAC Classification *
                  </label>
                  <select
                    id="hsnSacClassificationId"
                    name="hsnSacClassificationId"
                    value={formData.hsnSacClassificationId}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  >
                    <option value="">Select Classification</option>
                    {gstClassifications.map((classification) => (
                      <option key={classification.id} value={classification.id}>
                        {classification.name} - {classification.hsnCode}
                      </option>
                    ))}
                  </select>
                  {errors.hsnSacClassificationId && <p className="text-red-500 text-xs mt-1">{errors.hsnSacClassificationId}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="hsnCode">
                    HSN/SAC Code *
                  </label>
                  <input
                    type="text"
                    id="hsnCode"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  />
                  {errors.hsnCode && <p className="text-red-500 text-xs mt-1">{errors.hsnCode}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="hsnSacDescription">
                    HSN/SAC Description
                  </label>
                  <input
                    type="text"
                    id="hsnSacDescription"
                    name="hsnSacDescription"
                    value={formData.hsnSacDescription}
                    onChange={handleChange}
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  />
                </div>
              </>
            )}

            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}  htmlFor="setAlterGST">
                Set/Alter GST Details
              </label>
              <select
                id="setAlterGST"
                name="setAlterGST"
                value={formData.setAlterGST}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
              >
                {yesNoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.setAlterGST === 'yes' && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}  htmlFor="gstClassificationId">
                    GST Classification *
                  </label>
                  <select
                    id="gstClassificationId"
                    name="gstClassificationId"
                    value={formData.gstClassificationId}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  >
                    <option value="">Select Classification</option>
                    {gstClassifications.map((classification) => (
                      <option key={classification.id} value={classification.id}>
                        {classification.name} - {classification.gstRate}%
                      </option>
                    ))}
                  </select>
                  {errors.gstClassificationId && <p className="text-red-500 text-xs mt-1">{errors.gstClassificationId}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="typeOfSupply">
                    Type of Supply *
                  </label>
                  <select
                    id="typeOfSupply"
                    name="typeOfSupply"
                    value={formData.typeOfSupply}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  >
                    <option value="">Select Type</option>
                    {typeOfSupplyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.typeOfSupply && <p className="text-red-500 text-xs mt-1">{errors.typeOfSupply}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="taxability">
                    Taxability *
                  </label>
                  <select
                    id="taxability"
                    name="taxability"
                    value={formData.taxability}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  >
                    <option value="">Select Taxability</option>
                    {taxabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.taxability && <p className="text-red-500 text-xs mt-1">{errors.taxability}</p>}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="integratedTaxRate">
                    Integrated Tax Rate (%) *
                  </label>
                  <select
                    id="integratedTaxRate"
                    name="integratedTaxRate"
                    value={formData.integratedTaxRate}
                    onChange={handleChange}
                    required={formData.taxability === 'Taxable'}
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`}
                  >
                    <option value="">Select Rate</option>
                    {gstRateOptions.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="cess">
                    Cess (%)
                  </label>
                  <input
                    type="number"
                    id="cess"
                    name="cess"
                    value={formData.cess}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`w-full p-2 rounded border ${
                  errors.under ? 'border-red-500' : theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-gray-100' : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                } outline-none transition-colors`} 
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              title="Cancel Group Creation"
              type="button"
              onClick={() => navigate('/masters/group')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              title="Save Group"
              type="submit"
              className={`flex items-center px-4 py-2 rounded text-sm font-medium ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={18} className="mr-1" />
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> Ctrl+A to save, Esc to cancel, F12 to configure.
        </p>
      </div>
    </div>
  );
};

export default GroupForm;