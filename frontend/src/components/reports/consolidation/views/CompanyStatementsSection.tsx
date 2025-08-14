import React from 'react';
import type { Company, FinancialData } from '../types/index';

interface Props {
  theme: string;
  selectedCompanyIds: string[];
  companies: Company[];
  financialData: FinancialData[];
  companyStatementTabs: Record<string,string>;
  onSetCompanyTab: (companyId: string, tab: string) => void;
}

const CompanyStatementsSection: React.FC<Props> = ({ theme, selectedCompanyIds, companies, financialData, companyStatementTabs, onSetCompanyTab }) => {
  if (selectedCompanyIds.length === 0) return null;

  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const subHeadingNote = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const card = theme==='dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const divider = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const miniHeading = theme==='dark' ? 'text-gray-200' : 'text-gray-800';
  const miniMuted = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const tabActive = theme==='dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white';
  const tabInactive = theme==='dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  const tableHeadBg = theme==='dark' ? 'bg-gray-700' : 'bg-gray-100';
  const rowBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="mb-8">
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}>Company Specific Statements (Selected)</h4>
      <div className="space-y-6">
        {selectedCompanyIds.map(cid => {
          const comp = companies.find(c => c.id === cid);
          const fin = financialData.find(f => f.companyId === cid);
          if (!comp || !fin) return null;
          const activeTab = companyStatementTabs[cid] || 'bs';
          return (
            <div key={cid} className={`rounded-xl border shadow-sm transition-colors ${card}`}>
              <div className={`px-4 py-3 flex items-center justify-between border-b ${divider}`}>
                <div>
                  <h5 className={`font-semibold ${heading}`}>{comp.name} ({comp.code})</h5>
                  <p className={`text-xs ${subHeadingNote}`}>GSTIN: {comp.gstin} | FY: {comp.financialYear}</p>
                </div>
                <div className="flex space-x-2 text-xs font-medium">
                  {['bs','pl','day','tb'].map(tab => (
                    <button
                      key={tab}
                      onClick={()=>onSetCompanyTab(cid, tab)}
                      className={`px-3 py-1 rounded-full transition-colors ${activeTab===tab ? tabActive : tabInactive}`}
                    >
                      {tab==='bs' && 'Balance Sheet'}
                      {tab==='pl' && 'P&L'}
                      {tab==='day' && 'Day Book'}
                      {tab==='tb' && 'Trial Balance'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 text-sm">
                {activeTab==='bs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className={`font-semibold mb-2 ${miniHeading}`}>Liabilities</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>Capital</span><span className="font-medium">{fin.capitalAccount.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Loans</span><span className="font-medium">{fin.loans.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Sundry Creditors</span><span className="font-medium">{fin.sundryCreditors.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Provisions</span><span className="font-medium">{fin.provisions.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between border-t pt-1 font-semibold"><span>Total Liabilities</span><span>{(fin.capitalAccount+fin.loans+fin.sundryCreditors+fin.provisions).toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                    <div>
                      <h6 className={`font-semibold mb-2 ${miniHeading}`}>Assets</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>Cash & Bank</span><span className="font-medium">{(fin.cashInHand+fin.bankBalance).toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Stock in Hand</span><span className="font-medium">{fin.stockInHand.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Sundry Debtors</span><span className="font-medium">{fin.sundryDebtors.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Current Assets (Other)</span><span className="font-medium">{(fin.currentAssets - (fin.cashInHand+fin.bankBalance+fin.stockInHand+fin.sundryDebtors)).toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between border-t pt-1 font-semibold"><span>Total Assets</span><span>{(fin.currentAssets + fin.fixedAssets).toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab==='pl' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className={`font-semibold mb-2 ${miniHeading}`}>Income</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>Sales</span><span className="font-medium">{fin.sales.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Gross Profit</span><span className="font-medium text-green-600">{fin.grossProfit.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Net Profit</span><span className="font-medium text-green-600">{fin.netProfit.toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                    <div>
                      <h6 className={`font-semibold mb-2 ${miniHeading}`}>Expenses</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>Purchases</span><span className="font-medium">{fin.purchases.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Direct Expenses</span><span className="font-medium">{fin.directExpenses.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Indirect Expenses</span><span className="font-medium">{fin.indirectExpenses.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between border-t pt-1 font-semibold"><span>Total Expenses</span><span>{(fin.purchases+fin.directExpenses+fin.indirectExpenses).toLocaleString('en-IN')}</span></div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab==='day' && (
                  <div>
                    <h6 className={`font-semibold mb-2 ${miniHeading}`}>Day Book (Summary)</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className={`p-3 rounded border ${divider} ${theme==='dark'?'bg-gray-700':'bg-gray-50'}`}><div className="font-medium">Total Vouchers</div><div className="text-lg font-bold text-blue-600">{Math.round((fin.sales+fin.purchases)/100000)}</div><div className={`text-[10px] mt-1 ${miniMuted}`}>(Simulated count)</div></div>
                      <div className={`p-3 rounded border ${divider} ${theme==='dark'?'bg-gray-700':'bg-gray-50'}`}><div className="font-medium">Cash Movements</div><div className="text-lg font-bold text-green-600">{(fin.cashInHand+fin.bankBalance).toLocaleString('en-IN')}</div><div className={`text-[10px] mt-1 ${miniMuted}`}>Opening + Activity</div></div>
                      <div className={`p-3 rounded border ${divider} ${theme==='dark'?'bg-gray-700':'bg-gray-50'}`}><div className="font-medium">Inventory Events</div><div className="text-lg font-bold text-purple-600">{Math.round(fin.stockInHand / 100000)}</div><div className={`text-[10px] mt-1 ${miniMuted}`}>(Derived units)</div></div>
                    </div>
                    <p className={`text-[11px] mt-3 ${miniMuted}`}>Detailed day book lines would be fetched from ledger/transactions API – placeholder summary shown.</p>
                  </div>
                )}
                {activeTab==='tb' && (
                  <div>
                    <h6 className={`font-semibold mb-2 ${miniHeading}`}>Trial Balance (Condensed)</h6>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className={tableHeadBg}>
                          <tr><th className="text-left p-2">Ledger</th><th className="text-right p-2">Debit</th><th className="text-right p-2">Credit</th></tr>
                        </thead>
                        <tbody>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Capital Account</td><td className="p-2 text-right">-</td><td className="p-2 text-right">{fin.capitalAccount.toLocaleString('en-IN')}</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Sales</td><td className="p-2 text-right">-</td><td className="p-2 text-right">{fin.sales.toLocaleString('en-IN')}</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Purchases</td><td className="p-2 text-right">{fin.purchases.toLocaleString('en-IN')}</td><td className="p-2 text-right">-</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Loans</td><td className="p-2 text-right">-</td><td className="p-2 text-right">{fin.loans.toLocaleString('en-IN')}</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Sundry Debtors</td><td className="p-2 text-right">{fin.sundryDebtors.toLocaleString('en-IN')}</td><td className="p-2 text-right">-</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Sundry Creditors</td><td className="p-2 text-right">-</td><td className="p-2 text-right">{fin.sundryCreditors.toLocaleString('en-IN')}</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Cash & Bank</td><td className="p-2 text-right">{(fin.cashInHand+fin.bankBalance).toLocaleString('en-IN')}</td><td className="p-2 text-right">-</td></tr>
                          <tr className={`border-b ${rowBorder}`}><td className="p-2">Stock</td><td className="p-2 text-right">{fin.stockInHand.toLocaleString('en-IN')}</td><td className="p-2 text-right">-</td></tr>
                          <tr className={`border-b ${rowBorder} font-semibold`}><td className="p-2">Net Profit</td><td className="p-2 text-right">-</td><td className="p-2 text-right">{fin.netProfit.toLocaleString('en-IN')}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className={`text-[11px] mt-3 ${miniMuted}`}>Trial balance is illustrative; real implementation would sum ledger postings.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyStatementsSection;
