import React from 'react';
import type { FinancialData } from '../types/index';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface Props {
  theme: string;
  data: FinancialData[];
  salesChartData: { company: string; sales: number; profit: number }[];
  consolidatedTotals: { totalSales: number };
}

const ComparisonView: React.FC<Props> = ({ theme, data, salesChartData, consolidatedTotals }) => {
  // Theme tokens
  const pageHeading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const sectionHeading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const tableHeadBg = theme==='dark' ? 'bg-gray-700' : 'bg-gray-50';
  const tableBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const bestCol = theme==='dark' ? 'bg-blue-900' : 'bg-blue-100';
  const winnerCell = theme==='dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
  const cardBg = theme==='dark' ? 'bg-gray-800' : 'bg-white';
  const barTrack = theme==='dark' ? 'bg-gray-700' : 'bg-gray-200';
  const labelText = theme==='dark' ? 'text-gray-300' : 'text-gray-700';
  const strongText = theme==='dark' ? 'text-white' : 'text-gray-900';

  // Helper to render metric row
  const metricRow = (label: string, values: number[], formatter: (n:number)=>string, bestLogic?: (arr:number[])=>number) => {
    const numbers = values;
    const best = bestLogic ? bestLogic(numbers) : Math.max(...numbers);
    return (
      <tr className={`border-b ${tableBorder}`}>
        <td className="p-3 font-medium">{label}</td>
        {data.map((company, idx) => {
          const value = numbers[idx];
          const isBest = Math.abs(value - best) < 0.0001; // tolerance
          return (
            <td key={company.companyId} className={`p-3 text-center ${isBest ? winnerCell + ' font-bold' : ''}`}>{formatter(value)}</td>
          );
        })}
        <td className={`p-3 text-center font-bold ${bestCol}`}>{data[ numbers.indexOf(best) ].companyName.split(' ')[0]}</td>
      </tr>
    );
  };

  return (
    <div className="p-6">
      <h3 className={`text-xl font-semibold mb-6 ${pageHeading}`}>Multi-Company Comparison Analysis</h3>
      <div className="mb-8">
        <h4 className={`text-lg font-semibold mb-4 ${sectionHeading}`}>Financial Performance Comparison</h4>
        <div className="overflow-x-auto rounded-lg border border-transparent">
          <table className="w-full">
            <thead className={tableHeadBg}>
              <tr>
                <th className="text-left p-3 font-semibold">Metric</th>
                {data.map(company => <th key={company.companyId} className="text-center p-3 font-semibold">{company.companyName.split(' ')[0]}</th>)}
                <th className={`text-center p-3 font-semibold ${bestCol}`}>Best Performer</th>
              </tr>
            </thead>
            <tbody>
              {metricRow('Sales Revenue', data.map(c=>c.sales), v=>formatCurrency(v))}
              {metricRow('Net Profit', data.map(c=>c.netProfit), v=>formatCurrency(v))}
              {metricRow('Profit Margin (%)', data.map(c=>(c.netProfit / c.sales)*100), v=>formatPercentage(v), arr=>Math.max(...arr))}
              {metricRow('Total Assets', data.map(c=>c.currentAssets + c.fixedAssets), v=>formatCurrency(v))}
              {metricRow('Current Ratio', data.map(c=>c.currentAssets / c.currentLiabilities), v=>Number(v).toFixed(2), arr=>Math.max(...arr))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales vs Profit Chart */}
        <div className={`p-6 rounded-xl shadow-lg transition-colors ${cardBg}`}>
          <h4 className={`text-lg font-semibold mb-4 ${sectionHeading}`}>Sales vs Profit Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme==='dark' ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="company" stroke={theme==='dark' ? '#D1D5DB' : '#374151'} tick={{ fill: theme==='dark' ? '#D1D5DB':'#374151', fontSize: 12 }} />
              <YAxis stroke={theme==='dark' ? '#D1D5DB' : '#374151'} tick={{ fill: theme==='dark' ? '#D1D5DB':'#374151', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value * 1000000)} contentStyle={{ background: theme==='dark' ? '#1F2937':'#FFFFFF', border:'1px solid '+ (theme==='dark' ? '#374151':'#E5E7EB'), color: theme==='dark' ? '#F9FAFB':'#111827' }} />
              <Legend wrapperStyle={{ color: theme==='dark' ? '#E5E7EB':'#111827' }} />
              <Bar dataKey="sales" fill="#3b82f6" name="Sales (Cr)" />
              <Bar dataKey="profit" fill="#10b981" name="Profit (Cr)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Share */}
        <div className={`p-6 rounded-xl shadow-lg transition-colors ${cardBg}`}>
          <h4 className={`text-lg font-semibold mb-4 ${sectionHeading}`}>Company Market Share (Sales)</h4>
          <div className="space-y-3">
            {data.map((company, index) => {
              const totalSales = consolidatedTotals.totalSales || 1; // avoid div/0
              const percentage = (company.sales / totalSales) * 100;
              const colors = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-red-500','bg-pink-500'];
              let widthClass = 'w-0';
              if (percentage >= 100) widthClass = 'w-full';
              else if (percentage >= 90) widthClass = 'w-11/12';
              else if (percentage >= 83) widthClass = 'w-10/12';
              else if (percentage >= 75) widthClass = 'w-9/12';
              else if (percentage >= 66) widthClass = 'w-8/12';
              else if (percentage >= 58) widthClass = 'w-7/12';
              else if (percentage >= 50) widthClass = 'w-6/12';
              else if (percentage >= 41) widthClass = 'w-5/12';
              else if (percentage >= 33) widthClass = 'w-4/12';
              else if (percentage >= 25) widthClass = 'w-3/12';
              else if (percentage >= 16) widthClass = 'w-2/12';
              else if (percentage >= 8) widthClass = 'w-1/12';
              return (
                <div key={company.companyId}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${labelText}`}>{company.companyName.split(' ')[0]}</span>
                    <span className={`text-sm font-bold ${strongText}`}>{formatPercentage(percentage)}</span>
                  </div>
                  <div className={`w-full ${barTrack} rounded-full h-3 overflow-hidden`}>
                    <div className={`h-3 ${colors[index % colors.length]} rounded-full transition-all duration-500 ${widthClass}`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rankings sections could be added here with same token approach if required */}
      </div>
    </div>
  );
};

export default ComparisonView;
