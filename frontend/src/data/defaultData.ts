import type { LedgerGroup, Ledger } from '../types';

export const defaultLedgerGroups: LedgerGroup[] = [
  // Primary Groups
  { id: '1', name: 'Capital Account', type: 'capital' },
  { id: '2', name: 'Loans (Liability)', type: 'loans' },
  { id: '3', name: 'Current Liabilities', type: 'current-liabilities' },
  { id: '4', name: 'Fixed Assets', type: 'fixed-assets' },
  { id: '5', name: 'Current Assets', type: 'current-assets' },
  { id: '6', name: 'Purchases', type: 'purchase' },
  { id: '7', name: 'Direct Expenses', type: 'direct-expenses' },
  { id: '8', name: 'Sales', type: 'sales' },
  { id: '9', name: 'Indirect Expenses', type: 'indirect-expenses' },
  { id: '10', name: 'Indirect Income', type: 'indirect-income' },

  // Sub-groups
  { id: '11', name: 'Bank Accounts', parent: '5', type: 'current-assets' },
  { id: '12', name: 'Cash-in-hand', parent: '5', type: 'current-assets' },
  { id: '13', name: 'Sundry Debtors', parent: '5', type: 'current-assets' },
  { id: '14', name: 'Sundry Creditors', parent: '3', type: 'current-liabilities' },
  { id: '15', name: 'Duties & Taxes', parent: '3', type: 'current-liabilities' },
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