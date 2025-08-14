import React from 'react';
import { TrendingUp, Shield } from 'lucide-react';

interface Props { theme: string; userRole: string; userAccessibleCompanies: string[]; }

const ProfitAndLossSection: React.FC<Props> = ({ theme, userRole, userAccessibleCompanies }) => {
  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const card = theme==='dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const innerBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const headText = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const rowDivider = theme==='dark' ? 'border-gray-700' : 'border-gray-100';
  const strongDivider = theme==='dark' ? 'border-gray-600' : 'border-gray-300';
  const warnCard = 'bg-amber-50 border border-amber-200'; // dark variant can be added later
  const warnText = 'text-amber-800';

  const mask = (comp: 'COMP001'|'COMP002', val: string) => userAccessibleCompanies.includes(comp) ? val : '***';
  const both = (v: string) => (userAccessibleCompanies.includes('COMP001') && userAccessibleCompanies.includes('COMP002')) ? v : 'Restricted';

  const expenditure = [
    ['To Audit Fee','5,000.00','10,000.00','15000.00'],
    ['To Stationery Charges','12,350.00','25,550.00','37900.00'],
    ['To Bank Charges','2,450.00','2,682.76','5132.76'],
    ['To Conveyance Exp.','20,320.00','22,350.00','42670.00'],
    ['To Discount to Customer','-','30,40,258.40','3040258.40'],
    ['To Diwali Expenses','10,220.00','13,750.00','23970.00'],
    ['To Electricity Exp.','5,000.00','6,000.00','11000.00'],
    ['To Entertainment A/c','-','20,120.00','20120.00'],
    ['To Misc Expenses','2,500.00','7,550.00','10050.00'],
    ['To Mobile Expenses','1,656.00','9,540.00','11196.00'],
    ['To News Paper & Magazines','250.00','1,310.00','1560.00'],
    ['To Postage Expenses','650.00','1,863.00','2513.00'],
    ['To Printing & Stationery','10,220.00','12,880.00','23100.00'],
    ['To Professional Charges','10,550.00','16,375.00','26925.00'],
    ['To Salary & Wages','1,20,000.00','4,80,000.00','600000.00'],
    ['To Sales Promotion','3,325.00','4,500.00','7825.00'],
    ['To Staff Welfare','2,150.00','7,350.00','9500.00'],
    ['To Net Profit','3,46,269.00','7,30,062.21','10,76,331.21']
  ];

  const income = [
    ['By Gross Profit on Sales','3,37,560.00','5,41,418.11','8,78,978.11'],
    ['By Rebate & Discount','2,15,350','34,55,224.75','36,70,574.75'],
    ['By Freight Subsidy','','3,30,832.51','3,30,832.51'],
    ['By SDS Interest','','84,666.00','84,666.00']
  ];

  return (
    <div className="mb-8">
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}><TrendingUp className="mr-2" size={20} />Profit & Loss Account for the Year Ended 31.03.2024</h4>
      {userRole !== 'Super Admin' && (
        <div className={`mb-4 p-3 rounded-lg ${warnCard}`}><div className="flex items-center"><Shield className="h-5 w-5 text-amber-600 mr-2" /><div className={`text-sm ${warnText}`}><strong>P&L Access Level: {userRole}</strong> - Viewing permitted companies only</div></div></div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenditure */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>EXPENDITURE (Dr.)</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${headText}`}>
              <div>PARTICULARS</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-2 text-sm">
            {expenditure.map(r => (
              <div key={r[0]} className={`grid grid-cols-4 gap-2 ${r[0]==='To Net Profit' ? 'font-medium text-green-600 border-t pt-2 mt-2':''}`}>
                <div>{r[0]}</div>
                <div className="text-right">{mask('COMP001', r[1])}</div>
                <div className="text-right">{mask('COMP002', r[2])}</div>
                <div className="text-right">{both(r[3])}</div>
              </div>
            ))}
            <div className={`pt-2 border-t-2 ${strongDivider}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','5,52,910.00')}</div>
                <div className="text-right">{mask('COMP002','44,12,141.37')}</div>
                <div className="text-right text-lg">{both('49,65,051.37')}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Income */}
        <div className={`rounded-lg border ${card}`}>
          <div className={`p-4 border-b ${innerBorder}`}>
            <h5 className={`font-semibold text-center ${heading}`}>INCOME (Cr.)</h5>
            <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${headText}`}>
              <div>PARTICULARS</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
            </div>
          </div>
          <div className="p-4 space-y-3 text-sm">
            {income.map(r => (
              <div key={r[0]} className={`border-b pb-2 ${rowDivider}`}>
                <div className="grid grid-cols-4 gap-2">
                  <div>{r[0]}</div>
                  <div className="text-right">{mask('COMP001', r[1] || '')}</div>
                  <div className="text-right">{mask('COMP002', r[2] || '')}</div>
                  <div className="text-right">{both(r[3])}</div>
                </div>
              </div>
            ))}
            <div className="space-y-2 min-h-[160px]"></div>
            <div className={`pt-2 border-t-2 ${strongDivider}`}>
              <div className="grid grid-cols-4 gap-2 font-bold">
                <div>TOTAL</div>
                <div className="text-right">{mask('COMP001','5,52,910.00')}</div>
                <div className="text-right">{mask('COMP002','44,12,141.37')}</div>
                <div className="text-right text-lg">{both('49,65,051.37')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLossSection;
