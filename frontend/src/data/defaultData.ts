import type { LedgerGroup, Ledger } from '../types';

export const defaultLedgerGroups: LedgerGroup[] = [
  // Primary Groups
  { 
    id: '1', 
    name: 'Capital Account', 
    type: 'capital',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '2', 
    name: 'Loans (Liability)', 
    type: 'loans',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '3', 
    name: 'Current Liabilities', 
    type: 'current-liabilities',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '4', 
    name: 'Fixed Assets', 
    type: 'fixed-assets',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '5', 
    name: 'Current Assets', 
    type: 'current-assets',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '6', 
    name: 'Purchases', 
    type: 'purchase',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '7', 
    name: 'Direct Expenses', 
    type: 'direct-expenses',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '8', 
    name: 'Sales', 
    type: 'sales',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '9', 
    name: 'Indirect Expenses', 
    type: 'indirect-expenses',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '10', 
    name: 'Indirect Income', 
    type: 'indirect-income',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },

  // Sub-groups
  { 
    id: '11', 
    name: 'Bank Accounts', 
    parent: '5', 
    type: 'bank',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '12', 
    name: 'Cash-in-hand', 
    parent: '5', 
    type: 'cash',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '13', 
    name: 'Sundry Debtors', 
    parent: '5', 
    type: 'sundry-debtors',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '14', 
    name: 'Sundry Creditors', 
    parent: '3', 
    type: 'sundry-creditors',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
  { 
    id: '15', 
    name: 'Duties & Taxes', 
    parent: '3', 
    type: 'current-liabilities',
    behavesLikeSubLedger: false,
    nettBalancesForReporting: true,
    usedForCalculation: false
  },
];

export const defaultLedgers: Ledger[] = [
  {
    id: '1',
    name: 'Cash',
    groupId: '12',
    openingBalance: 50000,
    balanceType: 'debit'
  },
  {
    id: '2',
    name: 'Bank Account',
    groupId: '11',
    openingBalance: 100000,
    balanceType: 'debit'
  },
  {
    id: '3',
    name: 'Capital',
    groupId: '1',
    openingBalance: 150000,
    balanceType: 'credit'
  },
  {
    id: '4',
    name: 'Sales Account',
    groupId: '8',
    openingBalance: 0,
    balanceType: 'credit'
  },
  {
    id: '5',
    name: 'Purchase Account',
    groupId: '6',
    openingBalance: 0,
    balanceType: 'debit'
  }
];

export const keyboardShortcuts = {
  'Alt+F1': 'Company Info',
  'Alt+F2': 'Date',
  'Alt+F3': 'Masters',
  'Alt+F4': 'Exit',
  'Alt+F5': 'Vouchers',
  'Alt+F9': 'Reports',
  'Alt+F10': 'Accounts',
  'Alt+F11': 'Inventory',
  'Alt+F12': 'Configuration',
  'Ctrl+A': 'Alter',
  'Ctrl+D': 'Delete',
  'Ctrl+C': 'Create',
  'Ctrl+N': 'New Voucher',
  'Ctrl+P': 'Print',
  'Ctrl+Q': 'Quit',
  'Ctrl+V': 'View',
  'Esc': 'Close/Back',
  'F1': 'Help',
  'F2': 'Change Period',
  'F5': 'Refresh',
  'F7': 'Show Ledger',
  'F8': 'Journal',
  'F9': 'Save',
  'F10': 'Calculator',
  'F11': 'Options',
  'F12': 'Configure'
};