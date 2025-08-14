import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SummaryView from './views/SummaryView';
import UserAccessView, { type UserAccessRecord } from './views/UserAccessView';
import DetailedView from './views/DetailedView';
import ComparisonView from './views/ComparisonView';
import ConsolidateReportView from './views/ConsolidateReportView';
import FilterPanel from './FilterPanel';
import { ConsolidationHeader } from './sections/Header';
import type { FinancialData, FilterState, ViewType } from './types/index';
import { companies as baseCompanies, employees as baseEmployees, financialData as baseFinancial } from './data';
import { ConsolidationConfigIntegration } from '../../../utils/consolidation-config-integration';
import { exportConsolidationToExcel } from './utils/exportUtil';

const ConsolidationRoot: React.FC = () => {
  const { theme } = useAppContext();
  const [selectedView, setSelectedView] = useState<ViewType>('summary');
  const [showFilterPanel] = useState(true); // header toggle removed for now
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    employees: [],
    dateRange: 'this-month',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    financialYear: '2025-26',
    reportType: 'consolidated',
    consolidationType: 'all'
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [consolidationOpen, setConsolidationOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<Set<string>>(new Set());
  const [expandedEmployee, setExpandedEmployee] = useState<Set<string>>(new Set());
  const [companyStatementTabs, setCompanyStatementTabs] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);

  // Role access
  const currentUserId = 'EMP001';
  const userRole = ConsolidationConfigIntegration.getUserRole(currentUserId);
  const userAccessibleCompanies = ConsolidationConfigIntegration.getAccessibleCompanies(currentUserId, userRole);
  // Map integration report to Header expected shape
  interface IntegrationReportRaw { accessScope?: string; reportScope?: string; subordinateUsers?: string[]; permissions?: string[]; }
  const integrationReport = ConsolidationConfigIntegration.getHierarchicalReport(currentUserId) as IntegrationReportRaw;
  const hierarchicalReport = {
    accessScope: integrationReport?.accessScope || 'all',
    reportScope: integrationReport?.reportScope || 'complete',
    subordinateUsers: (integrationReport?.subordinateUsers || []).map((id: string) => ({ id, role: 'Employee' })),
    permissions: integrationReport?.permissions || []
  };

  const accessibleCompanies = useMemo(() => baseCompanies.filter(c => userAccessibleCompanies.includes(c.id)), [userAccessibleCompanies]);
  const accessibleEmployees = useMemo(() => baseEmployees.filter(e => e.accessibleCompanies.some((id: string) => userAccessibleCompanies.includes(id))), [userAccessibleCompanies]);

  const filteredFinancialData: FinancialData[] = useMemo(() => {
    let data = baseFinancial.filter(f => userAccessibleCompanies.includes(f.companyId));
    if (filters.companies.length) data = data.filter(f => filters.companies.includes(f.companyId));
    if (filters.employees.length) data = data.filter(f => (f.enteredBy && filters.employees.includes(f.enteredBy)) || (f.lastModifiedBy && filters.employees.includes(f.lastModifiedBy)));
    return data;
  }, [filters.companies, filters.employees, userAccessibleCompanies]);

  const consolidatedTotals = useMemo(() => {
    const d = filteredFinancialData;
    return {
      totalSales: d.reduce((s,i)=> s+i.sales,0),
      totalPurchases: d.reduce((s,i)=> s+i.purchases,0),
      totalGrossProfit: d.reduce((s,i)=> s+i.grossProfit,0),
      totalNetProfit: d.reduce((s,i)=> s+i.netProfit,0),
      totalAssets: d.reduce((s,i)=> s+i.currentAssets + i.fixedAssets,0),
      totalLiabilities: d.reduce((s,i)=> s+i.currentLiabilities,0),
      totalCash: d.reduce((s,i)=> s+i.cashInHand + i.bankBalance,0),
      totalStock: d.reduce((s,i)=> s+i.stockInHand,0),
      companiesCount: d.length,
      activeUsers: new Set([...d.map(i=>i.enteredBy), ...d.map(i=>i.lastModifiedBy)].filter(Boolean)).size
    };
  }, [filteredFinancialData]);

  const salesChartData = useMemo(() => filteredFinancialData.map(item => ({ company: item.companyName.split(' ')[0], sales: item.sales / 1000000, profit: item.netProfit / 1000000 })), [filteredFinancialData]);

  const userAccessData: UserAccessRecord[] = useMemo(() => accessibleEmployees.map(emp => ({
    ...emp,
    accessibleCompaniesData: accessibleCompanies.filter(comp => emp.accessibleCompanies.includes(comp.id)),
    totalSalesAccess: baseFinancial.filter(f => emp.accessibleCompanies.includes(f.companyId)).reduce((s,i)=> s+i.sales,0),
    totalProfitAccess: baseFinancial.filter(f => emp.accessibleCompanies.includes(f.companyId)).reduce((s,i)=> s+i.netProfit,0)
  })), [accessibleEmployees, accessibleCompanies]);

  const toggleRow = (id: string) => setExpandedRows(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });
  const onFilterChange = (key: keyof FilterState, value: string | string[]) => setFilters(p => ({ ...p, [key]: value }));
  const onToggleCompany = (id: string) => setFilters(p => ({ ...p, companies: p.companies.includes(id) ? p.companies.filter(c => c!==id) : [...p.companies, id] }));
  const onToggleEmployee = (id: string) => setFilters(p => ({ ...p, employees: p.employees.includes(id) ? p.employees.filter(c => c!==id) : [...p.employees, id] }));
  const onSelectAllCompanies = () => setFilters(p => ({ ...p, companies: p.companies.length === accessibleCompanies.length ? [] : accessibleCompanies.map(c=>c.id) }));
  const onSelectAllEmployees = () => setFilters(p => ({ ...p, employees: p.employees.length === accessibleEmployees.length ? [] : accessibleEmployees.map(e=>e.id) }));
  const onExpandCompany = (id: string) => setExpandedCompany(p => { const n=new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });
  const onExpandEmployee = (id: string) => setExpandedEmployee(p => { const n=new Set(p); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });

  const getCompanyUsers = (companyId: string) => accessibleEmployees.filter(emp => emp.accessibleCompanies.includes(companyId));

  const canExport = userRole === 'Super Admin' || hierarchicalReport.permissions.includes('export_all_reports');
  const handleExport = () => {
    setLoading(true);
    try {
      exportConsolidationToExcel(filteredFinancialData, accessibleEmployees);
    } finally {
      setTimeout(()=> setLoading(false), 600);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="pt-[56px] px-4">
      {/* Ledger-style header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/app/reports')}
          aria-label="Back"
          className={`mr-4 p-2 rounded-full transition-colors ${theme==='dark' ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-200 text-gray-700'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
          <span>Consolidated Reports</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${theme==='dark'?'bg-blue-900 text-blue-200':'bg-blue-100 text-blue-700'}`}>Beta</span>
        </h1>
      </div>
      {/* View Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['summary','user-access','detailed','comparison','consolidate'] as ViewType[]).map(v => {
          const active = selectedView===v;
          const base = 'px-3 py-1.5 rounded text-sm font-medium border transition-colors';
          const activeCls = 'bg-blue-600 border-blue-600 text-white shadow-sm';
          const inactiveCls = theme==='dark'
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
          return (
            <button key={v} onClick={()=>setSelectedView(v)} className={`${base} ${active?activeCls:inactiveCls}`}>{v}</button>
          );
        })}
      </div>
      {/* Actions */}
      <div className="flex flex-wrap justify-end mb-3 gap-2">
        {canExport && (
          <button onClick={handleExport} disabled={loading} className={`inline-flex items-center px-3 py-1.5 text-sm rounded border font-medium transition-colors ${loading?'opacity-70 cursor-not-allowed':''} ${theme==='dark'?'border-blue-500 text-blue-400 hover:bg-blue-600/20':'border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
            <Download size={16} className="mr-1" /> {loading? 'Exporting...' : 'Export Excel'}
          </button>
        )}
        <button onClick={()=> setFilters(f=> ({ ...f }))} disabled={loading} className={`inline-flex items-center px-3 py-1.5 text-sm rounded border font-medium transition-colors ${loading?'opacity-70 cursor-not-allowed':''} ${theme==='dark'?'border-gray-600 text-gray-300 hover:bg-gray-700':'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
          <RefreshCw size={14} className="mr-1" /> Refresh
        </button>
      </div>
  <ConsolidationHeader theme={theme} userRole={userRole} hierarchicalReport={hierarchicalReport} userAccessibleCompanies={userAccessibleCompanies} />
      <FilterPanel theme={theme} filters={filters} show={showFilterPanel} consolidationOpen={consolidationOpen} toggleConsolidationOpen={()=>setConsolidationOpen(o=>!o)} companyOpen={companyOpen} toggleCompanyOpen={()=>setCompanyOpen(o=>!o)} employeeOpen={employeeOpen} toggleEmployeeOpen={()=>setEmployeeOpen(o=>!o)} companies={accessibleCompanies} employees={accessibleEmployees} selectedCompanies={new Set(filters.companies)} onToggleCompany={onToggleCompany} onSelectAllCompanies={onSelectAllCompanies} selectedEmployees={new Set(filters.employees)} onToggleEmployee={onToggleEmployee} onSelectAllEmployees={onSelectAllEmployees} expandedCompany={expandedCompany} onExpandCompany={onExpandCompany} expandedEmployee={expandedEmployee} onExpandEmployee={onExpandEmployee} onFilterChange={onFilterChange} />
  {selectedView === 'summary' && <SummaryView theme={theme} data={filteredFinancialData} employees={accessibleEmployees} totals={consolidatedTotals} expandedRows={expandedRows} onToggleRow={toggleRow} getCompanyUsers={getCompanyUsers} companiesCount={consolidatedTotals.companiesCount} />}
      {selectedView === 'user-access' && <UserAccessView theme={theme} data={userAccessData} />}
      {selectedView === 'detailed' && <DetailedView theme={theme} data={filteredFinancialData} companies={accessibleCompanies} employees={accessibleEmployees} getCompanyUsers={getCompanyUsers} />}
      {selectedView === 'comparison' && <ComparisonView theme={theme} data={filteredFinancialData} salesChartData={salesChartData} consolidatedTotals={consolidatedTotals} />}
      {selectedView === 'consolidate' && (
        <ConsolidateReportView
          theme={theme}
          companies={accessibleCompanies}
          employees={accessibleEmployees}
          data={filteredFinancialData}
          totals={consolidatedTotals}
          selectedCompanyIds={filters.companies.length ? filters.companies : accessibleCompanies.map(c=>c.id)}
          companyStatementTabs={companyStatementTabs}
          onSetCompanyTab={(companyId, tab) => setCompanyStatementTabs(prev => ({ ...prev, [companyId]: tab }))}
          userRole={userRole}
          userAccessibleCompanies={userAccessibleCompanies}
        />
      )}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`px-6 py-4 rounded-lg ${theme==='dark'?'bg-gray-800 text-gray-200':'bg-white text-gray-800 shadow-lg'}`}>
            <div className="flex items-center gap-3"><RefreshCw className="animate-spin" size={20} /> Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolidationRoot;
