import React from 'react';
import type { Company, Employee, FinancialData } from '../types/index';
import { TrendingUp, Building2 } from 'lucide-react';
import CompanyStatementsSection from './CompanyStatementsSection';
import BalanceSheetConsolidationSection from './BalanceSheetConsolidationSection';
import BalanceSheetDetailed from './sections/BalanceSheetDetailed.tsx';
import TradingAccountSection from './sections/TradingAccountSection.tsx';
import ProfitAndLossSection from './sections/ProfitAndLossSection.tsx';
import AnnexuresSection from './sections/AnnexuresSection.tsx';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Totals {
  totalSales: number;
  totalNetProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  totalCash: number;
  totalStock: number;
  totalGrossProfit?: number;
  totalPurchases?: number;
}

interface Props {
  theme: string;
  companies: Company[];
  employees: Employee[];
  data: FinancialData[];
  totals: Totals;
  selectedCompanyIds?: string[];
  companyStatementTabs?: Record<string,string>;
  onSetCompanyTab?: (companyId: string, tab: string) => void;
  userRole?: string;
  userAccessibleCompanies?: string[];
}

const ConsolidateReportView: React.FC<Props> = ({ theme, companies, employees, data, totals, selectedCompanyIds = [], companyStatementTabs = {}, onSetCompanyTab, userRole='Employee', userAccessibleCompanies = [] }) => {
  // Theme tokens
  const pageHeading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const headingNote = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const summaryCard = theme==='dark' ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200 shadow-sm';
  const blockHeading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const sectionLabel = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const muted = theme==='dark' ? 'text-gray-300' : 'text-gray-700';
  const strong = theme==='dark' ? 'text-gray-100' : 'text-gray-900';

  return (
    <div className="p-6">
      <h3 className={`text-xl font-semibold mb-6 flex items-center ${pageHeading}`}>
        <Building2 className="mr-3" size={24} />
        Complete Consolidation Report
        <span className={`ml-4 text-sm font-normal ${headingNote}`}>(All Companies • All Employees)</span>
      </h3>
      <div className={`p-6 rounded-xl mb-6 transition-colors ${summaryCard}`}>
        <h4 className={`text-lg font-semibold mb-4 flex items-center ${blockHeading}`}>
          <TrendingUp className="mr-2" size={20} />
          Executive Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className={`text-sm font-medium mb-2 ${sectionLabel}`}>Business Overview</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className={muted}>Total Companies:</span><span className={`font-semibold ${strong}`}>{companies.length}</span></div>
              <div className="flex justify-between"><span className={muted}>Active Employees:</span><span className={`font-semibold ${strong}`}>{employees.filter(emp => emp.status === 'active').length}</span></div>
              <div className="flex justify-between"><span className={muted}>Admin Users:</span><span className={`font-semibold ${strong}`}>{employees.filter(emp => emp.role.includes('Admin')).length}</span></div>
              <div className="flex justify-between"><span className={muted}>Total Sales:</span><span className="font-semibold text-green-600">{formatCurrency(totals.totalSales)}</span></div>
              <div className="flex justify-between"><span className={muted}>Total Profit:</span><span className="font-semibold text-blue-600">{formatCurrency(totals.totalNetProfit)}</span></div>
            </div>
          </div>
          <div>
            <h5 className={`text-sm font-medium mb-2 ${sectionLabel}`}>Financial Health</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className={muted}>Total Assets:</span><span className={`font-semibold ${strong}`}>{formatCurrency(totals.totalAssets)}</span></div>
              <div className="flex justify-between"><span className={muted}>Total Liabilities:</span><span className={`font-semibold ${strong}`}>{formatCurrency(totals.totalLiabilities)}</span></div>
              <div className="flex justify-between"><span className={muted}>Net Worth:</span><span className="font-semibold text-purple-600">{formatCurrency(totals.totalAssets - totals.totalLiabilities)}</span></div>
              <div className="flex justify-between"><span className={muted}>Cash & Bank:</span><span className="font-semibold text-green-600">{formatCurrency(totals.totalCash)}</span></div>
              <div className="flex justify-between"><span className={muted}>Inventory:</span><span className="font-semibold text-orange-600">{formatCurrency(totals.totalStock)}</span></div>
            </div>
          </div>
          <div>
            <h5 className={`text-sm font-medium mb-2 ${sectionLabel}`}>Performance Ratios</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className={muted}>Average Profit Margin:</span><span className="font-semibold text-green-600">{formatPercentage((data.reduce((s,c)=> s + (c.netProfit/c.sales),0)/ data.length) * 100)}</span></div>
              <div className="flex justify-between"><span className={muted}>Avg Current Ratio:</span><span className="font-semibold text-blue-600">{(data.reduce((s,c)=> s + (c.currentAssets / c.currentLiabilities),0)/ data.length).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className={muted}>Avg Asset Turnover:</span><span className="font-semibold text-purple-600">{(data.reduce((s,c)=> s + (c.sales / (c.currentAssets + c.fixedAssets || 1)),0)/ data.length).toFixed(2)}x</span></div>
              <div className="flex justify-between"><span className={muted}>Top Performing Co.:</span><span className={`font-semibold ${strong}`}>{data.reduce((p, c)=> c.netProfit > p.netProfit ? c : p, data[0])?.companyName.split(' ')[0]}</span></div>
              <div className="flex justify-between"><span className={muted}>Highest Margin Co.:</span><span className={`font-semibold ${strong}`}>{data.reduce((p,c)=> (c.netProfit/c.sales) > (p.netProfit/p.sales) ? c : p, data[0])?.companyName.split(' ')[0]}</span></div>
            </div>
          </div>
        </div>
      </div>
      {/* Sub sections */}
      <CompanyStatementsSection theme={theme} selectedCompanyIds={selectedCompanyIds} companies={companies} financialData={data} companyStatementTabs={companyStatementTabs} onSetCompanyTab={onSetCompanyTab || (()=>{})} />
      <BalanceSheetConsolidationSection theme={theme} userRole={userRole} userAccessibleCompanies={userAccessibleCompanies} companies={companies} />
      <BalanceSheetDetailed theme={theme} userRole={userRole} userAccessibleCompanies={userAccessibleCompanies} companies={companies} />
      <TradingAccountSection theme={theme} userRole={userRole} userAccessibleCompanies={userAccessibleCompanies} />
      <ProfitAndLossSection theme={theme} userRole={userRole} userAccessibleCompanies={userAccessibleCompanies} />
      <AnnexuresSection theme={theme} userAccessibleCompanies={userAccessibleCompanies} />
    </div>
  );
};

export default ConsolidateReportView;
