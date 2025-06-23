// // Common types for the application

// export type CompanyInfo = {
//   name: string;
//   financialYear: string;
//   booksBeginningYear: string;
//   address: string;
//   pin: string;
//   phoneNumber: string;
//   email: string;
//   panNumber: string;
//   gstNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';

// };

// export type LedgerType = 
//   | 'capital' 
//   | 'loans' 
//   | 'fixed-assets'
//   | 'current-assets'
//   | 'current-liabilities'
//   | 'purchase'
//   | 'direct-expenses'
//   | 'sales'
//   | 'indirect-expenses'
//   | 'indirect-income';

// export type LedgerGroup = {
//   id: string;
//   name: string;
//   parent?: string;
//   type: LedgerType;
// };

// export type Ledger = {
//   id: string;
//   name: string;
//   groupId: string;
//   openingBalance: number;
//   balanceType: 'debit' | 'credit';
//   address?: string;
//   email?: string;
//   phone?: string;
//   gstNumber?: string;
//   panNumber?: string;
// };

// export type VoucherType = 
//   | 'payment' 
//   | 'receipt' 
//   | 'contra' 
//   | 'journal' 
//   | 'sales' 
//   | 'purchase'
//   | 'debit-note'
//   | 'credit-note';

// export type VoucherEntry = {
//   id: string;
//   date: string;
//   type: VoucherType;
//   number: string;
//   narration?: string;
//   entries: VoucherEntryLine[];
// };

// export type VoucherEntryLine = {
//   id: string;
//   ledgerId: string;
//   amount: number;
//   type: 'debit' | 'credit';
// };

// export type StockItem = {
//   id: string;
//   name: string;
//   unit: string;
//   openingBalance: number;
//   openingValue: number;
//   gstRate?: number;
//   hsnCode?: string;
// };

// export type UnitOfMeasurement = {
//   id: string;
//   name: string;
//   symbol: string;
// };




// export type CompanyInfo = {
//   name: string;
//   financialYear: string;
//   booksBeginningYear: string;
//   address: string;
//   pin: string;
//   phoneNumber: string;
//   email: string;
//   panNumber: string;
//   gstNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
// };

// export type LedgerType = 
//   | 'capital' 
//   | 'loans' 
//   | 'fixed-assets'
//   | 'current-assets'
//   | 'current-liabilities'
//   | 'purchase'
//   | 'direct-expenses'
//   | 'sales'
//   | 'indirect-expenses'
//   | 'indirect-income';

// export type LedgerGroup = {
//   id: string;
//   name: string;
//   parent?: string;
//   type: LedgerType;
// };

// export type Ledger = {
//   id: string;
//   name: string;
//   groupId: string;
//   openingBalance: number;
//   balanceType: 'debit' | 'credit';
//   address?: string;
//   email?: string;
//   phone?: string;
//   gstNumber?: string;
//   panNumber?: string;
//   type?: LedgerType;
// };

// export type VoucherType = 
//   | 'payment' 
//   | 'receipt' 
//   | 'contra' 
//   | 'journal' 
//   | 'sales' 
//   | 'purchase'
//   | 'debit-note'
//   | 'credit-note';

// export type VoucherEntry = {
//   id: string;
//   date: string;
//   type: VoucherType | 'stock-journal' | 'delivery-note';
//   number: string;
//   narration?: string;
//   entries: VoucherEntryLine[];
//   mode?: 'item' | 'accounting' | 'voucher' | 'transfer' | 'adjustment';
//   referenceNo?: string;
// };

// export type VoucherEntryLine = {
//   id: string;
//   ledgerId: string;
//   amount: number;
//    type: 'debit' | 'credit' | 'source' | 'destination';
//   itemId?: string;
//   quantity?: number;
//   rate?: number;
//   gstRate?: number;
//   godownId?: string;
// };

// export type Godown = {
//   id: string;
//   name: string;
// };

// export type StockItem = {
//   id: string;
//   name: string;
//   unit: string;
//   openingBalance: number;
//   openingValue: number;
//   gstRate?: number;
//   hsnCode?: string;
// };

// export type UnitOfMeasurement = {
//   id: string;
//   name: string;
//   symbol: string;
// };





// export type CompanyInfo = {
//   name: string;
//   financialYear: string;
//   booksBeginningYear: string;
//   address: string;
//   pin: string;
//   phoneNumber: string;
//   email: string;
//   panNumber: string;
//   gstNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
// };

// export type LedgerType = 
//   | 'capital' 
//   | 'loans' 
//   | 'fixed-assets'
//   | 'current-assets'
//   | 'current-liabilities'
//   | 'purchase'
//   | 'direct-expenses'
//   | 'sales'
//   | 'indirect-expenses'
//   | 'indirect-income'
//   | 'sundry-debtors'
//   | 'sundry-creditors';

// export type LedgerGroup = {
//   id: string;
//   name: string;
//   parent?: string;
//   type: LedgerType;
// };

// export type Ledger = {
//   id: string;
//   name: string;
//   groupId: string;
//   openingBalance: number;
//   balanceType: 'debit' | 'credit';
//   address?: string;
//   email?: string;
//   phone?: string;
//   gstNumber?: string;
//   panNumber?: string;
//   type?: LedgerType;
// };

