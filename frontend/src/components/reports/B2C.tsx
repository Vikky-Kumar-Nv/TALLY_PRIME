import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Eye,
  User,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';
import * as XLSX from 'xlsx';
import './reports.css';

interface B2CCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  registrationDate: string;
  lastActivity: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  customerSegment: 'new' | 'regular' | 'premium' | 'vip';
  loyaltyPoints: number;
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: 'budget' | 'mid-range' | 'premium';
    communicationChannel: 'email' | 'sms' | 'app' | 'whatsapp';
  };
  status: 'active' | 'inactive' | 'suspended';
  riskProfile: 'low' | 'medium' | 'high';
  socialProfiles?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

interface B2CTransaction {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: {
    itemId: string;
    itemName: string;
    category: string;
    brand: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    amount: number;
    image?: string;
  }[];
  totalAmount: number;
  discount: number;
  taxAmount: number;
  shippingAmount: number;
  netAmount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod' | 'emi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  orderStatus: 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryDate?: string;
  rating?: number;
  review?: string;
  source: 'website' | 'mobile_app' | 'marketplace' | 'social' | 'referral';
  campaign?: string;
  couponUsed?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
}

interface FilterState {
  dateRange: string;
  fromDate: string;
  toDate: string;
  customerFilter: string;
  paymentMethod: string;
  orderStatus: string;
  customerSegment: string;
  source: string;
  amountRangeMin: string;
  amountRangeMax: string;
}

