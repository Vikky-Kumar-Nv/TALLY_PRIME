import React from 'react';
import { BarChart3, Shield } from 'lucide-react';

interface Props { theme: string; userRole: string; userAccessibleCompanies: string[]; }

const TradingAccountSection: React.FC<Props> = ({ theme, userRole, userAccessibleCompanies }) => {
  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const card = theme==='dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const innerBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const rowDivider = theme==='dark' ? 'border-gray-700' : 'border-gray-100';
  const strongDivider = theme==='dark' ? 'border-gray-600' : 'border-gray-300';
  const tableHeadText = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const warnCard = 'bg-amber-50 border border-amber-200'; // could add dark variant later
  const warnText = 'text-amber-800';

  const mask = (id: string, value: string) => userAccessibleCompanies.includes(id) ? value : '***';
  const bothVisible = userAccessibleCompanies.includes('COMP001') && userAccessibleCompanies.includes('COMP002');

  const expenditureRows = [
    { label: 'To Opening Stock', rks: '0.00', ss: '0.00', total: '0.00' },
    { label: 'To Purchase GST 18%', rks: '35,25,660', ss: '1,24,62,574.36', total: '1,59,88,234.36' },
    { label: 'To Purchase GST 28%', rks: '1,12,45,550', ss: '4,68,68,232.66', total: '5,81,13,782.66' },
    { label: 'To Gross Profit on Sales', rks: '3,37,560.00', ss: '5,41,418.11', total: '8,78,978.11', highlight: true }
  ];

  const incomeRows = [
    { label: 'By Sale GST 18%', rks: '32,15,250', ss: '9,58,27,47.85', total: '12,79,79,97.85' },
    { label: 'By Sale GST 28%', rks: '90,75,050', ss: '4,51,02,356.28', total: '5,41,77,406.28' },
    { label: 'By Closing Stock 18%', rks: '53,250', ss: '29,81,406.00', total: '30,34,656.00' },
    { label: 'By Closing Stock 28%', rks: '27,65,220', ss: '22,05,715.00', total: '49,70,935.00' }
  ];

  return (
    <div className="mb-8">
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}><BarChart3 className="mr-2" size={20} />Trading Account for the Year Ended 31.03.2024</h4>
      {userRole !== 'Super Admin' && (
        <div className={`mb-4 p-3 rounded-lg ${warnCard}`}>
          <div className="flex items-center"><Shield className="h-5 w-5 text-amber-600 mr-2" /><div className={`text-sm ${warnText}`}><strong>Trading Account Access: {userRole}</strong> - Limited to assigned companies only</div></div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenditure */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>EXPENDITURE (Dr.)</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${tableHeadText}`}>
              <div>PARTICULARS</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            {expenditureRows.map(row => (
              <div key={row.label} className={`pb-2 border-b ${rowDivider} ${row.highlight ? 'text-green-600 font-medium':''}`}>
                <div className="grid grid-cols-4 gap-2">
                  <div>{row.label}</div>
                  <div className="text-right">{mask('COMP001', row.rks)}</div>
                  <div className="text-right">{mask('COMP002', row.ss)}</div>
                  <div className="text-right">{bothVisible ? row.total : 'Restricted'}</div>
                </div>
              </div>
            ))}
            <div className={`pt-2 border-t-2 ${strongDivider}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','1,51,08,770.00')}</div>
                <div className="text-right">{mask('COMP002','5,98,72,225.13')}</div>
                <div className="text-right text-lg">{bothVisible ? '7,49,80,995.13' : 'Access Restricted'}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Income */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>INCOME (Cr.)</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${tableHeadText}`}>
              <div>PARTICULARS</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            {incomeRows.map(row => (
              <div key={row.label} className={`pb-2 border-b ${rowDivider}`}>
                <div className="grid grid-cols-4 gap-2">
                  <div>{row.label}</div>
                  <div className="text-right">{mask('COMP001', row.rks)}</div>
                  <div className="text-right">{mask('COMP002', row.ss)}</div>
                  <div className="text-right">{bothVisible ? row.total : 'Restricted'}</div>
                </div>
              </div>
            ))}
            <div className={`pt-2 border-t-2 ${strongDivider}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','1,51,08,770.00')}</div>
                <div className="text-right">{mask('COMP002','5,98,72,225.13')}</div>
                <div className="text-right text-lg">{bothVisible ? '7,49,80,995.13' : 'Access Restricted'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingAccountSection;
