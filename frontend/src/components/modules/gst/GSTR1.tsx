import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer ,Download, Filter, Upload } from 'lucide-react';

const GSTR1: React.FC = () => {
  const { theme } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <div className='pt-[56px] px-4 '>
      <div className="flex items-center mb-6">
        <button
        title='Back to Reports'
        type='button'
          onClick={() => navigate('/app/gst')}
          className={`mr-4 p-2 rounded-full ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">GSTR-1 Return</h1>
        <div className="ml-auto flex space-x-2">
          <button
          type='button'
          title='Filter'
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Filter size={18} />
          </button>
          <button
          title='upload'
          type='button'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Upload size={18} />
          </button>
           <button
             title='Print Report'
             type='button'
             className={`p-2 rounded-md ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                    >
             <Printer size={18} />
                    </button>
          <button
          title='Export'
          type='button'
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
          <h3 className="font-semibold mb-4">Return Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Month
              </label>
              <select
              title='Select Month'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year
              </label>
              <select
                title='Select Year'
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Summary Cards */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="text-lg font-semibold mb-4">B2B Supplies</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>No. of Recipients</span>
              <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between">
              <span>No. of Invoices</span>
              <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Taxable Value</span>
              <span className="font-mono">₹ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tax Amount</span>
              <span className="font-mono">₹ 0.00</span>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="text-lg font-semibold mb-4">B2C Supplies</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>No. of Invoices</span>
              <span className="font-mono">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Taxable Value</span>
              <span className="font-mono">₹ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Total Tax Amount</span>
              <span className="font-mono">₹ 0.00</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4">
          <h2 className="text-xl font-bold">GSTR-1 Summary</h2>
          <p className="text-sm opacity-75">Outward supplies for the selected period</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b-2 border-gray-300'
              }`}>
                <th className="px-4 py-3 text-left">Nature of Supply</th>
                <th className="px-4 py-3 text-right">No. of Records</th>
                <th className="px-4 py-3 text-right">Taxable Value</th>
                <th className="px-4 py-3 text-right">Integrated Tax</th>
                <th className="px-4 py-3 text-right">Central Tax</th>
                <th className="px-4 py-3 text-right">State/UT Tax</th>
                <th className="px-4 py-3 text-right">Cess</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <td className="px-4 py-3">B2B Supplies</td>
                <td className="px-4 py-3 text-right font-mono">0</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
              </tr>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <td className="px-4 py-3">B2C Large Supplies</td>
                <td className="px-4 py-3 text-right font-mono">0</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
              </tr>
              <tr className={`${
                theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'
              }`}>
                <td className="px-4 py-3">B2C Small Supplies</td>
                <td className="px-4 py-3 text-right font-mono">0</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className={`font-bold ${
                theme === 'dark' ? 'border-t-2 border-gray-600' : 'border-t-2 border-gray-300'
              }`}>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right font-mono">0</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
                <td className="px-4 py-3 text-right font-mono">0.00</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className={`mt-6 p-4 rounded ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-orange-50'
      }`}>
        <p className="text-sm">
          <span className="font-semibold">GST Filing:</span> Ensure all outward supplies are recorded before filing GSTR-1.
        </p>
      </div>
    </div>
  );
};

export default GSTR1;