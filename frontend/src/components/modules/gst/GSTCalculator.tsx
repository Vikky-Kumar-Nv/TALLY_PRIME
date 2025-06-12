import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowLeft } from 'lucide-react';

interface GSTCalculation {

  amount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  isInclusive: boolean;
}

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<GSTCalculation | null>(null);
  const navigate = useNavigate();

  const gstRates = [0, 5, 12, 18, 28];

  const calculateGST = () => {
    const baseAmount = parseFloat(amount);
    if (isNaN(baseAmount) || baseAmount <= 0) return;

    let result: GSTCalculation;

    if (isInclusive) {
      const totalAmount = baseAmount;
      const taxableAmount = totalAmount / (1 + gstRate / 100);
      const gstAmount = totalAmount - taxableAmount;

      result = {
        amount: taxableAmount,
        gstRate,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: gstAmount,
        totalAmount,
        isInclusive: true
      };
    } else {
      const taxableAmount = baseAmount;
      const gstAmount = (taxableAmount * gstRate) / 100;
      const totalAmount = taxableAmount + gstAmount;

      result = {
        amount: taxableAmount,
        gstRate,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        igst: gstAmount,
        totalAmount,
        isInclusive: false
      };
    }

    setCalculation(result);
  };

  const clearCalculation = () => {
    setAmount('');
    setCalculation(null);
  };

  return (
      <div className="min-h-screen pt-[56px] px-4 ">
         
        <div className="max-w-4xl mx-auto ">
        <div className="flex items-center mb-4">

            <button
                title='Back to Reports'
                type='button'
                  onClick={() => navigate('/gst')}
                  className="mr-4 p-2 rounded-full hover:bg-gray-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">GST Calculator</h1>
            </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            

            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">GST Calculator</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Rate (%)
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          gstRate === rate
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                    placeholder="Custom rate"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calculation Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isInclusive}
                        onChange={() => setIsInclusive(false)}
                        className="mr-2"
                      />
                      <span className="text-sm">GST Exclusive</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isInclusive}
                        onChange={() => setIsInclusive(true)}
                        className="mr-2"
                      />
                      <span className="text-sm">GST Inclusive</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={calculateGST}
                    disabled={!amount}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
                  >
                    Calculate GST
                  </button>
                  <button
                    onClick={clearCalculation}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Result Section */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Result</h3>

                {calculation ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Taxable Amount</div>
                        <div className="text-xl font-bold text-gray-900">
                          ₹{calculation.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm text-gray-600">GST Rate</div>
                        <div className="text-xl font-bold text-blue-600">
                          {calculation.gstRate}%
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">GST Breakdown</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">CGST ({calculation.gstRate / 2}%):</span>
                          <span className="font-medium">₹{calculation.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">SGST ({calculation.gstRate / 2}%):</span>
                          <span className="font-medium">₹{calculation.sgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm">Total GST:</span>
                          <span className="font-bold">₹{calculation.igst.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="text-sm text-green-600">Total Amount</div>
                      <div className="text-2xl font-bold text-green-700">
                        ₹{calculation.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Enter amount and click calculate to see GST breakdown</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Rate Quick Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900">0% GST</div>
                <div className="text-sm text-gray-600 mt-1">Essential items, books, newspapers</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-blue-900">5% GST</div>
                <div className="text-sm text-blue-600 mt-1">Food items, medicines, textiles</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="font-semibold text-yellow-900">12% GST</div>
                <div className="text-sm text-yellow-600 mt-1">Computers, processed food</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold text-green-900">18% GST</div>
                <div className="text-sm text-green-600 mt-1">Most goods and services</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default GSTCalculator;
