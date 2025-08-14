import React from 'react';
import { FileText } from 'lucide-react';

interface Props { theme: string; userAccessibleCompanies: string[]; }

const AnnexuresSection: React.FC<Props> = ({ theme, userAccessibleCompanies }) => {
  const formatINR = (val: number) => val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const can = (compId: string) => userAccessibleCompanies.includes(compId);
  const mask = (compId: string, amount: string) => can(compId) ? amount : '***';

  // Theme tokens
  const heading = theme==='dark' ? 'text-white' : 'text-gray-900';
  const card = theme==='dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const innerBorder = theme==='dark' ? 'border-gray-700' : 'border-gray-200';
  const headText = theme==='dark' ? 'text-gray-400' : 'text-gray-600';
  const subNote = theme==='dark' ? 'text-gray-400' : 'text-gray-500';
  const totalDivider = theme==='dark' ? 'border-gray-600' : 'border-gray-300';

  const annexA = [
    { label: 'Opening Capital', rks: 1515969 - 346269, ss: 4800062.21 - 730062.21 },
    { label: 'Add: Net Profit (Transferred from P&L A/c)', rks: 346269, ss: 730062.21 },
    { label: 'Less: Drawings', rks: 0, ss: 0 },
  ];
  const closingCapRKS = annexA.reduce((s, r) => s + (r.label.startsWith('Less') ? -r.rks : r.rks), 0);
  const closingCapSS = annexA.reduce((s, r) => s + (r.label.startsWith('Less') ? -r.ss : r.ss), 0);
  const annexB = [
    { label: 'M/s Mongia Steel', rks: 105650, ss: 815991.11 },
    { label: 'Nuvoco Vistas Corp. Ltd.', rks: 100000, ss: 900000.00 },
    { label: 'Nuvoco Vistas Corp. Ltd. (Chemical)', rks: 100000, ss: 425000.00 },
  ];
  const totalCredRKS = 305650.00; const totalCredSS = 2315991.11;
  const annexC = [
    { label: 'Audit Fee Payable', rks: 5000, ss: 10000 },
    { label: 'Salary Payable', rks: 30000, ss: 150000 },
    { label: 'TCS Payable', rks: 0, ss: 13492 },
  ];
  const totalPayRKS = 35000.00; const totalPaySS = 173492.00;
  const annexD = [
    { label: 'Cash In Hand', rks: 215350, ss: 141281 },
    { label: 'Bank - BOI 0456', rks: 212532, ss: 2886271 },
    { label: 'Bank - SBI 7778', rks: 102500, ss: 25884 },
  ];
  const totalCashBankRKS = 530382.00; const totalCashBankSS = 3053436.00;
  const annexE = [
    { label: 'Ganesh Traders', rks: 18222, ss: 1123585.20 },
    { label: 'Ganesh Yadav', rks: 10000, ss: 1500000.00 },
    { label: 'R K Construction', rks: 10000, ss: 1500000.00 },
  ];
  const totalDebRKS = 38222.00; const totalDebSS = 4123585.20;
  const annexF = [
    { label: 'Jagdeep Singh', rks: 12500, ss: 250000 },
    { label: 'Navdeep Singh', rks: 5000, ss: 300000 },
    { label: 'Sec. Sri Ram Sales', rks: 7502, ss: 500000 },
    { label: 'Sec. Nuvoco Vistas Corp. Ltd.', rks: 5000, ss: 600000 },
    { label: 'GST (Input/Refund)', rks: 5000, ss: 752301.10 },
    { label: 'TCS (Receivable)', rks: 500, ss: 375000 },
  ];
  const totalLoanAdvRKS = 37502.00; const totalLoanAdvSS = 3152301.10;

  const ScheduleBlock: React.FC<{ title: string; note: string; rows: { label: string; rks: number; ss: number; }[]; totalRKS: number; totalSS: number; showClosingRow?: boolean; closingLabel?: string; closingRKS?: number; closingSS?: number; }> = ({ title, note, rows, totalRKS, totalSS, showClosingRow=false, closingLabel='Closing Balance', closingRKS=0, closingSS=0 }) => (
    <div className={`rounded-lg border ${card} mb-6 transition-colors`}>
      <div className={`p-4 border-b ${innerBorder}`}>
        <h5 className={`font-semibold text-center ${heading}`}>{title}</h5>
        <p className={`text-xs text-center mt-1 ${subNote}`}>{note}</p>
        <div className={`grid grid-cols-4 gap-2 text-xs font-medium mt-2 ${headText}`}>
          <div>PARTICULARS</div><div className="text-right">R K SALES</div><div className="text-right">SIKHA SALES</div><div className="text-right">TOTAL</div>
        </div>
      </div>
      <div className="p-4 space-y-2 text-sm">
        {rows.map(r => {
          const rksStr = formatINR(r.rks);
          const ssStr = formatINR(r.ss);
          return (
            <div key={r.label} className="grid grid-cols-4 gap-2">
              <div>{r.label}</div>
              <div className="text-right">{mask('COMP001', rksStr)}</div>
              <div className="text-right">{mask('COMP002', ssStr)}</div>
              <div className="text-right">{can('COMP001') && can('COMP002') ? formatINR(r.rks + r.ss) : 'Restricted'}</div>
            </div>
          );
        })}
        {showClosingRow && (
          <div className="grid grid-cols-4 gap-2 font-medium border-t pt-2 mt-2">
            <div>{closingLabel}</div>
            <div className="text-right">{mask('COMP001', formatINR(closingRKS))}</div>
            <div className="text-right">{mask('COMP002', formatINR(closingSS))}</div>
            <div className="text-right">{can('COMP001') && can('COMP002') ? formatINR(closingRKS + closingSS) : 'Restricted'}</div>
          </div>
        )}
        <div className={`pt-2 border-t-2 ${totalDivider}`}>
          <div className="grid grid-cols-4 gap-2 text-sm font-bold">
            <div>TOTAL</div>
            <div className="text-right">{mask('COMP001', formatINR(totalRKS))}</div>
            <div className="text-right">{mask('COMP002', formatINR(totalSS))}</div>
            <div className="text-right">{can('COMP001') && can('COMP002') ? formatINR(totalRKS + totalSS) : 'Access Restricted'}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <h4 className={`text-lg font-semibold mb-4 flex items-center ${heading}`}><FileText className="mr-2" size={20} />Detailed Schedules (Annexure - A to F)</h4>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ScheduleBlock title="Annexure - A" note="Proprietor's Capital Account" rows={annexA} totalRKS={closingCapRKS} totalSS={closingCapSS} showClosingRow closingLabel="Closing Capital" closingRKS={closingCapRKS} closingSS={closingCapSS} />
          <ScheduleBlock title="Annexure - C" note="Sundry Payables" rows={annexC} totalRKS={totalPayRKS} totalSS={totalPaySS} />
          <ScheduleBlock title="Annexure - E" note="Sundry Debtors" rows={annexE} totalRKS={totalDebRKS} totalSS={totalDebSS} />
        </div>
        <div>
          <ScheduleBlock title="Annexure - B" note="Sundry Creditors" rows={annexB} totalRKS={totalCredRKS} totalSS={totalCredSS} />
          <ScheduleBlock title="Annexure - D" note="Cash & Bank Balances" rows={annexD} totalRKS={totalCashBankRKS} totalSS={totalCashBankSS} />
          <ScheduleBlock title="Annexure - F" note="Loans & Advances" rows={annexF} totalRKS={totalLoanAdvRKS} totalSS={totalLoanAdvSS} />
        </div>
      </div>
    </div>
  );
};

export default AnnexuresSection;