const B2C: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedView, setSelectedView] = useState<'dashboard' | 'customers' | 'orders' | 'analytics' | 'marketing'>('dashboard');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'this-month',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    customerFilter: '',
    paymentMethod: '',
    orderStatus: '',
    customerSegment: '',
    source: '',
    amountRangeMin: '',
    amountRangeMax: ''
  });

  // Mock B2C customer data
  const b2cCustomers = useMemo((): B2CCustomer[] => [
    {
      id: 'CUST001',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 9876543210',
      dateOfBirth: '1990-05-15',
      gender: 'female',
      address: {
        street: '123 Green Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      registrationDate: '2024-01-15',
      lastActivity: '2025-07-20',
      totalOrders: 12,
      totalSpent: 45000,
      averageOrderValue: 3750,
      customerSegment: 'premium',
      loyaltyPoints: 2250,
      preferences: {
        categories: ['Electronics', 'Fashion', 'Home'],
        brands: ['Samsung', 'Nike', 'Apple'],
        priceRange: 'premium',
        communicationChannel: 'app'
      },
      status: 'active',
      riskProfile: 'low',
      socialProfiles: {
        instagram: '@priya_sharma',
        facebook: 'priya.sharma.90'
      }
    },
    {
      id: 'CUST002',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      phone: '+91 8765432109',
      dateOfBirth: '1985-03-22',
      gender: 'male',
      address: {
        street: '456 Tech City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
      },
      registrationDate: '2023-08-10',
      lastActivity: '2025-07-25',
      totalOrders: 8,
      totalSpent: 32000,
      averageOrderValue: 4000,
      customerSegment: 'regular',
      loyaltyPoints: 1600,
      preferences: {
        categories: ['Electronics', 'Books', 'Sports'],
        brands: ['Dell', 'Adidas', 'Sony'],
        priceRange: 'mid-range',
        communicationChannel: 'email'
      },
      status: 'active',
      riskProfile: 'low'
    },
    {
      id: 'CUST003',
      name: 'Anita Patel',
      email: 'anita.patel@email.com',
      phone: '+91 7654321098',
      dateOfBirth: '1992-11-08',
      gender: 'female',
      address: {
        street: '789 Royal Complex',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        country: 'India'
      },
      registrationDate: '2025-06-01',
      lastActivity: '2025-07-15',
      totalOrders: 3,
      totalSpent: 8500,
      averageOrderValue: 2833,
      customerSegment: 'new',
      loyaltyPoints: 425,
      preferences: {
        categories: ['Fashion', 'Beauty', 'Jewelry'],
        brands: ['Zara', 'Lakme', 'Tanishq'],
        priceRange: 'budget',
        communicationChannel: 'whatsapp'
      },
      status: 'active',
      riskProfile: 'low'
    }
  ], []);

  // Mock B2C transaction data
  const b2cTransactions = useMemo((): B2CTransaction[] => [
    {
      id: 'ORD001',
      customerId: 'CUST001',
      customerName: 'Priya Sharma',
      orderNumber: 'B2C-2025-001',
      orderDate: '2025-07-01',
      items: [
        {
          itemId: 'ITEM001',
          itemName: 'iPhone 15 Pro',
          category: 'Electronics',
          brand: 'Apple',
          quantity: 1,
          unitPrice: 120000,
          discount: 5000,
          taxRate: 18,
          amount: 115000
        },
        {
          itemId: 'ITEM002',
          itemName: 'AirPods Pro',
          category: 'Electronics',
          brand: 'Apple',
          quantity: 1,
          unitPrice: 25000,
          discount: 1000,
          taxRate: 18,
          amount: 24000
        }
      ],
      totalAmount: 139000,
      discount: 6000,
      taxAmount: 25020,
      shippingAmount: 0,
      netAmount: 164020,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      shippingAddress: {
        street: '123 Green Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      deliveryDate: '2025-07-05',
      rating: 5,
      review: 'Excellent product and fast delivery!',
      source: 'mobile_app',
      campaign: 'Summer Sale 2025',
      couponUsed: 'SUMMER5000',
      loyaltyPointsEarned: 820,
      loyaltyPointsUsed: 0
    },
    {
      id: 'ORD002',
      customerId: 'CUST002',
      customerName: 'Rahul Kumar',
      orderNumber: 'B2C-2025-002',
      orderDate: '2025-07-03',
      items: [
        {
          itemId: 'ITEM003',
          itemName: 'Dell XPS 13 Laptop',
          category: 'Electronics',
          brand: 'Dell',
          quantity: 1,
          unitPrice: 80000,
          discount: 3000,
          taxRate: 18,
          amount: 77000
        }
      ],
      totalAmount: 77000,
      discount: 3000,
      taxAmount: 13860,
      shippingAmount: 500,
      netAmount: 91360,
      paymentMethod: 'emi',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      shippingAddress: {
        street: '456 Tech City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      deliveryDate: '2025-07-08',
      rating: 4,
      review: 'Good laptop, delivery was on time',
      source: 'website',
      loyaltyPointsEarned: 457,
      loyaltyPointsUsed: 500
    },
    {
      id: 'ORD003',
      customerId: 'CUST003',
      customerName: 'Anita Patel',
      orderNumber: 'B2C-2025-003',
      orderDate: '2025-07-10',
      items: [
        {
          itemId: 'ITEM004',
          itemName: 'Designer Kurti Set',
          category: 'Fashion',
          brand: 'Fabindia',
          quantity: 2,
          unitPrice: 2500,
          discount: 250,
          taxRate: 5,
          amount: 4750
        },
        {
          itemId: 'ITEM005',
          itemName: 'Gold Earrings',
          category: 'Jewelry',
          brand: 'Tanishq',
          quantity: 1,
          unitPrice: 15000,
          discount: 500,
          taxRate: 3,
          amount: 14500
        }
      ],
      totalAmount: 19250,
      discount: 750,
      taxAmount: 673,
      shippingAmount: 150,
      netAmount: 20073,
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      shippingAddress: {
        street: '789 Royal Complex',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001'
      },
      source: 'social',
      campaign: 'Instagram Ads',
      loyaltyPointsEarned: 100,
      loyaltyPointsUsed: 0
    }
  ], []);

  const filteredTransactions = useMemo(() => {
    return b2cTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.orderDate);
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      
      const dateInRange = transactionDate >= fromDate && transactionDate <= toDate;
      const customerMatch = !filters.customerFilter || 
        transaction.customerName.toLowerCase().includes(filters.customerFilter.toLowerCase());
      const paymentMatch = !filters.paymentMethod || transaction.paymentMethod === filters.paymentMethod;
      const statusMatch = !filters.orderStatus || transaction.orderStatus === filters.orderStatus;
      const sourceMatch = !filters.source || transaction.source === filters.source;
      
      return dateInRange && customerMatch && paymentMatch && statusMatch && sourceMatch;
    });
  }, [b2cTransactions, filters]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalOrders = filteredTransactions.length;
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.netAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalCustomers = b2cCustomers.length;
    const activeCustomers = b2cCustomers.filter(c => c.status === 'active').length;
    const customerLifetimeValue = totalCustomers > 0 ? 
      b2cCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers : 0;
    
    const orderStatusCounts = {
      placed: filteredTransactions.filter(t => t.orderStatus === 'placed').length,
      confirmed: filteredTransactions.filter(t => t.orderStatus === 'confirmed').length,
      shipped: filteredTransactions.filter(t => t.orderStatus === 'shipped').length,
      delivered: filteredTransactions.filter(t => t.orderStatus === 'delivered').length,
      cancelled: filteredTransactions.filter(t => t.orderStatus === 'cancelled').length,
      returned: filteredTransactions.filter(t => t.orderStatus === 'returned').length
    };

    const paymentMethodCounts = {
      card: filteredTransactions.filter(t => t.paymentMethod === 'card').length,
      upi: filteredTransactions.filter(t => t.paymentMethod === 'upi').length,
      netbanking: filteredTransactions.filter(t => t.paymentMethod === 'netbanking').length,
      wallet: filteredTransactions.filter(t => t.paymentMethod === 'wallet').length,
      cod: filteredTransactions.filter(t => t.paymentMethod === 'cod').length,
      emi: filteredTransactions.filter(t => t.paymentMethod === 'emi').length
    };

    const sourceCounts = {
      website: filteredTransactions.filter(t => t.source === 'website').length,
      mobile_app: filteredTransactions.filter(t => t.source === 'mobile_app').length,
      marketplace: filteredTransactions.filter(t => t.source === 'marketplace').length,
      social: filteredTransactions.filter(t => t.source === 'social').length,
      referral: filteredTransactions.filter(t => t.source === 'referral').length
    };

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      totalCustomers,
      activeCustomers,
      customerLifetimeValue,
      orderStatusCounts,
      paymentMethodCounts,
      sourceCounts,
      topCustomers: b2cCustomers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
    };
  }, [filteredTransactions, b2cCustomers]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Update progress bar widths after render
  useEffect(() => {
    const progressBars = document.querySelectorAll('.progress-bar[data-percentage]');
    progressBars.forEach((bar) => {
      const percentage = bar.getAttribute('data-percentage');
      if (percentage && bar instanceof HTMLElement) {
        bar.style.width = `${percentage}%`;
      }
    });
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (range: string) => {
    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    switch (range) {
      case 'today':
        fromDate = toDate = today;
        break;
      case 'this-week':
        fromDate = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
        break;
      case 'this-month':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'this-quarter': {
        const quarterStart = Math.floor(today.getMonth() / 3) * 3;
        fromDate = new Date(today.getFullYear(), quarterStart, 1);
        break;
      }
      case 'this-year':
        fromDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    setFilters(prev => ({
      ...prev,
      dateRange: range,
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0]
    }));
  };

  const handleExport = () => {
    const exportData = filteredTransactions.map(transaction => ({
      'Order Number': transaction.orderNumber,
      'Customer': transaction.customerName,
      'Order Date': transaction.orderDate,
      'Total Amount': transaction.totalAmount,
      'Discount': transaction.discount,
      'Tax Amount': transaction.taxAmount,
      'Net Amount': transaction.netAmount,
      'Payment Method': transaction.paymentMethod,
      'Payment Status': transaction.paymentStatus,
      'Order Status': transaction.orderStatus,
      'Source': transaction.source,
      'Loyalty Points Earned': transaction.loyaltyPointsEarned
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'B2C Orders');
    XLSX.writeFile(wb, `B2C_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'text-green-800 bg-green-100';
      case 'shipped':
      case 'confirmed':
        return 'text-blue-800 bg-blue-100';
      case 'placed':
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'cancelled':
      case 'returned':
      case 'failed':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip':
        return 'text-purple-800 bg-purple-100';
      case 'premium':
        return 'text-blue-800 bg-blue-100';
      case 'regular':
        return 'text-green-800 bg-green-100';
      case 'new':
        return 'text-orange-800 bg-orange-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="pt-[56px] px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/app/reports')}
            title="Back to Reports"
            className={`p-2 rounded-lg mr-3 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2 text-purple-600" size={28} />
              B2C Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Business-to-Consumer sales and customer management</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            title="Toggle Filters"
            className={`p-2 rounded-lg ${
              showFilterPanel
                ? (theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500 text-white')
                : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }`}
          >
            <Filter size={16} />
          </button>
          <button
            onClick={handleExport}
            title="Export to Excel"
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className={`p-4 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                title="Select date range"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                } outline-none`}
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                placeholder="Search customer..."
                value={filters.customerFilter}
                onChange={(e) => handleFilterChange('customerFilter', e.target.value)}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                } outline-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                title="Select payment method"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                } outline-none`}
              >
                <option value="">All Methods</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
                <option value="cod">Cash on Delivery</option>
                <option value="emi">EMI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Order Status</label>
              <select
                value={filters.orderStatus}
                onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                title="Select order status"
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                } outline-none`}
              >
                <option value="">All Status</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* View Selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {(['dashboard', 'customers', 'orders', 'analytics', 'marketing'] as const).map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
              selectedView === view
                ? (theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      <div ref={printRef}>
        {/* Dashboard View */}
        {selectedView === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Total Orders</p>
                    <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                    <p className="text-xs text-green-600">+12% from last month</p>
                  </div>
                  <ShoppingBag className="text-purple-500" size={24} />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                    <p className="text-xs text-green-600">+8% from last month</p>
                  </div>
                  <DollarSign className="text-green-500" size={24} />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Avg Order Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.avgOrderValue)}</p>
                    <p className="text-xs text-blue-600">+5% from last month</p>
                  </div>
                  <TrendingUp className="text-blue-500" size={24} />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-75">Active Customers</p>
                    <p className="text-2xl font-bold">{analytics.activeCustomers}</p>
                    <p className="text-xs text-purple-600">+15% from last month</p>
                  </div>
                  <User className="text-orange-500" size={24} />
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <tr>
                      <th className="text-left p-3">Order</th>
                      <th className="text-left p-3">Customer</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className={`border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{transaction.orderNumber}</div>
                            <div className="text-sm opacity-75">{transaction.items.length} items</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{transaction.customerName}</div>
                            <div className="text-sm opacity-75">{transaction.source}</div>
                          </div>
                        </td>
                        <td className="p-3 font-medium">{formatCurrency(transaction.netAmount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.orderStatus)}`}>
                            {transaction.orderStatus}
                          </span>
                        </td>
                        <td className="p-3">{new Date(transaction.orderDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Customers */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
              <div className="space-y-3">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={customer.id} className={`flex items-center justify-between p-3 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm opacity-75">{customer.customerSegment} customer</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
                      <div className="text-sm opacity-75">{customer.totalOrders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customers View */}
        {selectedView === 'customers' && (
          <div className={`rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Customer Database</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Segment</th>
                    <th className="text-left p-3">Total Spent</th>
                    <th className="text-left p-3">Orders</th>
                    <th className="text-left p-3">Loyalty Points</th>
                    <th className="text-left p-3">Last Activity</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {b2cCustomers.map((customer) => (
                    <tr key={customer.id} className={`border-b ${
                      theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm opacity-75">{customer.email}</div>
                          <div className="text-xs opacity-60">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSegmentColor(customer.customerSegment)}`}>
                          {customer.customerSegment}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(customer.totalSpent)}</td>
                      <td className="p-3">{customer.totalOrders}</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <Star className="text-yellow-500 mr-1" size={14} />
                          {customer.loyaltyPoints}
                        </div>
                      </td>
                      <td className="p-3">{new Date(customer.lastActivity).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <button
                          title="View Profile"
                          className={`p-1 rounded ${
                            theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders View */}
        {selectedView === 'orders' && (
          <div className={`rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
          }`}>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Order Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className="text-left p-3">Order Number</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Items</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Payment</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className={`border-b ${
                      theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <td className="p-3 font-medium">{transaction.orderNumber}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-sm opacity-75">{transaction.source}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{transaction.items.length} items</div>
                          <div className="text-sm opacity-75">
                            {transaction.items.slice(0, 2).map(item => item.itemName).join(', ')}
                            {transaction.items.length > 2 && '...'}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(transaction.netAmount)}</td>
                      <td className="p-3">
                        <div>
                          <div className="capitalize">{transaction.paymentMethod}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.paymentStatus)}`}>
                            {transaction.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.orderStatus)}`}>
                          {transaction.orderStatus}
                        </span>
                      </td>
                      <td className="p-3">{new Date(transaction.orderDate).toLocaleDateString()}</td>
                      <td className="p-3 text-center">
                        <button
                          title="View Order"
                          className={`p-1 rounded ${
                            theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {selectedView === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Status Distribution */}
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.orderStatusCounts).map(([status, count]) => {
                    const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="capitalize">{status}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className={`h-2 rounded-full absolute left-0 top-0 progress-bar ${
                                status === 'delivered' ? 'bg-green-500' :
                                status === 'shipped' ? 'bg-blue-500' :
                                status === 'cancelled' || status === 'returned' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}
                              data-percentage={percentage}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Payment Method Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.paymentMethodCounts).map(([method, count]) => {
                    const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <span className="capitalize">{method.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className="bg-purple-500 h-2 rounded-full absolute left-0 top-0 progress-bar"
                              data-percentage={percentage}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Traffic Source Distribution */}
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Traffic Source Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.sourceCounts).map(([source, count]) => {
                    const percentage = analytics.totalOrders > 0 ? (count / analytics.totalOrders) * 100 : 0;
                    return (
                      <div key={source} className="flex items-center justify-between">
                        <span className="capitalize">{source.replace('_', ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                            <div 
                              className="bg-orange-500 h-2 rounded-full absolute left-0 top-0 progress-bar"
                              data-percentage={percentage}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Metrics */}
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Customer Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Customer Lifetime Value</span>
                    <span className="font-medium">{formatCurrency(analytics.customerLifetimeValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Customers</span>
                    <span className="font-medium">{analytics.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Customers</span>
                    <span className="font-medium">{analytics.activeCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Retention Rate</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Marketing View */}
        {selectedView === 'marketing' && (
          <div className="space-y-6">
            {/* Campaign Performance */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2">Summer Sale 2025</h4>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(164020)}</div>
                  <div className="text-sm opacity-75">1 order • 100% conversion</div>
                </div>
                <div className={`p-4 rounded border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2">Instagram Ads</h4>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(20073)}</div>
                  <div className="text-sm opacity-75">1 order • 85% conversion</div>
                </div>
                <div className={`p-4 rounded border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h4 className="font-medium mb-2">Referral Program</h4>
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(0)}</div>
                  <div className="text-sm opacity-75">0 orders • New campaign</div>
                </div>
              </div>
            </div>

            {/* Customer Segments */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['new', 'regular', 'premium', 'vip'].map(segment => {
                  const count = b2cCustomers.filter(c => c.customerSegment === segment).length;
                  const totalValue = b2cCustomers
                    .filter(c => c.customerSegment === segment)
                    .reduce((sum, c) => sum + c.totalSpent, 0);
                  
                  return (
                    <div key={segment} className={`p-4 rounded border text-center ${
                      theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h4 className={`font-medium mb-2 capitalize ${getSegmentColor(segment)}`}>
                        {segment} Customers
                      </h4>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm opacity-75">{formatCurrency(totalValue)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loyalty Program */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Loyalty Program Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {b2cCustomers.reduce((sum, c) => sum + c.loyaltyPoints, 0)}
                  </div>
                  <div className="text-sm opacity-75">Total Points Issued</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredTransactions.reduce((sum, t) => sum + t.loyaltyPointsUsed, 0)}
                  </div>
                  <div className="text-sm opacity-75">Points Redeemed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm opacity-75">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pro Tip */}
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Use the B2C module to track customer behavior, 
          analyze purchase patterns, and create targeted marketing campaigns. Leverage loyalty programs to increase retention.
        </p>
      </div>
    </div>
  );
};

export default B2C;
