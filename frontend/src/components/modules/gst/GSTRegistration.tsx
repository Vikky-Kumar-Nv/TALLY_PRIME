import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, Upload, Download } from 'lucide-react';

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  documents?: string[];
}

const GSTRegistration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'status' | 'documents'>('apply');
  const [applicationData, setApplicationData] = useState({
    businessName: '',
    pan: '',
    businessType: '',
    turnover: '',
    state: '',
    address: ''
  });

  const registrationSteps: RegistrationStep[] = [
    {
      id: 1,
      title: 'Business Information',
      description: 'Provide basic business details and PAN information',
      status: 'completed',
      documents: ['PAN Card', 'Address Proof']
    },
    {
      id: 2,
      title: 'Document Upload',
      description: 'Upload required documents for verification',
      status: 'current',
      documents: ['Bank Statement', 'Rent Agreement', 'Board Resolution']
    },
    {
      id: 3,
      title: 'Verification',
      description: 'Document verification by GST authorities',
      status: 'pending'
    },
    {
      id: 4,
      title: 'GST Certificate',
      description: 'Receive GST registration certificate',
      status: 'pending'
    }
  ];

  const requiredDocuments = [
    {
      name: 'PAN Card',
      description: 'Permanent Account Number of the business',
      status: 'uploaded',
      required: true
    },
    {
      name: 'Address Proof',
      description: 'Registered office address proof',
      status: 'uploaded',
      required: true
    },
    {
      name: 'Bank Statement',
      description: 'Last 3 months bank statement',
      status: 'pending',
      required: true
    },
    {
      name: 'Rent Agreement',
      description: 'Office premises rent agreement',
      status: 'pending',
      required: false
    },
    {
      name: 'Board Resolution',
      description: 'For companies and LLPs',
      status: 'not-required',
      required: false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not-required':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">GST Registration</h1>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'apply', label: 'Apply for GST' },
                { id: 'status', label: 'Application Status' },
                { id: 'documents', label: 'Documents' }
              ].map((tab) => (
                <button
                title='Click to switch tabs'
                type='button'
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'apply' | 'status' | 'documents')}
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

          {/* Apply for GST Tab */}
          {activeTab === 'apply' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">GST Registration Requirements</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Businesses with turnover exceeding ₹40 lakhs (₹20 lakhs for special category states)</li>
                  <li>• Inter-state supply of goods or services</li>
                  <li>• E-commerce operators and aggregators</li>
                  <li>• Voluntary registration for tax benefits</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={applicationData.businessName}
                    onChange={(e) => setApplicationData({...applicationData, businessName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    value={applicationData.pan}
                    onChange={(e) => setApplicationData({...applicationData, pan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABCDE1234F"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                  title='Select business type'
                    value={applicationData.businessType}
                    onChange={(e) => setApplicationData({...applicationData, businessType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="company">Private Limited Company</option>
                    <option value="llp">Limited Liability Partnership</option>
                    <option value="trust">Trust</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Turnover *
                  </label>
                  <select
                    title='Select annual turnover'
                    value={applicationData.turnover}
                    onChange={(e) => setApplicationData({...applicationData, turnover: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select turnover range</option>
                    <option value="below-20">Below ₹20 Lakhs</option>
                    <option value="20-40">₹20 - ₹40 Lakhs</option>
                    <option value="40-75">₹40 - ₹75 Lakhs</option>
                    <option value="75-1cr">₹75 Lakhs - ₹1 Crore</option>
                    <option value="above-1cr">Above ₹1 Crore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    title='Select state'
                    value={applicationData.state}
                    onChange={(e) => setApplicationData({...applicationData, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select state</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="tamil-nadu">Tamil Nadu</option>
                    <option value="gujarat">Gujarat</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    value={applicationData.address}
                    onChange={(e) => setApplicationData({...applicationData, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete business address"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Continue to Document Upload
                </button>
              </div>
            </div>
          )}

          {/* Application Status Tab */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-green-900">Application Submitted</h3>
                    <p className="text-sm text-green-700">Application ID: GST2024001234</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {registrationSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.documents && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Required documents:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.documents.map((doc, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.status === 'completed' && 'Completed'}
                      {step.status === 'current' && 'In Progress'}
                      {step.status === 'pending' && 'Pending'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Next Steps</h3>
                <p className="text-sm text-yellow-700">
                  Please upload the pending documents to proceed with your GST registration. 
                  The verification process typically takes 3-7 working days.
                </p>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                  Download Checklist
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status === 'uploaded' && 'Uploaded'}
                        {doc.status === 'pending' && 'Pending'}
                        {doc.status === 'not-required' && 'Not Required'}
                      </span>
                    </div>

                    {doc.status === 'pending' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                        <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                          Choose File
                        </button>
                      </div>
                    )}

                    {doc.status === 'uploaded' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-700">Document uploaded successfully</span>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Document Guidelines</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• All documents should be clear and legible</li>
                  <li>• File size should not exceed 5MB per document</li>
                  <li>• Accepted formats: PDF, JPG, PNG</li>
                  <li>• Ensure all information is visible and not cropped</li>
                  <li>• Documents should be recent (within 3 months for bank statements)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GSTRegistration;