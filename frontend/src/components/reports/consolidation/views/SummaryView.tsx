import React from 'react';
import type { FinancialData, Employee } from '../types/index';
import { TrendingUp, DollarSign, Package, Users as UsersIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Totals {
  totalSales: number;
  totalPurchases: number;
  totalGrossProfit: number;
  totalNetProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  totalCash: number;
  totalStock: number;
  companiesCount: number;
  activeUsers: number;
}

interface Props {
  theme: string;
  data: FinancialData[];
  employees: Employee[];
  totals: Totals;
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  getCompanyUsers: (companyId: string) => Employee[];
  companiesCount: number;
}

const SummaryView: React.FC<Props> = ({ theme, data, employees, totals, expandedRows, onToggleRow, getCompanyUsers }) => {
  const salesChartData = data.map(item => ({ company: item.companyName.split(' ')[0], sales: item.sales / 1000000, profit: item.netProfit / 1000000 }));
  const profitTrendData = [ { month: 'Apr', profit: 180 }, { month: 'May', profit: 220 }, { month: 'Jun', profit: 280 }, { month: 'Jul', profit: 350 } ];

  // Theme tokens
  const card = theme==='dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg border border-gray-200';
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const subText = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const faintText = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const tableHeadBg = theme==='dark' ? 'bg-gray-700' : 'bg-gray-50';
  const tableHeadTxt = theme==='dark' ? 'text-gray-200' : 'text-gray-800';
  const rowBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const rowHover = theme==='dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const expandedBg = theme==='dark' ? 'bg-gray-700' : 'bg-gray-50';
  const totalRow = theme==='dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100';

  return (
    <>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className={`p-6 rounded-xl ${card}`}>
          <div className="flex items-center justify-between">
            <div>
      <p className={`text-sm font-medium ${subText}`}>Total Sales</p>
      <p className={`text-2xl font-bold ${heading}`}>{formatCurrency(totals.totalSales)}</p>
      <p className="text-xs text-green-600 mt-1">{totals.companiesCount} companies</p>
            </div>
            <div className={`p-3 rounded-full ${theme==='dark'?'bg-green-900/60':'bg-green-100'}`}>
              <TrendingUp className={`${theme==='dark'?'text-green-400':'text-green-600'}`} size={24} />
            </div>
          </div>
        </div>
    <div className={`p-6 rounded-xl ${card}`}>
          <div className="flex items-center justify-between">
            <div>
      <p className={`text-sm font-medium ${subText}`}>Net Profit</p>
      <p className={`text-2xl font-bold ${heading}`}>{formatCurrency(totals.totalNetProfit)}</p>
              <p className="text-xs text-blue-600 mt-1">{formatPercentage((totals.totalNetProfit / totals.totalSales) * 100)} margin</p>
            </div>
            <div className={`p-3 rounded-full ${theme==='dark'?'bg-blue-900/60':'bg-blue-100'}`}>
              <DollarSign className={`${theme==='dark'?'text-blue-400':'text-blue-600'}`} size={24} />
            </div>
          </div>
        </div>
    <div className={`p-6 rounded-xl ${card}`}>
          <div className="flex items-center justify-between">
            <div>
      <p className={`text-sm font-medium ${subText}`}>Total Assets</p>
      <p className={`text-2xl font-bold ${heading}`}>{formatCurrency(totals.totalAssets)}</p>
              <p className="text-xs text-purple-600 mt-1">Active Portfolio</p>
            </div>
            <div className={`p-3 rounded-full ${theme==='dark'?'bg-purple-900/60':'bg-purple-100'}`}>
              <Package className={`${theme==='dark'?'text-purple-400':'text-purple-600'}`} size={24} />
            </div>
          </div>
        </div>
    <div className={`p-6 rounded-xl ${card}`}>
          <div className="flex items-center justify-between">
            <div>
      <p className={`text-sm font-medium ${subText}`}>Active Users</p>
      <p className={`text-2xl font-bold ${heading}`}>{totals.activeUsers}</p>
              <p className="text-xs text-orange-600 mt-1">Data Contributors</p>
            </div>
            <div className={`p-3 rounded-full ${theme==='dark'?'bg-orange-900/60':'bg-orange-100'}`}>
              <UsersIcon className={`${theme==='dark'?'text-orange-400':'text-orange-600'}`} size={24} />
            </div>
          </div>
        </div>
      </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div className={`p-6 rounded-xl ${card}`}>
      <h3 className={`text-lg font-semibold mb-4 ${heading}`}>Sales & Profit by Company</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme==='dark'? '#374151':'#e5e7eb'} />
                <XAxis dataKey="company" tick={{ fill: theme==='dark'? '#9ca3af':'#6b7280' }} />
                <YAxis tick={{ fill: theme==='dark'? '#9ca3af':'#6b7280' }} />
                <Tooltip formatter={(value: number) => formatCurrency(value * 1000000)} contentStyle={{ backgroundColor: theme==='dark'?'#1f2937':'#ffffff', border: `1px solid ${theme==='dark'?'#374151':'#e5e7eb'}`, borderRadius: '8px', color: theme==='dark'?'#f9fafb':'#111827' }} />
                <Legend wrapperStyle={{ color: theme==='dark'?'#f9fafb':'#111827' }} />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales (Cr)" />
                <Bar dataKey="profit" fill="#10b981" name="Profit (Cr)" />
              </BarChart>
            </ResponsiveContainer>
        </div>
    <div className={`p-6 rounded-xl ${card}`}>
      <h3 className={`text-lg font-semibold mb-4 ${heading}`}>Monthly Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme==='dark'? '#374151':'#e5e7eb'} />
              <XAxis dataKey="month" tick={{ fill: theme==='dark'? '#9ca3af':'#6b7280' }} />
              <YAxis tick={{ fill: theme==='dark'? '#9ca3af':'#6b7280' }} />
              <Tooltip formatter={(value: number) => formatCurrency(value * 10000)} contentStyle={{ backgroundColor: theme==='dark'?'#1f2937':'#ffffff', border: `1px solid ${theme==='dark'?'#374151':'#e5e7eb'}`, borderRadius: '8px', color: theme==='dark'?'#f9fafb':'#111827' }} />
              <Legend wrapperStyle={{ color: theme==='dark'?'#f9fafb':'#111827' }} />
              <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} name="Profit (L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${tableHeadBg} sticky top-0`}>
              <tr>
                <th className={`text-left p-4 font-semibold ${tableHeadTxt}`}>Company</th>
                <th className={`text-right p-4 font-semibold ${tableHeadTxt}`}>Sales</th>
                <th className={`text-right p-4 font-semibold ${tableHeadTxt}`}>Net Profit</th>
                <th className={`text-right p-4 font-semibold ${tableHeadTxt}`}>Assets</th>
                <th className={`text-right p-4 font-semibold ${tableHeadTxt}`}>Cash & Bank</th>
                <th className={`text-center p-4 font-semibold ${tableHeadTxt}`}>Entered By</th>
                <th className={`text-center p-4 font-semibold ${tableHeadTxt}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(company => (
                <React.Fragment key={company.companyId}>
                  <tr className={`border-b transition-colors ${rowBorder} ${rowHover}`}>
                    <td className="p-4">
                      <div>
                        <div className={`font-medium ${heading}`}>{company.companyName}</div>
                        <div className={`text-sm ${faintText}`}>Capital: {formatCurrency(company.capitalAccount)}</div>
                        <div className={`text-xs ${faintText}`}>Users: {getCompanyUsers(company.companyId).length}</div>
                      </div>
                    </td>
                    <td className={`p-4 text-right font-medium ${heading}`}>{formatCurrency(company.sales)}</td>
                    <td className="p-4 text-right font-medium"><span className={company.netProfit>0?'text-green-600':'text-red-600'}>{formatCurrency(company.netProfit)}</span></td>
                    <td className={`p-4 text-right font-medium ${heading}`}>{formatCurrency(company.currentAssets + company.fixedAssets)}</td>
                    <td className="p-4 text-right font-medium text-blue-600">{formatCurrency(company.cashInHand + company.bankBalance)}</td>
                    <td className="p-4 text-center text-sm">
                      <div className="font-medium">{employees.find(e=>e.id===company.enteredBy)?.name.split('(')[0] || 'Unknown'}</div>
                      <div className={`text-xs ${faintText}`}>Modified: {employees.find(e=>e.id===company.lastModifiedBy)?.name.split('(')[0] || 'Unknown'}</div>
                      <div className={`text-xs ${faintText}`}>{company.lastModified}</div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={()=>onToggleRow(company.companyId)} className={`p-2 rounded-lg transition-colors ${theme==='dark'?'hover:bg-gray-600':'hover:bg-gray-200'}`}>{expandedRows.has(company.companyId)? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</button>
                    </td>
                  </tr>
                  {expandedRows.has(company.companyId) && (
                    <tr className={`${expandedBg}`}>
                      <td colSpan={7} className="p-6">
                        {/* Simplified expanded content placeholder; can be further modularized */}
                        <div className={`text-xs ${faintText}`}>Expanded metrics will appear here (to migrate if needed)</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr className={`border-t-2 font-bold ${totalRow}`}>
                <td className={`p-4 ${heading}`}>TOTAL ({totals.companiesCount} Companies)</td>
                <td className={`p-4 text-right ${heading}`}>{formatCurrency(totals.totalSales)}</td>
                <td className="p-4 text-right text-green-600">{formatCurrency(totals.totalNetProfit)}</td>
                <td className={`p-4 text-right ${heading}`}>{formatCurrency(totals.totalAssets)}</td>
                <td className="p-4 text-right text-blue-600">{formatCurrency(totals.totalCash)}</td>
                <td className={`p-4 text-center text-sm ${faintText}`}>{totals.activeUsers} Active Users</td>
                <td className="p-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SummaryView;
