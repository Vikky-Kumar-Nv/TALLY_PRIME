import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { 
  Search, Download, AlertTriangle, 
  TrendingDown, FileText, Target, Eye, Edit, Printer,
  Calculator, DollarSign
} from 'lucide-react';

interface PayableBillDetails {
  id: string;
  supplierName: string;
  billNo: string;
  billDate: string; // ISO date
  dueDate: string;  // ISO date
  billAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueDays: number;
  creditDays: number;
  interestAmount: number;
  voucherType: 'Purchase' | 'Payment' | 'Journal' | 'Credit Note' | 'Debit Note';
  reference?: string;
  narration?: string;
  ageingBucket: '0-30' | '31-60' | '61-90' | '90+';
  supplierGroup: string;
  supplierAddress?: string;
  supplierPhone?: string;
  supplierGSTIN?: string;
  creditLimit?: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  poNumber?: string;
  grnNumber?: string;
}

// Raw API object (may contain numbers as strings)
interface RawPayableBill {
  id?: unknown;
  supplierName?: unknown;
  billNo?: unknown;
  billDate?: unknown;
  dueDate?: unknown;
  billAmount?: unknown;
  paidAmount?: unknown;
  outstandingAmount?: unknown;
  overdueDays?: unknown;
  creditDays?: unknown;
  interestAmount?: unknown;
  voucherType?: unknown;
  reference?: unknown;
  narration?: unknown;
  ageingBucket?: unknown;
  supplierGroup?: unknown;
  supplierAddress?: unknown;
  supplierPhone?: unknown;
  supplierGSTIN?: unknown;
  creditLimit?: unknown;
  riskCategory?: unknown;
  poNumber?: unknown;
  grnNumber?: unknown;
}

const parseNumber = (v: unknown, fallback = 0): number => {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/,/g, ''));
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const isValidDate = (v: unknown) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

const isVoucherType = (v: unknown): v is PayableBillDetails['voucherType'] =>
  typeof v === 'string' && ['Purchase','Payment','Journal','Credit Note','Debit Note'].includes(v);
const isAgeingBucket = (v: unknown): v is PayableBillDetails['ageingBucket'] =>
  typeof v === 'string' && ['0-30','31-60','61-90','90+'].includes(v);
const isRiskCategory = (v: unknown): v is PayableBillDetails['riskCategory'] =>
  typeof v === 'string' && ['Low','Medium','High','Critical'].includes(v);

const mapRawBill = (raw: RawPayableBill): PayableBillDetails | null => {
  if (!raw || typeof raw !== 'object') return null;
  const id = typeof raw.id === 'string' ? raw.id : String(raw.id ?? '');
  if (!id) return null;
  const supplierName = typeof raw.supplierName === 'string' ? raw.supplierName : 'Unknown Supplier';
  const billNo = typeof raw.billNo === 'string' ? raw.billNo : 'N/A';
  const billDate = isValidDate(raw.billDate) ? String(raw.billDate) : new Date().toISOString();
  const dueDate = isValidDate(raw.dueDate) ? String(raw.dueDate) : billDate;
  const voucherType = isVoucherType(raw.voucherType) ? raw.voucherType : 'Purchase';
  const ageingBucket = isAgeingBucket(raw.ageingBucket) ? raw.ageingBucket : '0-30';
  const riskCategory = isRiskCategory(raw.riskCategory) ? raw.riskCategory : 'Low';
  const supplierGroup = typeof raw.supplierGroup === 'string' ? raw.supplierGroup : 'General';
  return {
    id,
    supplierName,
    billNo,
    billDate,
    dueDate,
    billAmount: parseNumber(raw.billAmount),
    paidAmount: parseNumber(raw.paidAmount),
    outstandingAmount: parseNumber(raw.outstandingAmount),
    overdueDays: parseNumber(raw.overdueDays),
    creditDays: parseNumber(raw.creditDays),
    interestAmount: parseNumber(raw.interestAmount),
    voucherType,
    reference: typeof raw.reference === 'string' ? raw.reference : undefined,
    narration: typeof raw.narration === 'string' ? raw.narration : undefined,
    ageingBucket,
    supplierGroup,
    supplierAddress: typeof raw.supplierAddress === 'string' ? raw.supplierAddress : undefined,
    supplierPhone: typeof raw.supplierPhone === 'string' ? raw.supplierPhone : undefined,
    supplierGSTIN: typeof raw.supplierGSTIN === 'string' ? raw.supplierGSTIN : undefined,
    creditLimit: parseNumber(raw.creditLimit, undefined as unknown as number),
    riskCategory,
    poNumber: typeof raw.poNumber === 'string' ? raw.poNumber : undefined,
    grnNumber: typeof raw.grnNumber === 'string' ? raw.grnNumber : undefined,
  };
};