// export type VoucherType = 
//   | 'payment' 
//   | 'receipt' 
//   | 'contra' 
//   | 'journal' 
//   | 'sales' 
//   | 'purchase'
//   | 'debit-note'
//   | 'credit-note'
//   | 'stock-journal'
//   | 'delivery-note';

// export type VoucherEntry = {
//   id: string;
//   date: string;
//   type: VoucherType;
//   number: string;
//   narration?: string;
//   entries: VoucherEntryLine[];
//   mode?: 'item' | 'accounting' | 'voucher' | 'transfer' | 'adjustment';
//   referenceNo?: string;
//   partyId?: string;
//   dispatchDetails?: {
//     docNo: string;
//     through: string;
//     destination: string;
//   };
//   orderRef?: string;
//   termsOfDelivery?: string;
// };

// export type VoucherEntryLine = {
//   id: string;
//   ledgerId?: string;
//   itemId?: string;
//   amount: number;
//   type: 'debit' | 'credit' | 'source' | 'destination';
//   quantity?: number;
//   rate?: number;
//   gstRate?: number;
//   godownId?: string;
//   batchId?: string;
// };

// export type StockItem = {
//   id: string;
//   name: string;
//   unit: string;
//   openingBalance: number;
//   openingValue: number;
//   gstRate?: number;
//   hsnCode?: string;
// };

// export type UnitOfMeasurement = {
//   id: string;
//   name: string;
//   symbol: string;
// };

// export type Godown = {
//   id: string;
//   name: string;
// };



// export type CompanyInfo = {
//   name: string;
//   financialYear: string;
//   booksBeginningYear: string;
//   address: string;
//   pin: string;
//   phoneNumber: string;
//   email: string;
//   panNumber: string;
//   gstNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
// };

// export type StockItem = {
//   id: string;
//   name: string;
//   unit: string;
//   openingBalance: number;
//   openingValue: number;
//   gstRate: number;
//   hsnCode: string;
// };

// export type Ledger = {
//   id: string;
//   name: string;
//   groupId: string;
//   openingBalance: number;
//   balanceType: 'debit' | 'credit';
//   type?: 'capital' | 'loans' | 'fixed-assets' | 'current-assets' | 'current-liabilities' | 'purchase' | 'direct-expenses' | 'sales' | 'indirect-expenses' | 'indirect-income' | 'sundry-debtors' | 'sundry-creditors';
//   address?: string;
//   gstNumber?: string;
// };

// export type Godown = {
//   id: string;
//   name: string;
//   address?: string;
// };

// export type VoucherEntryLine = {
//   id: string;
//   itemId?: string;
//   ledgerId?: string;
//   quantity?: number;
//   rate?: number;
//   amount: number;
//   type: 'debit' | 'credit';
//   gstRate?: number;
//   godownId?: string;
//   discount?: number;
// };

// export type VoucherEntry = {
//   id: string;
//   date: string;
//   type: 'sales' | 'purchase' | 'stock-journal';
//   number: string;
//   narration: string;
//   referenceNo?: string;
//   partyId: string;
//   mode: 'item-invoice' | 'accounting-invoice' | 'as-voucher';
//   dispatchDetails?: {
//     docNo?: string;
//     through?: string;
//     destination?: string;
//   };
//   entries: VoucherEntryLine[];
//   termsOfDelivery?: string;
// };

// export type LedgerEntry = {
//   id: string;
//   ledgerId: string;
//   amount: number;
//   type: 'debit' | 'credit';
//   voucherId: string;
//   date: string;
// };


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
  vatNumber: string;

  state?: string;
  country?: string;
  taxType?: 'GST' | 'VAT';
  employeeId?: number;

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
  | 'indirect-income'
  | 'sundry-debtors'
  | 'sundry-creditors'
  | 'cash'
  | 'bank';

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
  type?: LedgerType;
};

export type VoucherType = 
  | 'payment' 
  | 'receipt' 
  | 'contra' 
  | 'journal' 
  | 'sales' 
  | 'purchase'
  | 'debit-note'
  | 'credit-note'
  | 'stock-journal'
  | 'delivery-note';

export type VoucherEntry = {
  id: string;
  date: string;
  type: VoucherType;
  number: string;
  narration?: string;
  entries: VoucherEntryLine[];
  mode?: 'item-invoice' | 'accounting-invoice' | 'as-voucher' | 'transfer' | 'adjustment';
  referenceNo?: string;
  partyId?: string;
  dispatchDetails?: {
    docNo: string;
    through: string;
    destination: string;
  };
  orderRef?: string;
  termsOfDelivery?: string;
};

export type VoucherEntryLine = {
  id: string;
  ledgerId?: string;
  itemId?: string;
  amount: number;
  type: 'debit' | 'credit' | 'source' | 'destination';
  quantity?: number;
  rate?: number;
  gstRate?: number;
  godownId?: string;
  batchId?: string;
  discount?: number;
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

export type Godown = {
  id: string;
  name: string;
};

export type LedgerEntry = {
  id: string;
  ledgerId: string;
  amount: number;
  type: 'debit' | 'credit';
  voucherId: string;
  date: string;
};