import React from 'react';
import { Shield } from 'lucide-react';

interface Props {
  theme: string;
  userRole: string;
  userAccessibleCompanies: string[];
  companies: { id: string; name: string }[];
}

const BalanceSheetDetailed: React.FC<Props> = ({ theme, userRole, userAccessibleCompanies, companies }) => {
  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const card = theme==='dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const innerBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const rowBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-100';
  const dividerStrong = theme==='dark' ? 'border-gray-600' : 'border-gray-300';
  const subHead = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const columnLabel = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const accessBanner = 'bg-amber-50 border border-amber-200'; // could add dark variant later
  const accessText = 'text-amber-800';

  const mask = (companyId: string, value: string) => userAccessibleCompanies.includes(companyId) ? value : '***';

  return (
    <div className="mb-8">
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}>Balance Sheet Consolidation (Detailed)</h4>
      {userRole !== 'Super Admin' && (
        <div className={`mb-4 p-3 rounded-lg ${accessBanner}`}>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-amber-600 mr-2" />
            <div className={`text-sm ${accessText}`}><strong>Access Level: {userRole}</strong> - You can only view companies assigned to you ({userAccessibleCompanies.length} of {companies.length} companies)</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liabilities */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>LIABILITIES</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${columnLabel}`}>
              <div>Item</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="grid grid-cols-4 gap-2">
                <div className="font-medium">PROPRIETORS CAPITAL A/C</div>
                <div className="text-right">{mask('COMP001','15,15,969.00')}</div>
                <div className="text-right">{mask('COMP002','48,00,062.21')}</div>
                <div className={`text-right font-semibold`}>{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'63,16,031.21':'Restricted'}</div>
              </div>
              <div className={`text-xs ml-4 mt-1 ${subHead}`}>(As per annexure-A)</div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="font-medium mb-2">UNSECURED LOANS</div>
              <div className="ml-4 space-y-1">
                <div className="grid grid-cols-4 gap-2"><div>Manohar Singh</div><div className="text-right">{mask('COMP001','0')}</div><div className="text-right">{mask('COMP002','62,00,000.00')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'62,00,000.00':'Restricted'}</div></div>
                <div className="grid grid-cols-4 gap-2"><div>Rakhraj Finvest Co.</div><div className="text-right">{mask('COMP001','13,25,440')}</div><div className="text-right">{mask('COMP002','27,23,953.71')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'40,49,393.71':'Restricted'}</div></div>
              </div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="font-medium mb-2">CURRENT LIABILITIES & PROVISIONS</div>
              <div className="ml-4 space-y-1">
                <div className="grid grid-cols-4 gap-2"><div>Sundry Creditors (Annexure-B)</div><div className="text-right">{mask('COMP001','3,05,650.00')}</div><div className="text-right">{mask('COMP002','23,15,991.11')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'26,21,641.11':'Restricted'}</div></div>
                <div className="grid grid-cols-4 gap-2"><div>Sundry Payables (Annexure-C)</div><div className="text-right">{mask('COMP001','35,000.00')}</div><div className="text-right">{mask('COMP002','1,73,492.00')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'2,08,492.00':'Restricted'}</div></div>
              </div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="font-medium mb-2">Advance From Customer</div>
              <div className="ml-4">
                <div className="grid grid-cols-4 gap-2"><div>H.P. Biswas & Company</div><div className="text-right">{mask('COMP001','2,42,517')}</div><div className="text-right">{mask('COMP002','1,640.00')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'2,44,157.00':'Restricted'}</div></div>
              </div>
            </div>
            <div className={`pt-2 border-t-2 ${dividerStrong}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','34,24,576.00')}</div>
                <div className="text-right">{mask('COMP002','1,62,15,139.03')}</div>
                <div className="text-right text-lg">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'1,96,39,715.03':'Access Restricted'}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Assets */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>ASSETS</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${columnLabel}`}>
              <div>Item</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="font-medium mb-2">CURRENT ASSETS LOANS & ADVANCES</div>
              <div className="ml-4 space-y-1">
                <div className="grid grid-cols-4 gap-2"><div>A. Current Assets</div><div></div><div></div><div></div></div>
                <div className="ml-4">
                  <div className="grid grid-cols-4 gap-2"><div>Closing Stock (Certified by Proprietor)</div><div className="text-right">{mask('COMP001','28,18,470.00')}</div><div className="text-right">{mask('COMP002','51,87,121.00')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'80,05,591.00':'Restricted'}</div></div>
                </div>
              </div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="grid grid-cols-4 gap-2"><div>Cash & Bank Balances (Annexure-D)</div><div className="text-right">{mask('COMP001','5,30,382.00')}</div><div className="text-right">{mask('COMP002','30,53,435.99')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'35,83,817.99':'Restricted'}</div></div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="grid grid-cols-4 gap-2"><div>Sundry Debtors (Annexure-E)</div><div className="text-right">{mask('COMP001','38,222.00')}</div><div className="text-right">{mask('COMP002','41,23,585.20')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'41,61,807.20':'Restricted'}</div></div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="grid grid-cols-4 gap-2"><div>B. Loans & Advances (Annexure-F)</div><div className="text-right">{mask('COMP001','37,502.00')}</div><div className="text-right">{mask('COMP002','31,52,301.10')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'31,89,803.10':'Restricted'}</div></div>
            </div>
            <div className={`pb-2 border-b ${rowBorder}`}>
              <div className="grid grid-cols-4 gap-2"><div>Advance to Supplier - Sri Ram Sales</div><div className="text-right">{mask('COMP001','34,24,576.00')}</div><div className="text-right">{mask('COMP002','1,62,15,139.03')}</div><div className="text-right">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'1,96,39,715.03':'Restricted'}</div></div>
            </div>
            <div className={`pt-2 border-t-2 ${dividerStrong}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','34,24,576.00')}</div>
                <div className="text-right">{mask('COMP002','1,62,15,139.03')}</div>
                <div className="text-right text-lg">{userAccessibleCompanies.includes('COMP001')&&userAccessibleCompanies.includes('COMP002')?'1,96,39,715.03':'Access Restricted'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetDetailed;
