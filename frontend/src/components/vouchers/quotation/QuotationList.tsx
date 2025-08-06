import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, Eye, Edit } from 'lucide-react';
import type { VoucherEntry, VoucherEntryLine } from '../../../types';

const QuotationList: React.FC = () => {
  const { theme, vouchers, ledgers } = useAppContext();
  const navigate = useNavigate();

  // Safe fallbacks with proper typing
  const safeVouchers = vouchers || [];
  const safeLedgers = ledgers || [];

  // Filter only quotation vouchers
  const quotationVouchers = safeVouchers.filter(voucher => 
    voucher.type === 'quotation' || voucher.isQuotation === true
  );

  // Helper function to get party name
  const getPartyName = (partyId: string | undefined): string => {
    if (!partyId) return 'No Party';
    const party = safeLedgers.find(l => l.id === partyId);
    return party?.name || 'Unknown Party';
  };

  // Helper function to format date
  const formatDate = (date: string | Date): string => {
    try {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Calculate quotation total
  const calculateQuotationTotal = (voucher: VoucherEntry): number => {
    if (!voucher.entries || voucher.entries.length === 0) return 0;
    
    return voucher.entries.reduce((total: number, entry: VoucherEntryLine) => {
      const quantity = entry.quantity || 0;
      const rate = entry.rate || 0;
      const gstRate = (entry.cgstRate || 0) + (entry.sgstRate || 0) + (entry.igstRate || 0);
      const baseAmount = quantity * rate;
      const gstAmount = baseAmount * gstRate / 100;
      return total + baseAmount + gstAmount;
    }, 0);
  };

  return (
    <div className='pt-[56px] px-4'>
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button
          title='Back to Vouchers'
          onClick={() => navigate('/app/vouchers')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">📋 Sales Quotations</h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage all your sales quotations
          </p>
        </div>
        <button
          onClick={() => navigate('/app/vouchers/quotation/create')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Plus size={20} />
          New Quotation
        </button>
      </div>

      {/* Quotations List */}
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm border border-gray-200'}`}>
        {quotationVouchers && quotationVouchers.length > 0 ? (
          <div className="p-6">
            <div className="space-y-4">
              {quotationVouchers.map((quotation, index) => (
                <div
                  key={quotation.id || `quotation-${index}`}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-violet-900/50' : 'bg-violet-100'}`}>
                          <FileText size={16} className={theme === 'dark' ? 'text-violet-300' : 'text-violet-600'} />
                        </div>
                        <div>
                          <span className="font-semibold text-lg">
                            {quotation.number}
                          </span>
                          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                            theme === 'dark' ? 'bg-violet-900/50 text-violet-300' : 'bg-violet-100 text-violet-700'
                          }`}>
                            Quotation
                          </span>
                        </div>
                      </div>
                      
                      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>
                          <span className="font-medium">Date:</span>
                          <span className="ml-2">{formatDate(quotation.date)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Party:</span>
                          <span className="ml-2 truncate">{getPartyName(quotation.partyId)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Items:</span>
                          <span className="ml-2">{quotation.entries?.length || 0}</span>
                        </div>
                      </div>

                      {quotation.referenceNo && (
                        <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Reference:</span>
                          <span className="ml-2">{quotation.referenceNo}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        ₹{calculateQuotationTotal(quotation).toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => {
                            // View quotation details
                            console.log('Viewing quotation:', quotation);
                            alert(`Quotation Details:\nNumber: ${quotation.number}\nParty: ${getPartyName(quotation.partyId)}\nTotal: ₹${calculateQuotationTotal(quotation).toFixed(2)}`);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' 
                              ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                          }`}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button
                          onClick={() => navigate(`/app/vouchers/sales/edit/${quotation.id}`)}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === 'dark' 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          title="Edit Quotation"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <FileText size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Quotations Found</h3>
            <p className="text-sm mb-6">You haven't created any sales quotations yet.</p>
            <button
              onClick={() => navigate('/app/vouchers/quotation/create')}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 mx-auto ${
                theme === 'dark' 
                  ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                  : 'bg-violet-500 hover:bg-violet-600 text-white'
              }`}
            >
              <Plus size={20} />
              Create Your First Quotation
            </button>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {quotationVouchers && quotationVouchers.length > 0 && (
        <div className={`mt-6 p-4 rounded-lg border-l-4 ${
          theme === 'dark' 
            ? 'bg-violet-900/20 border-violet-500 text-violet-200' 
            : 'bg-violet-50 border-violet-400 text-violet-700'
        }`}>
          <h3 className="font-semibold text-sm mb-2">📊 Quotation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Quotations:</span>
              <span className="ml-2">{quotationVouchers.length}</span>
            </div>
            <div>
              <span className="font-medium">Total Value:</span>
              <span className="ml-2">₹{quotationVouchers.reduce((total, q) => total + calculateQuotationTotal(q), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div>
              <span className="font-medium">Avg. Value:</span>
              <span className="ml-2">₹{quotationVouchers.length > 0 ? (quotationVouchers.reduce((total, q) => total + calculateQuotationTotal(q), 0) / quotationVouchers.length).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationList;
