import React from 'react';
import type { Employee, Company } from '../types/index';
import { formatCurrency } from '../utils/formatters';

export interface UserAccessRecord extends Employee {
  accessibleCompaniesData: Company[];
  totalSalesAccess: number;
  totalProfitAccess: number;
}

interface Props {
  theme: string;
  data: UserAccessRecord[];
}

const UserAccessView: React.FC<Props> = ({ theme, data }) => {
  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const card = theme==='dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
  const nameText = theme==='dark' ? 'text-white' : 'text-gray-900';
  const label = theme==='dark' ? 'text-gray-300' : 'text-gray-600';
  const value = theme==='dark' ? 'text-gray-100' : 'text-gray-800';
  const sectionLabel = theme==='dark' ? 'text-gray-300' : 'text-gray-700';
  const chip = theme==='dark' ? 'bg-gray-600 text-gray-100' : 'bg-gray-200 text-gray-800';

  const roleBadge = (role: string) => {
    if (role.includes('Admin')) return theme==='dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
    if (role.includes('Manager')) return theme==='dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
    return theme==='dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6">
      <h3 className={`text-xl font-semibold mb-6 ${heading}`}>Employee Access and Data Entry Analysis</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map(user => (
          <div key={user.id} className={`p-5 rounded-lg border transition-colors ${card}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-semibold ${nameText}`}>{user.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadge(user.role)}`}>{user.role}</span>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className={label}>Accessible Companies</span>
                <span className={`font-medium ${value}`}>{user.accessibleCompanies.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={label}>Total Sales Access</span>
                <span className="font-medium text-green-600">{formatCurrency(user.totalSalesAccess)}</span>
              </div>
              <div className="flex justify-between">
                <span className={label}>Total Profit Access</span>
                <span className="font-medium text-blue-600">{formatCurrency(user.totalProfitAccess)}</span>
              </div>
              <div className="flex justify-between">
                <span className={label}>Last Login</span>
                <span className={`font-medium ${value}`}>{new Date(user.lastLogin).toLocaleDateString('hi-IN')}</span>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className={`text-sm font-medium mb-2 ${sectionLabel}`}>Company Access</p>
              <div className="flex flex-wrap gap-1">
                {user.accessibleCompaniesData.map(company => (
                  <span key={company.id} className={`px-2 py-1 rounded text-xs font-medium ${chip}`}>
                    {company.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAccessView;
