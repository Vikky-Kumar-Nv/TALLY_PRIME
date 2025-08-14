import React from 'react';
import { Shield } from 'lucide-react';

interface Props {
  theme: string;
  userRole: string;
  userAccessibleCompanies: string[];
  companies: { id: string; name: string }[];
}

const BalanceSheetConsolidationSection: React.FC<Props> = ({ theme, userRole, userAccessibleCompanies, companies }) => {
  // Theme tokens
  const baseText = theme==='dark' ? 'text-gray-200' : 'text-gray-900';
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const noteText = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const warningCard = 'bg-amber-50 border border-amber-200'; // could add dark variant if needed later
  const warningText = 'text-amber-800';

  return (
    <div className={`mb-8 ${baseText}`}> 
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}>Balance Sheet Consolidation (As on 31st March, 2024)</h4>
      {userRole !== 'Super Admin' && (
        <div className={`mb-4 p-3 rounded-lg ${warningCard}`}>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-amber-600 mr-2" />
            <div className={`text-sm ${warningText}`}><strong>Access Level: {userRole}</strong> - You can only view companies assigned to you ({userAccessibleCompanies.length} of {companies.length} companies)</div>
          </div>
        </div>
      )}
      {/* Pending data mapping notice */}
      <div className={`text-sm ${noteText}`}>Detailed balance sheet tables migrated from monolith pending full data mapping.</div>
    </div>
  );
};

export default BalanceSheetConsolidationSection;
