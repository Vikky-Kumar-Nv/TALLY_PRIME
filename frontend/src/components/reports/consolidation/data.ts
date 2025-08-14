import type { Company, Employee, FinancialData } from './types/index';

export const companies: Company[] = [
  { id: 'COMP001', name: 'R K Sales', code: 'RKS', type: 'trading', gstin: '29AABCT1332L1Z4', status: 'active', financialYear: '2024-25', accessibleUsers: ['EMP001','EMP002','EMP003','EMP005'] },
  { id: 'COMP002', name: 'Sikha Sales', code: 'SS', type: 'trading', gstin: '27AABCT1332L1Z5', status: 'active', financialYear: '2024-25', accessibleUsers: ['EMP001','EMP002','EMP004'] },
  { id: 'COMP003', name: 'M P Traders', code: 'MPT', type: 'trading', gstin: '19AABCT1332L1Z6', status: 'active', financialYear: '2024-25', accessibleUsers: ['EMP001','EMP003','EMP005','EMP006'] }
];

export const employees: Employee[] = [
  { id: 'EMP001', name: 'Super Admin (Owner)', email: 'owner@company.com', role: 'Super Admin', department: 'Management', status: 'active', accessibleCompanies: ['COMP001','COMP002','COMP003'], permissions: ['view_all','edit_all','export_all','admin','assign_access'], createdAt: '2023-01-15', lastLogin: '2025-08-01 10:30:00' },
  { id: 'EMP002', name: 'Admin - Finance Head', email: 'finance.admin@company.com', role: 'Admin', department: 'Finance', status: 'active', accessibleCompanies: ['COMP001','COMP002'], permissions: ['view_assigned','edit_assigned','export_reports','assign_employee_access'], createdAt: '2023-02-20', lastLogin: '2025-08-01 09:15:00' },
  { id: 'EMP003', name: 'Admin - Operations Head', email: 'operations.admin@company.com', role: 'Admin', department: 'Operations', status: 'active', accessibleCompanies: ['COMP003'], permissions: ['view_assigned','edit_assigned','export_reports','assign_employee_access'], createdAt: '2023-03-10', lastLogin: '2025-07-31 16:45:00' },
  { id: 'EMP004', name: 'Employee - Accountant', email: 'accountant@company.com', role: 'Employee', department: 'Accounts', status: 'active', accessibleCompanies: ['COMP001'], permissions: ['view_assigned','edit_transactions_assigned'], createdAt: '2023-04-05', lastLogin: '2025-08-01 08:30:00' },
  { id: 'EMP005', name: 'Employee - Sales Executive', email: 'sales@company.com', role: 'Employee', department: 'Sales', status: 'active', accessibleCompanies: ['COMP002'], permissions: ['view_assigned','edit_sales_assigned'], createdAt: '2023-05-12', lastLogin: '2025-08-01 11:20:00' },
  { id: 'EMP006', name: 'Employee - Data Entry Operator', email: 'dataentry@company.com', role: 'Employee', department: 'Operations', status: 'active', accessibleCompanies: ['COMP003'], permissions: ['view_assigned','edit_basic_assigned'], createdAt: '2023-06-18', lastLogin: '2025-07-31 14:10:00' }
];

export const financialData: FinancialData[] = [
  { companyId: 'COMP001', companyName: 'R K Sales', capitalAccount: 1515969, openingBalance: 530382, sales: 15108770, purchases: 3525660, directExpenses: 337560, indirectExpenses: 346269, grossProfit: 337560, netProfit: 346269, stockInHand: 2818470, cashInHand: 215350, bankBalance: 315032, sundryDebtors: 38222, sundryCreditors: 305650, currentAssets: 3387074, currentLiabilities: 305650, fixedAssets: 0, investments: 0, loans: 1325440, provisions: 35000, enteredBy: 'EMP004', lastModifiedBy: 'EMP002', lastModified: '2025-07-31 15:30:00' },
  { companyId: 'COMP002', companyName: 'Sikha Sales', capitalAccount: 4800062, openingBalance: 3053436, sales: 59872225, purchases: 12462574, directExpenses: 541418, indirectExpenses: 730062, grossProfit: 541418, netProfit: 730062, stockInHand: 5187121, cashInHand: 141281, bankBalance: 2912155, sundryDebtors: 4123585, sundryCreditors: 2315991, currentAssets: 12363942, currentLiabilities: 2315991, fixedAssets: 0, investments: 0, loans: 2723954, provisions: 173492, enteredBy: 'EMP005', lastModifiedBy: 'EMP002', lastModified: '2025-08-01 11:15:00' },
  { companyId: 'COMP003', companyName: 'M P Traders', capitalAccount: 6316031, openingBalance: 3583818, sales: 74980995, purchases: 15988234, directExpenses: 878978, indirectExpenses: 1076331, grossProfit: 878978, netProfit: 1076331, stockInHand: 8005591, cashInHand: 356631, bankBalance: 3227187, sundryDebtors: 4161807, sundryCreditors: 2621641, currentAssets: 15751016, currentLiabilities: 2621641, fixedAssets: 0, investments: 0, loans: 4049394, provisions: 208492, enteredBy: 'EMP006', lastModifiedBy: 'EMP003', lastModified: '2025-07-31 16:10:00' }
];
