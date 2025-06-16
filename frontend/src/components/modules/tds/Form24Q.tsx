import React, { useState } from 'react';
import { FileText, Download, Upload,ArrowLeft } from 'lucide-react'; //, Calendar, Search, Filter
import { useNavigate } from 'react-router-dom';

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
}

const Form24Q: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'returns' | 'generate' | 'upload'>('returns');
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [selectedYear, setSelectedYear] = useState('2023-24');

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
                  onClick={() => navigate('/tds')}
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
                { id: 'returns', label: 'Filed Returns' },
                { id: 'generate', label: 'Generate Return' },
                { id: 'upload', label: 'Upload Return' }
              ].map((tab) => (
                <button
                title='navigation'
                type='button'
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'returns' )}
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
          {activeTab === 'returns' && (
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
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Generate Form 24Q</h3>
                <p className="text-sm text-blue-700">
                  Generate quarterly TDS return for salary payments under sections 192, 192A, and 194P.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Year *
                  </label>
                  <select
                  title='Financial Year'
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2023-24">2023-24</option>
                    <option value="2022-23">2022-23</option>
                    <option value="2021-22">2021-22</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quarter *
                  </label>
                  <select
                  title='Quarter'
                    value={selectedQuarter}
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Q1">Q1 (Apr-Jun)</option>
                    <option value="Q2">Q2 (Jul-Sep)</option>
                    <option value="Q3">Q3 (Oct-Dec)</option>
                    <option value="Q4">Q4 (Jan-Mar)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Return Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Employees</div>
                    <div className="text-xl font-bold text-gray-900">156</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total TDS Deducted</div>
                    <div className="text-xl font-bold text-gray-900">₹25,50,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total TDS Deposited</div>
                    <div className="text-xl font-bold text-gray-900">₹25,50,000</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Return
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Preview
                </button>
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