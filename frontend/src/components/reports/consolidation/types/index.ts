// Shared type definitions for Consolidation module
export interface Company {
  id: string;
  name: string;
  code: string;
  type: 'manufacturing' | 'trading' | 'service' | 'holding';
  gstin: string;
  status: 'active' | 'inactive';
  financialYear: string;
  accessibleUsers?: string[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  accessibleCompanies: string[];
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

export interface FinancialData {
  companyId: string;
  companyName: string;
  capitalAccount: number;
  openingBalance: number;
  sales: number;
  purchases: number;
  directExpenses: number;
  indirectExpenses: number;
  grossProfit: number;
  netProfit: number;
  stockInHand: number;
  cashInHand: number;
  bankBalance: number;
  sundryDebtors: number;
  sundryCreditors: number;
  currentAssets: number;
  currentLiabilities: number;
  fixedAssets: number;
  investments: number;
  loans: number;
  provisions: number;
  enteredBy?: string;
  lastModifiedBy?: string;
  lastModified?: string;
}

export interface FilterState {
  companies: string[];
  employees: string[];
  dateRange: string;
  fromDate: string;
  toDate: string;
  financialYear: string;
  reportType: string;
  consolidationType: 'all' | 'by-user' | 'by-company';
}

export type ViewType = 'summary' | 'user-access' | 'detailed' | 'comparison' | 'consolidate';
