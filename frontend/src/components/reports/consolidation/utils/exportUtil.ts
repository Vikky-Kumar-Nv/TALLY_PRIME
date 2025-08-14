import * as XLSX from 'xlsx';
import type { FinancialData, Employee } from '../types/index';

export function exportConsolidationToExcel(data: FinancialData[], employees: Employee[]) {
  const exportData = data.map(item => ({
    Company: item.companyName,
    Sales: item.sales,
    Purchases: item.purchases,
    'Gross Profit': item.grossProfit,
    'Net Profit': item.netProfit,
    Assets: item.currentAssets + item.fixedAssets,
    Liabilities: item.currentLiabilities,
    'Cash & Bank': item.cashInHand + item.bankBalance,
    Stock: item.stockInHand,
    'Entered By': employees.find(emp => emp.id === item.enteredBy)?.name || item.enteredBy,
    'Last Modified By': employees.find(emp => emp.id === item.lastModifiedBy)?.name || item.lastModifiedBy,
    'Last Modified': item.lastModified
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consolidation');
  XLSX.writeFile(wb, `Multi_Company_Consolidation_${new Date().toISOString().split('T')[0]}.xlsx`);
}
