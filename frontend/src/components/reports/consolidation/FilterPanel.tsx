import React from 'react';
import { Shield, Building2, ChevronDown, ChevronRight, Calendar, UserCheck } from 'lucide-react';
import type { Company, Employee, FilterState } from './types/index';

interface Props {
  theme: string;
  filters: FilterState;
  show: boolean;
  consolidationOpen: boolean; toggleConsolidationOpen: () => void;
  companyOpen: boolean; toggleCompanyOpen: () => void;
  employeeOpen: boolean; toggleEmployeeOpen: () => void;
  companies: Company[]; employees: Employee[];
  selectedCompanies: Set<string>; onToggleCompany: (id: string) => void; onSelectAllCompanies: () => void;
  selectedEmployees: Set<string>; onToggleEmployee: (id: string) => void; onSelectAllEmployees: () => void;
  expandedCompany: Set<string>; onExpandCompany: (id: string) => void;
  expandedEmployee: Set<string>; onExpandEmployee: (id: string) => void;
  onFilterChange: (key: keyof FilterState, value: string | string[]) => void;
}

export const FilterPanel: React.FC<Props> = ({ theme, filters, show, consolidationOpen, toggleConsolidationOpen, companyOpen, toggleCompanyOpen, employeeOpen, toggleEmployeeOpen, companies, employees, selectedCompanies, onToggleCompany, onSelectAllCompanies, selectedEmployees, onToggleEmployee, onSelectAllEmployees, expandedCompany, onExpandCompany, expandedEmployee, onExpandEmployee, onFilterChange }) => {
  if (!show) return null;

  // Theme tokens
  const panelBg = theme==='dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg border border-gray-200';
  const labelText = theme==='dark' ? 'text-gray-200' : 'text-gray-800';
  const subText = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const control = theme==='dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100';
  const listPanel = theme==='dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200';
  const divider = theme==='dark' ? 'divide-gray-700' : 'divide-gray-100';
  const borderRow = theme==='dark' ? 'border-gray-700' : 'border-gray-100';
  const activeRow = theme==='dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800';
  const hoverRow = theme==='dark' ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700';
  const checkbox = theme==='dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white';
  const statusBadge = (status:string) => status==='active'
    ? (theme==='dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
    : (theme==='dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700');
  const roleBadge = (role:string) => role.includes('Admin')
    ? (theme==='dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
    : (theme==='dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700');

  return (
    <div className={`p-6 rounded-xl mb-6 ${panelBg}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="relative">
          <label className={`block text-sm font-semibold mb-3 ${labelText}`}><Shield className="inline mr-2" size={16}/>Consolidation Type</label>
          <button type="button" onClick={toggleConsolidationOpen} className={`w-full flex items-center justify-between px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${control}`}>
            <span>{filters.consolidationType === 'all' ? 'All Companies Consolidation' : filters.consolidationType === 'by-user' ? 'By Employee' : 'By Company'}</span>
            {consolidationOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
          </button>
          {consolidationOpen && (
            <div className={`absolute z-20 mt-2 w-full max-h-48 overflow-y-auto rounded-lg border shadow-lg ${listPanel}`}>
              {[
                { value: 'all', label: 'All Companies Consolidation', desc: 'Aggregate of all accessible companies' },
                { value: 'by-user', label: 'By Employee', desc: 'Group data by employee responsibility' },
                { value: 'by-company', label: 'By Company', desc: 'Individual company focused view' }
              ].map(opt => {
                const active = filters.consolidationType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onFilterChange('consolidationType', opt.value); toggleConsolidationOpen(); }}
                    className={`w-full text-left px-4 py-2 border-b last:border-b-0 text-sm ${borderRow} ${active ? activeRow : hoverRow}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium">{opt.label}</span>
                      {active && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">Active</span>}
                    </div>
                    <div className={`text-xs mt-1 ${subText}`}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {/* Companies */}
        <div className="relative">
          <label className={`block text-sm font-semibold mb-3 ${labelText}`}><Building2 className="inline mr-2" size={16}/>Select Companies</label>
          <button type="button" onClick={toggleCompanyOpen} className={`w-full flex items-center justify-between px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${control}`}>
            <span>{selectedCompanies.size===0 ? 'No Company Selected' : selectedCompanies.size===companies.length ? `All Companies (${companies.length})` : `${selectedCompanies.size} Selected`}</span>
            {companyOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
          </button>
          {companyOpen && (
            <div className={`absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-lg border shadow-lg ${listPanel}`}>
              <div className={`px-4 py-2 border-b flex items-center justify-between ${borderRow}`}>                
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input aria-label="Select all companies" type="checkbox" checked={selectedCompanies.size===companies.length} onChange={onSelectAllCompanies} className={`rounded text-blue-600 focus:ring-blue-500 ${checkbox}`}/>
                  <span className={`text-xs font-medium ${labelText}`}>All Companies</span>
                </label>
                {selectedCompanies.size>0 && <button type="button" onClick={()=>onFilterChange('companies', [])} className={`text-xs underline ${theme==='dark'?'text-red-300 hover:text-red-200':'text-red-600 hover:text-red-500'}`}>Clear</button>}
              </div>
              <div className={`divide-y ${divider}`}>
                {companies.map(c => {
                  const expanded = expandedCompany.has(c.id); const checked = selectedCompanies.has(c.id);
                  return (
                    <div key={c.id} className="px-3 py-2 text-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <input aria-label={`Select company ${c.name}`} type="checkbox" checked={checked} onChange={()=>onToggleCompany(c.id)} className={`mt-0.5 rounded text-blue-600 focus:ring-blue-500 ${checkbox}`}/>
                          <button type="button" onClick={()=>onExpandCompany(c.id)} className={`flex items-center space-x-1 ${labelText}`}>
                            {expanded? <ChevronDown size={14} className="opacity-70"/>:<ChevronRight size={14} className="opacity-70"/>}
                            <span className="font-medium">{c.name}</span>
                            <span className={`text-xs px-1 py-0.5 rounded ${theme==='dark'?'bg-gray-700 text-gray-300':'bg-gray-100 text-gray-600'}`}>{c.code}</span>
                          </button>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(c.status)}`}>{c.status}</span>
                      </div>
                      {expanded && (
                        <div className="mt-2 ml-7 text-xs space-y-1">
                          <div className={`flex justify-between ${subText}`}><span>GSTIN:</span><span className="font-mono">{c.gstin}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>Type:</span><span className="capitalize">{c.type}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>Users:</span><span className="font-medium">{c.accessibleUsers?.length||0}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>FY:</span><span>{c.financialYear}</span></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Employees */}
        <div className="relative">
          <label className={`block text-sm font-semibold mb-3 ${labelText}`}><UserCheck className="inline mr-2" size={16}/>Select Employees</label>
          <button type="button" onClick={toggleEmployeeOpen} className={`w-full flex items-center justify-between px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${control}`}>
            <span>{selectedEmployees.size===0 ? 'No Employee Selected' : selectedEmployees.size===employees.length ? `All Employees (${employees.length})` : `${selectedEmployees.size} Selected`}</span>
            {employeeOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
          </button>
          {employeeOpen && (
            <div className={`absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-lg border shadow-lg ${listPanel}`}>
              <div className={`px-4 py-2 border-b flex items-center justify-between ${borderRow}`}>
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input aria-label="Select all employees" type="checkbox" checked={selectedEmployees.size===employees.length} onChange={onSelectAllEmployees} className={`rounded text-blue-600 focus:ring-blue-500 ${checkbox}`}/>
                  <span className={`text-xs font-medium ${labelText}`}>All Employees</span>
                </label>
                {selectedEmployees.size>0 && <button type="button" onClick={()=>onFilterChange('employees', [])} className={`text-xs underline ${theme==='dark'?'text-red-300 hover:text-red-200':'text-red-600 hover:text-red-500'}`}>Clear</button>}
              </div>
              <div className={`divide-y ${divider}`}>
                {employees.map(emp => {
                  const expanded = expandedEmployee.has(emp.id); const checked = selectedEmployees.has(emp.id);
                  return (
                    <div key={emp.id} className="px-3 py-2 text-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <input aria-label={`Select employee ${emp.name}`} type="checkbox" checked={checked} onChange={()=>onToggleEmployee(emp.id)} className={`mt-0.5 rounded text-blue-600 focus:ring-blue-500 ${checkbox}`}/>
                          <button type="button" onClick={()=>onExpandEmployee(emp.id)} className={`flex items-center space-x-1 ${labelText}`}>
                            {expanded? <ChevronDown size={14} className="opacity-70"/>:<ChevronRight size={14} className="opacity-70"/>}
                            <span className="font-medium">{emp.name.split('(')[0]}</span>
                            <span className={`text-[10px] px-1 py-0.5 rounded ${roleBadge(emp.role)}`}>{emp.role}</span>
                          </button>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(emp.status)}`}>{emp.status}</span>
                      </div>
                      {expanded && (
                        <div className="mt-2 ml-7 text-xs space-y-1">
                          <div className={`flex justify-between ${subText}`}><span>Email:</span><span className="truncate max-w-[140px]">{emp.email}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>Companies:</span><span className="font-medium">{emp.accessibleCompanies.length}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>Dept:</span><span>{emp.department}</span></div>
                          <div className={`flex justify-between ${subText}`}><span>Last Login:</span><span>{new Date(emp.lastLogin).toLocaleDateString('hi-IN')}</span></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Financial Year */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${labelText}`}><Calendar className="inline mr-2" size={16}/>Financial Year</label>
          <select aria-label="Financial Year" value={filters.financialYear} onChange={e=>onFilterChange('financialYear', e.target.value)} className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme==='dark'?'bg-gray-700 border-gray-600 text-gray-100':'bg-white border-gray-300 text-gray-900'}`}>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default FilterPanel;