const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try { return JSON.stringify(e); } catch { return 'Unknown error'; }
};

const BillwisePayables: React.FC = () => {
  const { theme } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedAgeingBucket, setSelectedAgeingBucket] = useState('');
  const [selectedRiskCategory, setSelectedRiskCategory] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'overdue' | 'supplier' | 'date'>('amount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showInterestCalculator, setShowInterestCalculator] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
const [payablesData, setPayablesData] = useState<PayableBillDetails[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string|null>(null);
  // Mock data - यह actual API से आएगा
  React.useEffect(() => {
    let abort = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm)          params.append('searchTerm', searchTerm);
        if (selectedSupplier)    params.append('selectedSupplier', selectedSupplier);
        if (selectedAgeingBucket)params.append('selectedAgeingBucket', selectedAgeingBucket);
        if (selectedRiskCategory)params.append('selectedRiskCategory', selectedRiskCategory);
        if (sortBy)              params.append('sortBy', sortBy);
        if (sortOrder)           params.append('sortOrder', sortOrder);

        const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/billwise-payables?${params.toString()}`);
        if (!res.ok) throw new Error(await res.text() || `Error: ${res.status}`);
        const json: unknown = await res.json();
        const list: PayableBillDetails[] = Array.isArray(json)
          ? json.map(j => mapRawBill(j as RawPayableBill)).filter((x): x is PayableBillDetails => !!x)
          : [];
        if (!abort) setPayablesData(list);
        if (!Array.isArray(json) && !abort) setError('Unexpected response format');
      } catch (e: unknown) {
        if (!abort) {
          setError(getErrorMessage(e));
          setPayablesData([]);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    fetchData();
    return () => { abort = true; };
  }, [
    searchTerm,
    selectedSupplier,
    selectedAgeingBucket,
    selectedRiskCategory,
    sortBy,
    sortOrder
  ]);
  // Filtering and sorting logic
  const filteredData = useMemo(() => {
    const filtered = payablesData.filter(bill => {
      const matchesSearch = !searchTerm || 
        bill.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.poNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSupplier = !selectedSupplier || bill.supplierName === selectedSupplier;
      const matchesAgeing = !selectedAgeingBucket || bill.ageingBucket === selectedAgeingBucket;
      const matchesRisk = !selectedRiskCategory || bill.riskCategory === selectedRiskCategory;
      
      return matchesSearch && matchesSupplier && matchesAgeing && matchesRisk;
    });

    // Sorting logic
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'amount':
          comparison = a.outstandingAmount - b.outstandingAmount;
          break;
        case 'overdue':
          comparison = a.overdueDays - b.overdueDays;
          break;
        case 'supplier':
          comparison = a.supplierName.localeCompare(b.supplierName);
          break;
        case 'date':
          comparison = new Date(a.billDate).getTime() - new Date(b.billDate).getTime();
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [payablesData, searchTerm, selectedSupplier, selectedAgeingBucket, selectedRiskCategory, sortBy, sortOrder]);

  // Summary calculations
  const summaryData = useMemo(() => {
    const total = filteredData.reduce((sum, bill) => sum + bill.outstandingAmount, 0);
    const overdue = filteredData.filter(bill => bill.overdueDays > 0).reduce((sum, bill) => sum + bill.outstandingAmount, 0);
    const current = total - overdue;
    const totalInterest = filteredData.reduce((sum, bill) => sum + bill.interestAmount, 0);
    
    const ageingBreakdown = {
      '0-30': filteredData.filter(b => b.ageingBucket === '0-30').reduce((sum, b) => sum + b.outstandingAmount, 0),
      '31-60': filteredData.filter(b => b.ageingBucket === '31-60').reduce((sum, b) => sum + b.outstandingAmount, 0),
      '61-90': filteredData.filter(b => b.ageingBucket === '61-90').reduce((sum, b) => sum + b.outstandingAmount, 0),
      '90+': filteredData.filter(b => b.ageingBucket === '90+').reduce((sum, b) => sum + b.outstandingAmount, 0)
    } as const;

    return { total, overdue, current, totalInterest, ageingBreakdown };
  }, [filteredData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAgeingColor = (bucket: string) => {
    switch (bucket) {
      case '0-30': return 'text-green-600 bg-green-100';
      case '31-60': return 'text-yellow-600 bg-yellow-100';
      case '61-90': return 'text-orange-600 bg-orange-100';
      case '90+': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Bill-wise Payables
            </h2>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Complete bill-wise payables analysis - Tally Style
            </p>
          </div>
          {loading && <div className="py-6 text-center">Loading...</div>}
          {error && <div className="py-6 text-center text-red-600">{error}</div>}

          <div className="flex space-x-2">
            <button 
              onClick={() => setShowInterestCalculator(!showInterestCalculator)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Calculator className="w-4 h-4 mr-2 inline" />
              Interest Calculator
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Printer className="w-4 h-4 mr-2 inline" />
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Payables
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                  {formatCurrency(summaryData.total)}
                </p>
              </div>
              <TrendingDown className={`w-8 h-8 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overdue Amount
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                  {formatCurrency(summaryData.overdue)}
                </p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Current Amount
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(summaryData.current)}
                </p>
              </div>
              <Target className={`w-8 h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Interest Amount
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  {formatCurrency(summaryData.totalInterest)}
                </p>
              </div>
              <DollarSign className={`w-8 h-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Bills
                </p>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {filteredData.length}
                </p>
              </div>
              <FileText className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        {/* Ageing Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(summaryData.ageingBreakdown).map(([bucket, amount]) => (
            <div key={bucket} className={`p-4 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAgeingColor(bucket)}`}>
                  {bucket} Days
                </span>
                <p className={`text-lg font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(amount)}
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {summaryData.total > 0 ? ((amount / summaryData.total) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Filters & Search
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search bills, suppliers, PO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                theme === 'dark'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
          
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            aria-label="Filter by supplier"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">All Suppliers</option>
            {Array.from(new Set(payablesData.map(b => b.supplierName))).map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>

          <select
            value={selectedAgeingBucket}
            onChange={(e) => setSelectedAgeingBucket(e.target.value)}
            aria-label="Filter by ageing bucket"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">All Ages</option>
            <option value="0-30">0-30 Days</option>
            <option value="31-60">31-60 Days</option>
            <option value="61-90">61-90 Days</option>
            <option value="90+">90+ Days</option>
          </select>

          <select
            value={selectedRiskCategory}
            onChange={(e) => setSelectedRiskCategory(e.target.value)}
            aria-label="Filter by risk category"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="">All Risk Categories</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
            <option value="Critical">Critical Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'amount' | 'overdue' | 'supplier' | 'date')}
            aria-label="Sort by"
            className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="amount">Sort by Amount</option>
            <option value="overdue">Sort by Overdue</option>
            <option value="supplier">Sort by Supplier</option>
            <option value="date">Sort by Date</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <button
              onClick={() => setShowBillDetails(!showBillDetails)}
              aria-label={`${showBillDetails ? 'Hide' : 'Show'} bill details`}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                showBillDetails
                  ? 'bg-blue-600 text-white border-blue-600'
                  : theme === 'dark'
                    ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bill-wise Data Table */}
      <div className={`rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Bill-wise Payables Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Supplier Details
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Bill Details
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Amount Details
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Ageing & Risk
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredData.map((bill) => (
                <tr key={bill.id} className={`hover:bg-opacity-50 transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {bill.supplierName}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {bill.supplierGroup}
                      </div>
                      {showBillDetails && (
                        <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <div>📍 {bill.supplierAddress}</div>
                          <div>📞 {bill.supplierPhone}</div>
                          <div>🏢 {bill.supplierGSTIN}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {bill.billNo}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        📅 {formatDate(bill.billDate)}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        ⏰ Due: {formatDate(bill.dueDate)}
                      </div>
                      {showBillDetails && (
                        <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <div>📝 PO: {bill.poNumber}</div>
                          <div>📦 GRN: {bill.grnNumber}</div>
                          <div>🔗 Ref: {bill.reference}</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(bill.outstandingAmount)}
                      </div>
                      {showBillDetails && (
                        <>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Bill: {formatCurrency(bill.billAmount)}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Paid: {formatCurrency(bill.paidAmount)}
                          </div>
                          {bill.interestAmount > 0 && (
                            <div className={`text-xs ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                              Interest: {formatCurrency(bill.interestAmount)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAgeingColor(bill.ageingBucket)}`}>
                        {bill.ageingBucket} Days
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(bill.riskCategory)}`}>
                        {bill.riskCategory} Risk
                      </span>
                      {bill.overdueDays > 0 && (
                        <>
                          <br />
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {bill.overdueDays} Days Overdue
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        title="View Bill"
                        aria-label="View Bill"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Bill"
                        aria-label="Edit Bill"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Print Bill"
                        aria-label="Print Bill"
                        className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interest Calculator Modal */}
      {showInterestCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full mx-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Interest Calculator
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Outstanding Amount
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter rate"
                  defaultValue="18"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Overdue Days
                </label>
                <input
                  type="number"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  placeholder="Enter days"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowInterestCalculator(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Calculate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillwisePayables;
