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
//   vatNumber: string;

//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
//   employeeId?: number;

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
//   | 'sundry-creditors'
//   | 'cash'
//   | 'bank'
//   | 'cgst' // Added for GST ledgers
//   | 'sgst'
//   | 'igst';

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
//   state?: string; // Added for GST state comparison
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
//   mode?: 'item-invoice' | 'accounting-invoice' | 'as-voucher' | 'transfer' | 'adjustment';
//   referenceNo?: string;
//   supplierInvoiceDate?: string; // Added for supplier invoice date
//   purchaseLedgerId?: string; // Added for purchase ledger
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
//   cgstRate?: number; // Added for CGST
//   sgstRate?: number; // Added for SGST
//   igstRate?: number; // Added for IGST
//   godownId?: string;
//   batchId?: string;
//   discount?: number;
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

// export type LedgerEntry = {
//   id: string;
//   ledgerId: string;
//   amount: number;
//   type: 'debit' | 'credit';
//   voucherId: string;
//   date: string;
// };

// export type AppContextType = {
//   theme: 'light' | 'dark';
//   companyInfo?: CompanyInfo;
//   stockItems?: StockItem[];
//   ledgers?: Ledger[];
//   ledgerGroups?: LedgerGroup[];
//   godowns?: Godown[];
//   vouchers?: VoucherEntry[];
//   addStockItem: (item: Omit<StockItem, 'id'>) => void;
//   updateStockItem: (id: string, item: Partial<StockItem>) => void;
//   addLedger: (ledger: Omit<Ledger, 'id'>) => void;
//   addLedgerGroup: (group: Omit<LedgerGroup, 'id'>) => void;
//   addVoucher: (voucher: VoucherEntry) => void;
//   addLedgerEntry: (entry: LedgerEntry) => void;
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
//   vatNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
//   employeeId?: number;
//   turnover?: number; 
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
//   vatNumber: string;
//   state?: string;
//   country?: string;
//   taxType?: 'GST' | 'VAT';
//   employeeId?: number;
//   turnover?: number;
//   registrationType?: string; 
//   assesseeOfOtherTerritory?: boolean; 
//   periodicityOfGstr1?: string; 
//   gstApplicableFrom?: string; 
//   eWayBillApplicable?: boolean;
//   eWayBillThresholdLimit?: string;
//   eWayBillIntrastate?: boolean;
//   provideLutBond?: boolean;
//   lutBondNumber?: string;
//   lutBondValidity?: string;
//   taxLiabilityOnAdvanceReceipts?: boolean;
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
//   | 'sundry-creditors'
//   | 'cash'
//   | 'bank'
//   | 'cgst'
//   | 'sgst'
//   | 'igst';

//  export type GroupNature = 'Assets' | 'Liabilities' | 'Income' | 'Expenses';

// export type LedgerGroup = {
//   id: string;
//   name: string;
//   alias?: string;
//   parent?: string;
//   type: LedgerType;
//   affectsGrossProfit?: boolean;
//   behavesLikeSubLedger: boolean;
//   nettBalancesForReporting: boolean;
//   usedForCalculation: boolean;
//   allocationMethod?: 'Appropriate by Qty' | 'Appropriate by Value' | 'No Appropriation';
//   gstDetails?: {
//     setAlterHSNSAC: boolean;
//     hsnSacClassificationId?: string;
//     hsnCode?: string;
//     setAlterGST: boolean;
//     gstClassificationId?: string;
//     typeOfSupply?: 'Goods' | 'Services';
//     taxability?: 'Taxable' | 'Exempt' | 'Nil-rated';
//     integratedTaxRate?: number;
//     cess?: number;
//   };
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
//   state?: string;
// };


// export type StockGroup = {
//   id: string;
//   name: string;
//   hsnCode?: string;
//   gstRate?: number;
// };


// export type GstClassification = {
//   id: string;
//   name: string;
//   hsnCode: string;
//   gstRate: number;
//   cess?: number;
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
//   mode?: 'item-invoice' | 'accounting-invoice' | 'as-voucher' | 'transfer' | 'adjustment';
//   referenceNo?: string;
//   supplierInvoiceDate?: string;
//   purchaseLedgerId?: string;
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
//   cgstRate?: number;
//   sgstRate?: number;
//   igstRate?: number;
//   godownId?: string;
//   batchId?: string;
//   discount?: number;
// };

