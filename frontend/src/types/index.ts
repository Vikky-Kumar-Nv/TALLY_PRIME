// Common types for the application

export type CompanyInfo = {
  name: string;
  financialYear: string;
  booksBeginningYear: string;
  address: string;
  pin: string;
  phoneNumber: string;
  email: string;
  panNumber: string;
  gstNumber: string;
  state?: string;
  country?: string;
  taxType?: 'GST' | 'VAT';

};

export type LedgerType = 
  | 'capital' 
  | 'loans' 
  | 'fixed-assets'
  | 'current-assets'
  | 'current-liabilities'
  | 'purchase'
  | 'direct-expenses'
  | 'sales'
  | 'indirect-expenses'
  | 'indirect-income';

export type LedgerGroup = {
  id: string;
  name: string;
  parent?: string;
  type: LedgerType;
};

export type Ledger = {
  id: string;
  name: string;
  groupId: string;
  openingBalance: number;
  balanceType: 'debit' | 'credit';
  address?: string;
  email?: string;
  phone?: string;
  gstNumber?: string;
  panNumber?: string;
};

export type VoucherType = 
  | 'payment' 
  | 'receipt' 
  | 'contra' 
  | 'journal' 
  | 'sales' 
  | 'purchase'
  | 'debit-note'
  | 'credit-note';

export type VoucherEntry = {
  id: string;
  date: string;
  type: VoucherType;
  number: string;
  narration?: string;
  entries: VoucherEntryLine[];
};

export type VoucherEntryLine = {
  id: string;
  ledgerId: string;
  amount: number;
  type: 'debit' | 'credit';
};

export type StockItem = {
  id: string;
  name: string;
  unit: string;
  openingBalance: number;
  openingValue: number;
  gstRate?: number;
  hsnCode?: string;
};

export type UnitOfMeasurement = {
  id: string;
  name: string;
  symbol: string;
};