import React, { useState, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, FileText, Upload, Plus, Save, Eye, Printer, 
  Trash2, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Complete Form 24Q Interfaces based on Official PDF Structure
interface TaxDeductionAccount {
  taxDeductionAccountNo: string;
  permanentAccountNo: string;
  financialYear: string;
  assessmentYear: string;
  hasStatementFiledEarlier: 'Yes' | 'No';
  provisionalReceiptNo?: string;
}

interface DeductorDetails {
  name: string;
  typeOfDeductor: string;
  branchDivision?: string;
  address: {
    flatNo: string;
    nameOfPremisesBuilding: string;
    roadStreetLane: string;
    areaLocation: string;
    townCityDistrict: string;
    state: string;
    pinCode: string;
  };
  telephoneNo: string;
  email: string;
}

interface ResponsiblePersonDetails {
  name: string;
  address: {
    flatNo: string;
    nameOfPremisesBuilding: string;
    roadStreetLane: string;
    areaLocation: string;
    townCityDistrict: string;
    state: string;
    pinCode: string;
  };
  telephoneNo: string;
  email: string;
}

interface TaxDetails {
  srNo: number;
  tds: number;
  surcharge: number;
  educationCess: number;
  interest: number;
  others: number;
  totalTaxDeposited: number;
  chequeDD?: string;
  bsrCode: string;
  dateOnWhichTaxDeposited: string;
  transferVoucherChallanSerialNo: string;
  whetherTDSDepositedByBookEntry: 'Yes' | 'No';
}

interface EmployeeSalaryDetails {
  srNo: number;
  nameOfEmployee: string;
  panOfEmployee: string;
  employeeReferenceNo?: string;
  addressOfEmployee?: string;
  amountOfSalaryPaid: number;
  taxDeducted: number;
  dateOfPayment: string;
  periodOfPayment: string;
  natureOfPayment: string;
  sectionUnderWhichDeducted: '192' | '192A' | '194P';
  rateOfTDS: number;
  certificateNo?: string;
  quarterInWhichAmountPaid: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}

interface Verification {
  place: string;
  date: string;
  nameOfPersonResponsible: string;
  designation: string;
  signature?: string;
}

interface Form24QData {
  taxDeductionAccount: TaxDeductionAccount;
  deductorDetails: DeductorDetails;
  responsiblePersonDetails: ResponsiblePersonDetails;
  taxDetails: TaxDetails[];
  employeeSalaryDetails: EmployeeSalaryDetails[];
  verification: Verification;
  status: 'draft' | 'filed' | 'revised';
  submissionDate?: string;
  acknowledgmentNo?: string;
}

interface QuarterlyReturn {
  id: string;
  quarter: string;
  year: string;
  status: 'draft' | 'filed' | 'revised';
  filingDate?: string;
  acknowledgmentNo?: string;
  totalDeductees: number;
  totalTDS: number;
  dueDate: string;
  formData?: Form24QData;
}

// Reusable Components - DRY Principle
const FormSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ 
  title, children, className = '' 
}) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 overflow-hidden ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
      {title}
    </h3>
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

const FormField: React.FC<{
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
  step?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  disabled?: boolean;
}> = ({ 
  label, name, value, onChange, type = 'text', required = false, 
  placeholder, error, options, className = '', step, min, max, maxLength, disabled = false
}) => (
  <div className={`space-y-1 ${className}`}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'select' ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required={required}
        disabled={disabled}
        title={label}
      >
        <option value="">Select {label}</option>
        {options?.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required={required}
        maxLength={maxLength}
        rows={3}
        disabled={disabled}
        title={label}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required={required}
        step={step}
        min={min}
        max={max}
        maxLength={maxLength}
        disabled={disabled}
        title={label}
      />
    )}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ onClick, icon: Icon, label, variant = 'primary', size = 'md', disabled = false }) => {
  const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={label}
    >
      <Icon size={size === 'lg' ? 20 : size === 'sm' ? 16 : 18} />
      {label}
    </button>
  );
};

