import React from 'react';
import { Shield } from 'lucide-react';

interface SubordinateUserRef { id: string; role: string; }
interface HierarchicalReportInfo {
  accessScope: string;
  reportScope: string;
  subordinateUsers: SubordinateUserRef[];
  permissions: string[];
}

interface Props {
  theme: string;
  userRole: string;
  hierarchicalReport: HierarchicalReportInfo;
  userAccessibleCompanies: string[];
}

export const ConsolidationHeader: React.FC<Props> = ({ theme, userRole, hierarchicalReport, userAccessibleCompanies }) => {
  // Theme tokens
  const container = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  const roleBadge = (role: string) => {
    if (role === 'Super Admin') return theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
    if (role === 'Admin') return theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
    return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
  };

  const scopeColor = hierarchicalReport.reportScope === 'complete'
    ? 'text-red-600'
    : hierarchicalReport.reportScope === 'departmental'
      ? 'text-blue-600'
      : 'text-green-600';

  const permPill = (color: 'red'|'orange'|'blue') => {
    const map: Record<string, { light: string; dark: string }> = {
      red: { light: 'bg-red-100 text-red-700', dark: 'bg-red-800 text-red-200' },
      orange:{ light: 'bg-orange-100 text-orange-700', dark: 'bg-orange-800 text-orange-200' },
      blue: { light: 'bg-blue-100 text-blue-700', dark: 'bg-blue-800 text-blue-200' }
    };
    const sel = map[color];
    return theme === 'dark' ? sel.dark : sel.light;
  };

  return (
    <div className={`mb-6 p-4 rounded-lg border ${container}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start md:items-center space-x-4">
          <div className={`p-2 rounded-lg ${roleBadge(userRole)}`}>
            <Shield className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-semibold leading-snug ${textPrimary}`}>Multi Company Consolidation - Access Overview</h3>
            <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${textSecondary}`}>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleBadge(userRole)}`}>{userRole}</span>
              <span><span className="font-medium">Access:</span> {hierarchicalReport.accessScope}</span>
              <span><span className="font-medium">Companies:</span> {userAccessibleCompanies.length}</span>
              {hierarchicalReport.subordinateUsers.length > 0 && (
                <span><span className="font-medium">Team:</span> {hierarchicalReport.subordinateUsers.length}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-left md:text-right space-y-1">
          <div className={`text-sm ${textSecondary}`}>Report Scope</div>
          <div className={`font-semibold text-lg ${scopeColor}`}>
            {hierarchicalReport.reportScope.charAt(0).toUpperCase() + hierarchicalReport.reportScope.slice(1)}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {hierarchicalReport.permissions.includes('view_all_companies') && (
              <span className={`text-xs px-2 py-1 rounded ${permPill('red')}`}>All Access</span>
            )}
            {hierarchicalReport.permissions.includes('assign_admin_access') && (
              <span className={`text-xs px-2 py-1 rounded ${permPill('orange')}`}>Assign Access</span>
            )}
            {hierarchicalReport.permissions.includes('export_all_reports') && (
              <span className={`text-xs px-2 py-1 rounded ${permPill('blue')}`}>Export</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
