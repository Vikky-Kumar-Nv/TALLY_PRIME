import React from 'react';
import type { FinancialData, Company, Employee } from '../types/index';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Props {
  theme: string;
  data: FinancialData[];
  companies: Company[];
  employees: Employee[];
  getCompanyUsers: (companyId: string) => Employee[];
}

const DetailedView: React.FC<Props> = ({ theme, data, companies, employees, getCompanyUsers }) => {
  // Theme tokens
  const pageHeading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const companyCard = theme==='dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
  const subCard = theme==='dark' ? 'bg-gray-800' : 'bg-white';
  const borderedSubCard = theme==='dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white';
  const companyName = theme==='dark' ? 'text-white' : 'text-gray-900';
  const muted = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const sectionLabel = theme==='dark' ? 'text-gray-300' : 'text-gray-600';
  const sectionTitle = theme==='dark' ? 'text-gray-200' : 'text-gray-700';
  const valuePrimary = theme==='dark' ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className="p-6">
      <h3 className={`text-xl font-semibold mb-6 ${pageHeading}`}>Detailed Financial Analysis</h3>
      <div className="space-y-6">
        {data.map(company => {
          const companyMeta = companies.find(c => c.id === company.companyId);
          return (
            <div key={company.companyId} className={`p-6 rounded-xl border ${companyCard}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className={`text-lg font-semibold ${companyName}`}>{company.companyName}</h4>
                  <p className={`text-sm ${muted}`}>
                    GSTIN: {companyMeta?.gstin} | Type: {companyMeta?.type?.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${muted}`}>Capital Account</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(company.capitalAccount)}</p>
                </div>
              </div>

              {/* Metric Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Revenue */}
                <div className={`p-4 rounded-lg ${subCard} shadow-sm transition-colors`}>
                  <h5 className={`text-sm font-semibold mb-3 ${sectionLabel}`}>Revenue Analysis</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className={sectionLabel}>Sales</span><span className="font-medium text-green-600">{formatCurrency(company.sales)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Gross Profit</span><span className="font-medium text-blue-600">{formatCurrency(company.grossProfit)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Net Profit</span><span className={`font-medium ${company.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(company.netProfit)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className={`font-semibold ${sectionLabel}`}>Profit Margin</span><span className="font-bold text-purple-600">{formatPercentage((company.netProfit / company.sales) * 100)}</span></div>
                  </div>
                </div>
                {/* Expenses */}
                <div className={`p-4 rounded-lg ${subCard} shadow-sm transition-colors`}>
                  <h5 className={`text-sm font-semibold mb-3 ${sectionLabel}`}>Expense Breakdown</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className={sectionLabel}>Purchases</span><span className="font-medium text-orange-600">{formatCurrency(company.purchases)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Direct Expenses</span><span className="font-medium text-red-500">{formatCurrency(company.directExpenses)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Indirect Expenses</span><span className="font-medium text-red-500">{formatCurrency(company.indirectExpenses)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className={`font-semibold ${sectionLabel}`}>Total Expenses</span><span className="font-bold text-red-600">{formatCurrency(company.purchases + company.directExpenses + company.indirectExpenses)}</span></div>
                  </div>
                </div>
                {/* Assets */}
                <div className={`p-4 rounded-lg ${subCard} shadow-sm transition-colors`}>
                  <h5 className={`text-sm font-semibold mb-3 ${sectionLabel}`}>Assets Portfolio</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className={sectionLabel}>Current Assets</span><span className="font-medium text-green-600">{formatCurrency(company.currentAssets)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Fixed Assets</span><span className="font-medium text-blue-600">{formatCurrency(company.fixedAssets)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Investments</span><span className="font-medium text-purple-600">{formatCurrency(company.investments)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className={`font-semibold ${sectionLabel}`}>Total Assets</span><span className="font-bold text-green-600">{formatCurrency(company.currentAssets + company.fixedAssets + company.investments)}</span></div>
                  </div>
                </div>
                {/* Liquidity */}
                <div className={`p-4 rounded-lg ${subCard} shadow-sm transition-colors`}>
                  <h5 className={`text-sm font-semibold mb-3 ${sectionLabel}`}>Liquidity & Working Capital</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className={sectionLabel}>Cash in Hand</span><span className="font-medium text-green-600">{formatCurrency(company.cashInHand)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Bank Balance</span><span className="font-medium text-blue-600">{formatCurrency(company.bankBalance)}</span></div>
                    <div className="flex justify-between"><span className={sectionLabel}>Stock in Hand</span><span className="font-medium text-purple-600">{formatCurrency(company.stockInHand)}</span></div>
                    <div className="flex justify-between border-t pt-2"><span className={`font-semibold ${sectionLabel}`}>Working Capital</span><span className={`font-bold ${(company.currentAssets - company.currentLiabilities) > 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(company.currentAssets - company.currentLiabilities)}</span></div>
                  </div>
                </div>
              </div>

              {/* Ratios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className={`p-3 rounded-lg border ${borderedSubCard} transition-colors`}>
                  <p className={`text-xs mb-1 ${muted}`}>Current Ratio</p>
                  <p className="text-lg font-bold text-blue-600">{(company.currentAssets / company.currentLiabilities).toFixed(2)}</p>
                </div>
                <div className={`p-3 rounded-lg border ${borderedSubCard} transition-colors`}>
                  <p className={`text-xs mb-1 ${muted}`}>ROA (Return on Assets)</p>
                  <p className="text-lg font-bold text-green-600">{formatPercentage((company.netProfit / (company.currentAssets + company.fixedAssets)) * 100)}</p>
                </div>
                <div className={`p-3 rounded-lg border ${borderedSubCard} transition-colors`}>
                  <p className={`text-xs mb-1 ${muted}`}>Debt-to-Assets Ratio</p>
                  <p className="text-lg font-bold text-orange-600">{formatPercentage((company.loans / (company.currentAssets + company.fixedAssets)) * 100)}</p>
                </div>
              </div>

              {/* Data Entry Info */}
              <div className={`p-4 rounded-lg border ${borderedSubCard} transition-colors`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${sectionTitle}`}>Data Entry Information</p>
                    <p className={`text-xs ${muted}`}>Entered by: <span className={`font-medium ${valuePrimary}`}>{employees.find(emp => emp.id === company.enteredBy)?.name || 'Unknown'}</span></p>
                    <p className={`text-xs ${muted}`}>Last Modified: <span className={`font-medium ${valuePrimary}`}>{employees.find(emp => emp.id === company.lastModifiedBy)?.name || 'Unknown'}</span> on {company.lastModified}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${sectionTitle}`}>Accessible Users</p>
                    <p className="text-lg font-bold text-blue-600">{getCompanyUsers(company.companyId).length}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedView;