// export type StockItem = {
//   id: string;
//   name: string;
//   unit: string;
//   openingBalance: number;
//   openingValue: number;
//   stockGroupId?: string; 
//   gstRate?: number;
//   hsnCode?: string;
//   taxType?: 'Taxable' | 'Exempt' | 'Nil-rated';
//   standardPurchaseRate?: number;
//   standardSaleRate?: number;
//   enableBatchTracking?: boolean;
//   batchDetails?: BatchDetails[];
//   godownAllocations?: GodownAllocation[];
//   allowNegativeStock?: boolean;
//   maintainInPieces?: boolean;
//   secondaryUnit?: string;
// };

// export type BatchDetails = {
//   id: string;
//   name: string;
//   expiryDate?: string;
//   manufacturingDate?: string;
// };

// export type GodownAllocation = {
//   godownId: string;
//   quantity: number;
//   value: number;
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

// export type LedgerEntry = {
//   id: string;
//   ledgerId: string;
//   amount: number;
//   type: 'debit' | 'credit';
//   voucherId: string;
//   date: string;
// };



export type CompanyInfo = {
  id?: string; // Added for AppContext compatibility
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
  turnover?: number;
  registrationType?: string;
  assesseeOfOtherTerritory?: boolean;
  periodicityOfGstr1?: string;
  gstApplicableFrom?: string;
  eWayBillApplicable?: boolean;
  eWayBillThresholdLimit?: string;
  eWayBillIntrastate?: boolean;
  provideLutBond?: boolean;
  lutBondNumber?: string;
  lutBondValidity?: string;
  taxLiabilityOnAdvanceReceipts?: boolean;
  godowns?: Godown[];
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
  | 'bank'
  | 'cgst'
  | 'sgst'
  | 'igst';

export type GroupNature = 'Assets' | 'Liabilities' | 'Income' | 'Expenses';

export type LedgerGroup = {
  id: string;
  name: string;
  alias?: string;
  parent?: string;
  type: LedgerType;
  affectsGrossProfit?: boolean;
  behavesLikeSubLedger: boolean;
  nettBalancesForReporting: boolean;
  usedForCalculation: boolean;
  allocationMethod?: 'Appropriate by Qty' | 'Appropriate by Value' | 'No Appropriation';
  gstDetails?: {
    setAlterHSNSAC: boolean;
    hsnSacClassificationId?: string;
    hsnCode?: string;
    setAlterGST: boolean;
    gstClassificationId?: string;
    typeOfSupply?: 'Goods' | 'Services';
    taxability?: 'Taxable' | 'Exempt' | 'Nil-rated';
    integratedTaxRate?: number;
    cess?: number;
  };
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
  state?: string;
};

export type StockGroup = {
  id: string;
  name: string;
  hsnCode?: string;
  gstRate?: number;
  parent?: string; // Added for hierarchical groups
  shouldQuantitiesBeAdded?: boolean;
  hsnSacDetails?: {
    setAlterHSNSAC: boolean;
    hsnSacClassificationId: string;
    hsnCode: string;
    description: string;
  };
  gstDetails?: {
    setAlterGST: boolean;
    gstClassificationId: string;
    taxability: string;
    integratedTaxRate: number;
    cess: number;
  };
};

export type GstClassification = {
  id: string;
  name: string;
  hsnCode: string;
  gstRate: number;
  cess?: number;
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
  supplierInvoiceDate?: string;
  purchaseLedgerId?: string;
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
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
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
  stockGroupId?: string;
  gstRate?: number;
  hsnCode?: string;
  taxType?: 'Taxable' | 'Exempt' | 'Nil-rated';
  standardPurchaseRate?: number;
  standardSaleRate?: number;
  enableBatchTracking?: boolean;
  batchDetails?: BatchDetails[];
  godownAllocations?: GodownAllocation[];
  allowNegativeStock?: boolean;
  maintainInPieces?: boolean;
  secondaryUnit?: string;
};

export type BatchDetails = {
  id: string;
  name: string;
  expiryDate?: string;
  manufacturingDate?: string;
};

export type GodownAllocation = {
  godownId: string;
  quantity: number;
  value: number;
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

// Added for convenience in reports
export type StockTransaction = {
  id: string;
  stockItemId: string;
  voucherId: string;
  voucherType: VoucherType;
  voucherNo: string;
  date: string;
  quantity: number; // Positive for inward, negative for outward
  rate: number;
  value: number;
  godownId?: string;
  batchId?: string;
};



export type Scenario = {
  id: string;
  name: string;
  includeActuals: boolean; // Yes/No for actuals
  includedVoucherTypes: VoucherType[];
  excludedVoucherTypes: VoucherType[];
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt?: string;
};