const Form24Q: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'upload'>('list');

  // Form Data States - All mandatory fields from PDF
  const [taxDeductionAccount, setTaxDeductionAccount] = useState<TaxDeductionAccount>({
    taxDeductionAccountNo: '',
    permanentAccountNo: '',
    financialYear: '2024-25',
    assessmentYear: '2024-25',
    hasStatementFiledEarlier: 'No',
    provisionalReceiptNo: ''
  });

  const [deductorDetails, setDeductorDetails] = useState<DeductorDetails>({
    name: '',
    typeOfDeductor: '',
    branchDivision: '',
    address: {
      flatNo: '',
      nameOfPremisesBuilding: '',
      roadStreetLane: '',
      areaLocation: '',
      townCityDistrict: '',
      state: '',
      pinCode: ''
    },
    telephoneNo: '',
    email: ''
  });

  const [responsiblePersonDetails, setResponsiblePersonDetails] = useState<ResponsiblePersonDetails>({
    name: '',
    address: {
      flatNo: '',
      nameOfPremisesBuilding: '',
      roadStreetLane: '',
      areaLocation: '',
      townCityDistrict: '',
      state: '',
      pinCode: ''
    },
    telephoneNo: '',
    email: ''
  });

  const [taxDetails, setTaxDetails] = useState<TaxDetails[]>([{
    srNo: 1,
    tds: 0,
    surcharge: 0,
    educationCess: 0,
    interest: 0,
    others: 0,
    totalTaxDeposited: 0,
    chequeDD: '',
    bsrCode: '',
    dateOnWhichTaxDeposited: '',
    transferVoucherChallanSerialNo: '',
    whetherTDSDepositedByBookEntry: 'No'
  }]);

  const [employeeSalaryDetails, setEmployeeSalaryDetails] = useState<EmployeeSalaryDetails[]>([{
    srNo: 1,
    nameOfEmployee: '',
    panOfEmployee: '',
    employeeReferenceNo: '',
    addressOfEmployee: '',
    amountOfSalaryPaid: 0,
    taxDeducted: 0,
    dateOfPayment: '',
    periodOfPayment: '',
    natureOfPayment: 'Salary',
    sectionUnderWhichDeducted: '192',
    rateOfTDS: 0,
    certificateNo: '',
    quarterInWhichAmountPaid: 'Q4'
  }]);

  const [verification, setVerification] = useState<Verification>({
    place: '',
    date: new Date().toISOString().split('T')[0],
    nameOfPersonResponsible: '',
    designation: '',
    signature: ''
  });

  // Mock data for display
  const quarterlyReturns: QuarterlyReturn[] = [
    {
      id: '1',
      quarter: 'Q4',
      year: '2023-24',
      status: 'filed',
      filingDate: '2024-01-15',
      acknowledgmentNo: 'ACK123456789',
      totalDeductees: 150,
      totalTDS: 2500000,
      dueDate: '2024-01-31'
    },
    {
      id: '2',
      quarter: 'Q3',
      year: '2023-24',
      status: 'filed',
      filingDate: '2023-10-30',
      acknowledgmentNo: 'ACK987654321',
      totalDeductees: 142,
      totalTDS: 2300000,
      dueDate: '2023-10-31'
    },
    {
      id: '3',
      quarter: 'Q2',
      year: '2023-24',
      status: 'revised',
      filingDate: '2023-07-28',
      acknowledgmentNo: 'ACK456789123',
      totalDeductees: 138,
      totalTDS: 2200000,
      dueDate: '2023-07-31'
    },
    {
      id: '4',
      quarter: 'Q1',
      year: '2024-25',
      status: 'draft',
      totalDeductees: 0,
      totalTDS: 0,
      dueDate: '2024-07-31'
    }
  ];

  // Options for dropdowns
  const financialYears = [
    { value: '2024-25', label: 'FY 2024-25' },
    { value: '2023-24', label: 'FY 2023-24' },
    { value: '2022-23', label: 'FY 2022-23' }
  ];

  const assessmentYears = [
    { value: '2024-25', label: 'AY 2024-25' },
    { value: '2023-24', label: 'AY 2023-24' },
    { value: '2022-23', label: 'AY 2022-23' }
  ];

  const deductorTypes = [
    { value: 'Company', label: 'Company' },
    { value: 'Individual/HUF', label: 'Individual/HUF' },
    { value: 'Firm', label: 'Firm' },
    { value: 'AOP/BOI', label: 'AOP/BOI' },
    { value: 'Local Authority', label: 'Local Authority' },
    { value: 'Artificial Juridical Person', label: 'Artificial Juridical Person' },
    { value: 'Government', label: 'Government' },
    { value: 'Others', label: 'Others' }
  ];

  const states = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CG', label: 'Chhattisgarh' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'DN', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TS', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ];

  // Event Handlers using useCallback for optimization
  const handleTaxDeductionAccountChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaxDeductionAccount(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDeductorDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [, child] = name.split('.');
      setDeductorDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [child]: value
        }
      }));
    } else {
      setDeductorDetails(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleResponsiblePersonChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [, child] = name.split('.');
      setResponsiblePersonDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [child]: value
        }
      }));
    } else {
      setResponsiblePersonDetails(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const addTaxDetail = useCallback(() => {
    setTaxDetails(prev => [...prev, {
      srNo: prev.length + 1,
      tds: 0,
      surcharge: 0,
      educationCess: 0,
      interest: 0,
      others: 0,
      totalTaxDeposited: 0,
      chequeDD: '',
      bsrCode: '',
      dateOnWhichTaxDeposited: '',
      transferVoucherChallanSerialNo: '',
      whetherTDSDepositedByBookEntry: 'No'
    }]);
  }, []);

  const removeTaxDetail = useCallback((index: number) => {
    setTaxDetails(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleTaxDetailChange = useCallback((index: number, field: keyof TaxDetails, value: string | number) => {
    setTaxDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto-calculate total
      if (['tds', 'surcharge', 'educationCess', 'interest', 'others'].includes(field)) {
        updated[index].totalTaxDeposited = 
          updated[index].tds + updated[index].surcharge + updated[index].educationCess + 
          updated[index].interest + updated[index].others;
      }
      
      return updated;
    });
  }, []);

  const addEmployeeDetail = useCallback(() => {
    setEmployeeSalaryDetails(prev => [...prev, {
      srNo: prev.length + 1,
      nameOfEmployee: '',
      panOfEmployee: '',
      employeeReferenceNo: '',
      addressOfEmployee: '',
      amountOfSalaryPaid: 0,
      taxDeducted: 0,
      dateOfPayment: '',
      periodOfPayment: '',
      natureOfPayment: 'Salary',
      sectionUnderWhichDeducted: '192',
      rateOfTDS: 0,
      certificateNo: '',
      quarterInWhichAmountPaid: 'Q4'
    }]);
  }, []);

  const removeEmployeeDetail = useCallback((index: number) => {
    setEmployeeSalaryDetails(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleEmployeeDetailChange = useCallback((index: number, field: keyof EmployeeSalaryDetails, value: string | number) => {
    setEmployeeSalaryDetails(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const handleVerificationChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVerification(prev => ({ ...prev, [name]: value }));
  }, []);

  // Calculate totals using useMemo for performance
  const totalSummary = useMemo(() => ({
    totalEmployees: employeeSalaryDetails.length,
    totalSalaryPaid: employeeSalaryDetails.reduce((sum, e) => sum + (e.amountOfSalaryPaid || 0), 0),
    totalTaxDeducted: employeeSalaryDetails.reduce((sum, e) => sum + (e.taxDeducted || 0), 0),
    totalTaxDeposited: taxDetails.reduce((sum, t) => sum + (t.totalTaxDeposited || 0), 0)
  }), [employeeSalaryDetails, taxDetails]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    // Validate Tax Deduction Account
    if (!taxDeductionAccount.taxDeductionAccountNo) newErrors.taxDeductionAccountNo = 'Tax Deduction Account No. is required';
    if (!taxDeductionAccount.permanentAccountNo) newErrors.permanentAccountNo = 'Permanent Account No. is required';
    
    // Validate Deductor Details
    if (!deductorDetails.name) newErrors.deductorName = 'Deductor name is required';
    if (!deductorDetails.typeOfDeductor) newErrors.typeOfDeductor = 'Type of deductor is required';
    if (!deductorDetails.email) newErrors.deductorEmail = 'Email is required';
    if (!deductorDetails.address.pinCode) newErrors.deductorPinCode = 'PIN code is required';
    
    // Validate Responsible Person
    if (!responsiblePersonDetails.name) newErrors.responsiblePersonName = 'Responsible person name is required';
    
    // Validate Verification
    if (!verification.nameOfPersonResponsible) newErrors.verificationName = 'Name of person responsible is required';
    if (!verification.place) newErrors.verificationPlace = 'Place is required';
    
    return Object.keys(newErrors).length === 0;
  }, [taxDeductionAccount, deductorDetails, responsiblePersonDetails, verification]);

  const handleSaveForm = useCallback(() => {
    if (validateForm()) {
      console.log('Form saved successfully');
      alert('Form saved successfully!');
    } else {
      alert('Please fix the errors before saving');
    }
  }, [validateForm]);

  const generateForm24QHTML = useCallback(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FORM NO. 24Q</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
            .header { text-align: center; font-weight: bold; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .field-group { display: flex; gap: 20px; margin: 10px 0; }
            .field { flex: 1; }
            .label { font-weight: bold; margin-bottom: 5px; }
            .value { border-bottom: 1px solid #000; padding: 2px 5px; min-height: 16px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #000; padding: 5px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .signature-section { margin-top: 30px; }
            @media print { 
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>FORM NO. 24Q</h2>
            <p>(See section 192 and rule 31A)</p>
            <p>Quarterly statement of deduction of tax under sub-section (3) of section 200 of the Income-tax Act, 1961 in respect of salary</p>
            <p>for the quarter ended June/September/December/March (tick whichever applicable) _______ (year)</p>
          </div>

          <div class="section">
            <h3>1. Tax Deduction Account Details</h3>
            <div class="field-group">
              <div class="field">
                <div class="label">(a) Tax Deduction Account No.</div>
                <div class="value">${taxDeductionAccount.taxDeductionAccountNo}</div>
              </div>
              <div class="field">
                <div class="label">(b) Permanent Account No.</div>
                <div class="value">${taxDeductionAccount.permanentAccountNo}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">(c) Financial year</div>
                <div class="value">${taxDeductionAccount.financialYear}</div>
              </div>
              <div class="field">
                <div class="label">(d) Assessment year</div>
                <div class="value">${taxDeductionAccount.assessmentYear}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">(e) Has any statement been filed earlier for this quarter (Yes/No)</div>
                <div class="value">${taxDeductionAccount.hasStatementFiledEarlier}</div>
              </div>
              <div class="field">
                <div class="label">(f) If answer to (e) is 'Yes', then Provisional Receipt No. of original statement</div>
                <div class="value">${taxDeductionAccount.provisionalReceiptNo || ''}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>2. Particulars of the deductor (employer)</h3>
            <div class="field-group">
              <div class="field">
                <div class="label">(a) Name</div>
                <div class="value">${deductorDetails.name}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">(b) Type of deductor</div>
                <div class="value">${deductorDetails.typeOfDeductor}</div>
              </div>
              <div class="field">
                <div class="label">(c) Branch/Division (if any)</div>
                <div class="value">${deductorDetails.branchDivision || ''}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">(d) Address</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Flat No.</div>
                <div class="value">${deductorDetails.address.flatNo}</div>
              </div>
              <div class="field">
                <div class="label">Name of the premises/building</div>
                <div class="value">${deductorDetails.address.nameOfPremisesBuilding}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Road/street/lane</div>
                <div class="value">${deductorDetails.address.roadStreetLane}</div>
              </div>
              <div class="field">
                <div class="label">Area/location</div>
                <div class="value">${deductorDetails.address.areaLocation}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Town/City/District</div>
                <div class="value">${deductorDetails.address.townCityDistrict}</div>
              </div>
              <div class="field">
                <div class="label">State</div>
                <div class="value">${deductorDetails.address.state}</div>
              </div>
              <div class="field">
                <div class="label">Pin code</div>
                <div class="value">${deductorDetails.address.pinCode}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Telephone No.</div>
                <div class="value">${deductorDetails.telephoneNo}</div>
              </div>
              <div class="field">
                <div class="label">E-mail</div>
                <div class="value">${deductorDetails.email}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>3. Particulars of the person responsible for deduction of tax</h3>
            <div class="field-group">
              <div class="field">
                <div class="label">(a) Name</div>
                <div class="value">${responsiblePersonDetails.name}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">(b) Address</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Flat No.</div>
                <div class="value">${responsiblePersonDetails.address.flatNo}</div>
              </div>
              <div class="field">
                <div class="label">Name of the premises/building</div>
                <div class="value">${responsiblePersonDetails.address.nameOfPremisesBuilding}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Road/street/lane</div>
                <div class="value">${responsiblePersonDetails.address.roadStreetLane}</div>
              </div>
              <div class="field">
                <div class="label">Area/location</div>
                <div class="value">${responsiblePersonDetails.address.areaLocation}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Town/City/District</div>
                <div class="value">${responsiblePersonDetails.address.townCityDistrict}</div>
              </div>
              <div class="field">
                <div class="label">State</div>
                <div class="value">${responsiblePersonDetails.address.state}</div>
              </div>
              <div class="field">
                <div class="label">Pin Code</div>
                <div class="value">${responsiblePersonDetails.address.pinCode}</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Telephone No.</div>
                <div class="value">${responsiblePersonDetails.telephoneNo}</div>
              </div>
              <div class="field">
                <div class="label">E-mail</div>
                <div class="value">${responsiblePersonDetails.email}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>4. Details of tax deducted and paid to the credit of Central Government</h3>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>TDS Rs.</th>
                  <th>Surcharge Rs.</th>
                  <th>Education Cess Rs.</th>
                  <th>Interest Rs.</th>
                  <th>Others Rs.</th>
                  <th>Total tax deposited Rs.</th>
                  <th>Cheque/DD No.</th>
                  <th>BSR code</th>
                  <th>Date on which tax deposited</th>
                  <th>Transfer voucher/Challan serial No.</th>
                  <th>Whether TDS deposited by book entry? Yes/No</th>
                </tr>
              </thead>
              <tbody>
                ${taxDetails.map(tax => `
                  <tr>
                    <td>${tax.srNo}</td>
                    <td>${tax.tds}</td>
                    <td>${tax.surcharge}</td>
                    <td>${tax.educationCess}</td>
                    <td>${tax.interest}</td>
                    <td>${tax.others}</td>
                    <td>${tax.totalTaxDeposited}</td>
                    <td>${tax.chequeDD}</td>
                    <td>${tax.bsrCode}</td>
                    <td>${tax.dateOnWhichTaxDeposited}</td>
                    <td>${tax.transferVoucherChallanSerialNo}</td>
                    <td>${tax.whetherTDSDepositedByBookEntry}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>5. Details of salary paid and tax deducted thereon from the employees (Enclose Annexures I, II and III)</h3>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name of Employee</th>
                  <th>PAN of Employee</th>
                  <th>Employee Reference No.</th>
                  <th>Address of Employee</th>
                  <th>Amount of Salary Paid</th>
                  <th>Tax Deducted</th>
                  <th>Date of Payment</th>
                  <th>Period of Payment</th>
                  <th>Nature of Payment</th>
                  <th>Section</th>
                  <th>Rate of TDS</th>
                  <th>Certificate No.</th>
                  <th>Quarter</th>
                </tr>
              </thead>
              <tbody>
                ${employeeSalaryDetails.map(emp => `
                  <tr>
                    <td>${emp.srNo}</td>
                    <td>${emp.nameOfEmployee}</td>
                    <td>${emp.panOfEmployee}</td>
                    <td>${emp.employeeReferenceNo}</td>
                    <td>${emp.addressOfEmployee}</td>
                    <td>${emp.amountOfSalaryPaid}</td>
                    <td>${emp.taxDeducted}</td>
                    <td>${emp.dateOfPayment}</td>
                    <td>${emp.periodOfPayment}</td>
                    <td>${emp.natureOfPayment}</td>
                    <td>${emp.sectionUnderWhichDeducted}</td>
                    <td>${emp.rateOfTDS}%</td>
                    <td>${emp.certificateNo}</td>
                    <td>${emp.quarterInWhichAmountPaid}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="signature-section">
            <h3>Verification</h3>
            <p>I, <strong>${verification.nameOfPersonResponsible}</strong>, hereby certify that all the particulars furnished above are correct and complete.</p>
            <br><br>
            <div class="field-group">
              <div class="field">
                <div class="label">Place: ${verification.place}</div>
              </div>
              <div class="field">
                <div class="label">Signature of person responsible for deducting tax at source</div>
              </div>
            </div>
            <div class="field-group">
              <div class="field">
                <div class="label">Date: ${verification.date}</div>
              </div>
              <div class="field">
                <div class="label">Designation: ${verification.designation}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }, [taxDeductionAccount, deductorDetails, responsiblePersonDetails, taxDetails, employeeSalaryDetails, verification]);

  const handlePreview = useCallback(() => {
    if (validateForm()) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generateForm24QHTML());
        printWindow.document.close();
      }
    }
  }, [validateForm, generateForm24QHTML]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed':
        return 'bg-green-100 text-green-800';
      case 'revised':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-[56px] px-4 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
            <button
                title='Back to Reports'
                type='button'
                  onClick={() => navigate('/app/tds')}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Form 24Q</h1>
            </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Form 24Q - TDS Quarterly Return</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'list', label: 'Filed Returns' },
                { id: 'create', label: 'Generate Return' },
                { id: 'upload', label: 'Upload Return' }
              ].map((tab) => (
                <button
                title='navigation'
                type='button'
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'list' | 'create' | 'upload')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Filed Returns Tab */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4">
                  <select 
                  title='Returns'
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="2023-24">FY 2023-24</option>
                    <option value="2022-23">FY 2022-23</option>
                    <option value="2021-22">FY 2021-22</option>
                  </select>
                  <button
                  title='Export'
                  type='button'
                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">4</div>
                  <div className="text-sm text-blue-600">Total Returns</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">2</div>
                  <div className="text-sm text-green-600">Filed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-700">1</div>
                  <div className="text-sm text-yellow-600">Revised</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-700">1</div>
                  <div className="text-sm text-gray-600">Draft</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Quarter</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Year</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Deductees</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Total TDS</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Due Date</th>
                      <th className="text-left p-4 border-b font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyReturns.map((return_) => (
                      <tr key={return_.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 border-b">
                          <span className="font-medium text-gray-900">{return_.quarter}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.year}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(return_.status)}`}>
                            {return_.status}
                          </span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.totalDeductees}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="font-medium text-gray-900">₹{return_.totalTDS.toLocaleString()}</span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-gray-700">{return_.dueDate}</span>
                        </td>
                        <td className="p-4 border-b">
                          <div className="flex gap-2">
                            <button title='View' type='button'
                             className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button className="text-green-600 hover:text-green-800 text-sm">Download</button>
                            {return_.status === 'draft' && (
                              <button className="text-orange-600 hover:text-orange-800 text-sm">Edit</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Generate Return Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {/* Form Sections - All sections from PDF */}
              
              {/* Section 1: Tax Deduction Account Details */}
              <FormSection title="1. Tax Deduction Account Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Tax Deduction Account No."
                    name="taxDeductionAccountNo"
                    value={taxDeductionAccount.taxDeductionAccountNo}
                    onChange={handleTaxDeductionAccountChange}
                    required
                    placeholder="Enter TAN"
                    maxLength={10}
                  />
                  <FormField
                    label="Permanent Account No."
                    name="permanentAccountNo"
                    value={taxDeductionAccount.permanentAccountNo}
                    onChange={handleTaxDeductionAccountChange}
                    required
                    placeholder="Enter PAN"
                    maxLength={10}
                  />
                  <FormField
                    label="Financial Year"
                    name="financialYear"
                    value={taxDeductionAccount.financialYear}
                    onChange={handleTaxDeductionAccountChange}
                    type="select"
                    required
                    options={financialYears}
                  />
                  <FormField
                    label="Assessment Year"
                    name="assessmentYear"
                    value={taxDeductionAccount.assessmentYear}
                    onChange={handleTaxDeductionAccountChange}
                    type="select"
                    required
                    options={assessmentYears}
                  />
                  <FormField
                    label="Has statement been filed earlier?"
                    name="hasStatementFiledEarlier"
                    value={taxDeductionAccount.hasStatementFiledEarlier}
                    onChange={handleTaxDeductionAccountChange}
                    type="select"
                    required
                    options={[
                      { value: 'Yes', label: 'Yes' },
                      { value: 'No', label: 'No' }
                    ]}
                  />
                  {taxDeductionAccount.hasStatementFiledEarlier === 'Yes' && (
                    <FormField
                      label="Provisional Receipt No."
                      name="provisionalReceiptNo"
                      value={taxDeductionAccount.provisionalReceiptNo || ''}
                      onChange={handleTaxDeductionAccountChange}
                      placeholder="Enter receipt number"
                    />
                  )}
                </div>
              </FormSection>

              {/* Section 2: Deductor Details */}
              <FormSection title="2. Particulars of the deductor (employer)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Name"
                    name="name"
                    value={deductorDetails.name}
                    onChange={handleDeductorDetailsChange}
                    required
                    placeholder="Enter name"
                    className="md:col-span-2"
                  />
                  <FormField
                    label="Type of Deductor"
                    name="typeOfDeductor"
                    value={deductorDetails.typeOfDeductor}
                    onChange={handleDeductorDetailsChange}
                    type="select"
                    required
                    options={deductorTypes}
                  />
                  <FormField
                    label="Branch/Division (if any)"
                    name="branchDivision"
                    value={deductorDetails.branchDivision || ''}
                    onChange={handleDeductorDetailsChange}
                    placeholder="Enter branch/division"
                  />
                </div>
                
                <h4 className="text-md font-semibold text-gray-900 mt-6 mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    label="Flat No."
                    name="address.flatNo"
                    value={deductorDetails.address.flatNo}
                    onChange={handleDeductorDetailsChange}
                    placeholder="Enter flat no."
                  />
                  <FormField
                    label="Name of Premises/Building"
                    name="address.nameOfPremisesBuilding"
                    value={deductorDetails.address.nameOfPremisesBuilding}
                    onChange={handleDeductorDetailsChange}
                    placeholder="Enter building name"
                  />
                  <FormField
                    label="Road/Street/Lane"
                    name="address.roadStreetLane"
                    value={deductorDetails.address.roadStreetLane}
                    onChange={handleDeductorDetailsChange}
                    placeholder="Enter road/street"
                  />
                  <FormField
                    label="Area/Location"
                    name="address.areaLocation"
                    value={deductorDetails.address.areaLocation}
                    onChange={handleDeductorDetailsChange}
                    placeholder="Enter area"
                  />
                  <FormField
                    label="Town/City/District"
                    name="address.townCityDistrict"
                    value={deductorDetails.address.townCityDistrict}
                    onChange={handleDeductorDetailsChange}
                    required
                    placeholder="Enter city"
                  />
                  <FormField
                    label="State"
                    name="address.state"
                    value={deductorDetails.address.state}
                    onChange={handleDeductorDetailsChange}
                    type="select"
                    required
                    options={states}
                  />
                  <FormField
                    label="Pin Code"
                    name="address.pinCode"
                    value={deductorDetails.address.pinCode}
                    onChange={handleDeductorDetailsChange}
                    required
                    placeholder="Enter pin code"
                    maxLength={6}
                  />
                  <FormField
                    label="Telephone No."
                    name="telephoneNo"
                    value={deductorDetails.telephoneNo}
                    onChange={handleDeductorDetailsChange}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                  <FormField
                    label="Email"
                    name="email"
                    value={deductorDetails.email}
                    onChange={handleDeductorDetailsChange}
                    type="email"
                    required
                    placeholder="Enter email"
                  />
                </div>
              </FormSection>

              {/* Section 3: Responsible Person Details */}
              <FormSection title="3. Particulars of the person responsible for deduction of tax">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Name"
                    name="name"
                    value={responsiblePersonDetails.name}
                    onChange={handleResponsiblePersonChange}
                    required
                    placeholder="Enter name"
                    className="md:col-span-2"
                  />
                </div>
                
                <h4 className="text-md font-semibold text-gray-900 mt-6 mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    label="Flat No."
                    name="address.flatNo"
                    value={responsiblePersonDetails.address.flatNo}
                    onChange={handleResponsiblePersonChange}
                    placeholder="Enter flat no."
                  />
                  <FormField
                    label="Name of Premises/Building"
                    name="address.nameOfPremisesBuilding"
                    value={responsiblePersonDetails.address.nameOfPremisesBuilding}
                    onChange={handleResponsiblePersonChange}
                    placeholder="Enter building name"
                  />
                  <FormField
                    label="Road/Street/Lane"
                    name="address.roadStreetLane"
                    value={responsiblePersonDetails.address.roadStreetLane}
                    onChange={handleResponsiblePersonChange}
                    placeholder="Enter road/street"
                  />
                  <FormField
                    label="Area/Location"
                    name="address.areaLocation"
                    value={responsiblePersonDetails.address.areaLocation}
                    onChange={handleResponsiblePersonChange}
                    placeholder="Enter area"
                  />
                  <FormField
                    label="Town/City/District"
                    name="address.townCityDistrict"
                    value={responsiblePersonDetails.address.townCityDistrict}
                    onChange={handleResponsiblePersonChange}
                    required
                    placeholder="Enter city"
                  />
                  <FormField
                    label="State"
                    name="address.state"
                    value={responsiblePersonDetails.address.state}
                    onChange={handleResponsiblePersonChange}
                    type="select"
                    required
                    options={states}
                  />
                  <FormField
                    label="Pin Code"
                    name="address.pinCode"
                    value={responsiblePersonDetails.address.pinCode}
                    onChange={handleResponsiblePersonChange}
                    required
                    placeholder="Enter pin code"
                    maxLength={6}
                  />
                  <FormField
                    label="Telephone No."
                    name="telephoneNo"
                    value={responsiblePersonDetails.telephoneNo}
                    onChange={handleResponsiblePersonChange}
                    type="tel"
                    placeholder="Enter phone number"
                  />
                  <FormField
                    label="Email"
                    name="email"
                    value={responsiblePersonDetails.email}
                    onChange={handleResponsiblePersonChange}
                    type="email"
                    required
                    placeholder="Enter email"
                  />
                </div>
              </FormSection>

              {/* Section 4: Tax Details */}
              <FormSection title="4. Details of tax deducted and paid to the credit of Central Government">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Add details of tax deposited for this quarter
                    </p>
                    <ActionButton
                      onClick={addTaxDetail}
                      icon={Plus}
                      label="Add Tax Detail"
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2 text-left">Sr. No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">TDS (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Surcharge (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Education Cess (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Interest (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Others (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Total (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Cheque/DD No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">BSR Code</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Date Deposited</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Challan No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Book Entry</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxDetails.map((tax, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-3 py-2">{tax.srNo}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.tds}
                                onChange={(e) => handleTaxDetailChange(index, 'tds', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="TDS Amount"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.surcharge}
                                onChange={(e) => handleTaxDetailChange(index, 'surcharge', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Surcharge Amount"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.educationCess}
                                onChange={(e) => handleTaxDetailChange(index, 'educationCess', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Education Cess Amount"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.interest}
                                onChange={(e) => handleTaxDetailChange(index, 'interest', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Interest Amount"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.others}
                                onChange={(e) => handleTaxDetailChange(index, 'others', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Other Amounts"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={tax.totalTaxDeposited}
                                onChange={(e) => handleTaxDetailChange(index, 'totalTaxDeposited', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Total Tax Deposited"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={tax.chequeDD || ''}
                                onChange={(e) => handleTaxDetailChange(index, 'chequeDD', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Cheque/DD No."
                                title="Cheque or DD Number"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={tax.bsrCode}
                                onChange={(e) => handleTaxDetailChange(index, 'bsrCode', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="BSR Code"
                                maxLength={7}
                                title="BSR Code"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="date"
                                value={tax.dateOnWhichTaxDeposited}
                                onChange={(e) => handleTaxDetailChange(index, 'dateOnWhichTaxDeposited', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                title="Date Tax Deposited"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={tax.transferVoucherChallanSerialNo}
                                onChange={(e) => handleTaxDetailChange(index, 'transferVoucherChallanSerialNo', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Challan No."
                                title="Transfer Voucher/Challan Serial Number"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <select
                                value={tax.whetherTDSDepositedByBookEntry}
                                onChange={(e) => handleTaxDetailChange(index, 'whetherTDSDepositedByBookEntry', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                title="Whether TDS Deposited by Book Entry"
                              >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {taxDetails.length > 1 && (
                                <ActionButton
                                  onClick={() => removeTaxDetail(index)}
                                  icon={Trash2}
                                  label="Remove"
                                  variant="danger"
                                  size="sm"
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FormSection>

              {/* Section 5: Employee Salary Details */}
              <FormSection title="5. Details of salary paid and tax deducted thereon from the employees">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Add employee salary and TDS details
                    </p>
                    <ActionButton
                      onClick={addEmployeeDetail}
                      icon={Plus}
                      label="Add Employee"
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2 text-left">Sr. No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Employee Name</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Employee PAN</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Ref. No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Address</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Salary Paid (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Tax Deducted (₹)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Payment Date</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Payment Period</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Nature</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Section</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">TDS Rate (%)</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Certificate No.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Quarter</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeeSalaryDetails.map((employee, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-3 py-2">{employee.srNo}</td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.nameOfEmployee}
                                onChange={(e) => handleEmployeeDetailChange(index, 'nameOfEmployee', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Employee Name"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.panOfEmployee}
                                onChange={(e) => handleEmployeeDetailChange(index, 'panOfEmployee', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="PAN"
                                maxLength={10}
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.employeeReferenceNo || ''}
                                onChange={(e) => handleEmployeeDetailChange(index, 'employeeReferenceNo', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Ref. No."
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.addressOfEmployee || ''}
                                onChange={(e) => handleEmployeeDetailChange(index, 'addressOfEmployee', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Address"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={employee.amountOfSalaryPaid}
                                onChange={(e) => handleEmployeeDetailChange(index, 'amountOfSalaryPaid', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Amount of Salary Paid"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={employee.taxDeducted}
                                onChange={(e) => handleEmployeeDetailChange(index, 'taxDeducted', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                step="0.01"
                                title="Tax Deducted"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="date"
                                value={employee.dateOfPayment}
                                onChange={(e) => handleEmployeeDetailChange(index, 'dateOfPayment', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                title="Date of Payment"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.periodOfPayment}
                                onChange={(e) => handleEmployeeDetailChange(index, 'periodOfPayment', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Period"
                                title="Period of Payment"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.natureOfPayment}
                                onChange={(e) => handleEmployeeDetailChange(index, 'natureOfPayment', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Nature"
                                title="Nature of Payment"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <select
                                value={employee.sectionUnderWhichDeducted}
                                onChange={(e) => handleEmployeeDetailChange(index, 'sectionUnderWhichDeducted', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                title="Section Under Which Deducted"
                              >
                                <option value="192">192</option>
                                <option value="192A">192A</option>
                                <option value="194P">194P</option>
                              </select>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="number"
                                value={employee.rateOfTDS}
                                onChange={(e) => handleEmployeeDetailChange(index, 'rateOfTDS', Number(e.target.value))}
                                className="w-full px-2 py-1 text-sm border-none"
                                min="0"
                                max="100"
                                step="0.01"
                                title="Rate of TDS"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <input
                                type="text"
                                value={employee.certificateNo || ''}
                                onChange={(e) => handleEmployeeDetailChange(index, 'certificateNo', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                placeholder="Cert. No."
                                title="Certificate Number"
                              />
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <select
                                value={employee.quarterInWhichAmountPaid}
                                onChange={(e) => handleEmployeeDetailChange(index, 'quarterInWhichAmountPaid', e.target.value)}
                                className="w-full px-2 py-1 text-sm border-none"
                                title="Quarter in Which Amount Paid"
                              >
                                <option value="Q1">Q1</option>
                                <option value="Q2">Q2</option>
                                <option value="Q3">Q3</option>
                                <option value="Q4">Q4</option>
                              </select>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              {employeeSalaryDetails.length > 1 && (
                                <ActionButton
                                  onClick={() => removeEmployeeDetail(index)}
                                  icon={Trash2}
                                  label="Remove"
                                  variant="danger"
                                  size="sm"
                                />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FormSection>

              {/* Section 6: Verification */}
              <FormSection title="6. Verification">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Place"
                    name="place"
                    value={verification.place}
                    onChange={handleVerificationChange}
                    required
                    placeholder="Enter place"
                  />
                  <FormField
                    label="Date"
                    name="date"
                    value={verification.date}
                    onChange={handleVerificationChange}
                    type="date"
                    required
                  />
                  <FormField
                    label="Name of Person Responsible"
                    name="nameOfPersonResponsible"
                    value={verification.nameOfPersonResponsible}
                    onChange={handleVerificationChange}
                    required
                    placeholder="Enter name"
                  />
                  <FormField
                    label="Designation"
                    name="designation"
                    value={verification.designation}
                    onChange={handleVerificationChange}
                    required
                    placeholder="Enter designation"
                  />
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Declaration:</strong> I, <strong>{verification.nameOfPersonResponsible || '[Name]'}</strong>, 
                    hereby certify that all the particulars furnished above are correct and complete.
                  </p>
                </div>
              </FormSection>

              {/* Summary Section */}
              <FormSection title="Summary">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-700">{totalSummary.totalEmployees}</div>
                    <div className="text-sm text-blue-600">Total Employees</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-700">₹{totalSummary.totalSalaryPaid.toLocaleString()}</div>
                    <div className="text-sm text-green-600">Total Salary Paid</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-700">₹{totalSummary.totalTaxDeducted.toLocaleString()}</div>
                    <div className="text-sm text-yellow-600">Total TDS Deducted</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-700">₹{totalSummary.totalTaxDeposited.toLocaleString()}</div>
                    <div className="text-sm text-purple-600">Total Tax Deposited</div>
                  </div>
                </div>
              </FormSection>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end">
                <ActionButton
                  onClick={handleSaveForm}
                  icon={Save}
                  label="Save as Draft"
                  variant="secondary"
                />
                <ActionButton
                  onClick={handlePreview}
                  icon={Eye}
                  label="Preview"
                  variant="secondary"
                />
                <ActionButton
                  onClick={handlePreview}
                  icon={Printer}
                  label="Print"
                  variant="primary"
                />
              </div>
            </div>
          )}

          {/* Upload Return Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Upload Filed Return</h3>
                <p className="text-sm text-yellow-700">
                  Upload the acknowledgment file received after filing Form 24Q with the Income Tax Department.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Acknowledgment File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Supports .txt, .pdf files up to 5MB
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Choose File
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quarter
                  </label>
                  <select 
                  title='Quarter'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Q1">Q1 (Apr-Jun)</option>
                    <option value="Q2">Q2 (Jul-Sep)</option>
                    <option value="Q3">Q3 (Oct-Dec)</option>
                    <option value="Q4">Q4 (Jan-Mar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year
                  </label>
                  <select
                   title='Financial Year'
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form24Q;