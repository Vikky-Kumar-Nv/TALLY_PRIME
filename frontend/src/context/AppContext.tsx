// import React, { createContext, useContext, useState } from 'react';
// import type { ReactNode } from 'react';
// import type { CompanyInfo, Ledger, LedgerGroup, VoucherEntry, StockItem, UnitOfMeasurement } from '../types';
// import { defaultLedgerGroups, defaultLedgers } from '../data/defaultData';

// type ThemeMode = 'light' | 'dark';

// interface AppContextProps {
//   theme: ThemeMode;
//   toggleTheme: () => void;
//   companyInfo: CompanyInfo | null;
//   setCompanyInfo: (info: CompanyInfo) => void;
//   ledgerGroups: LedgerGroup[];
//   ledgers: Ledger[];
//   vouchers: VoucherEntry[];
//   stockItems: StockItem[];
//   units: UnitOfMeasurement[];
//   addLedgerGroup: (group: LedgerGroup) => void;
//   addLedger: (ledger: Ledger) => void;
//   addVoucher: (voucher: VoucherEntry) => void;
//   addStockItem: (item: StockItem) => void;
//   addUnit: (unit: UnitOfMeasurement) => void;
// }

// const AppContext = createContext<AppContextProps | undefined>(undefined);

// export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [theme, setTheme] = useState<ThemeMode>('light');
//   const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
//   const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>(defaultLedgerGroups);
//   const [ledgers, setLedgers] = useState<Ledger[]>(defaultLedgers);
//   const [vouchers, setVouchers] = useState<VoucherEntry[]>([]);
//   const [stockItems, setStockItems] = useState<StockItem[]>([]);
//   const [units, setUnits] = useState<UnitOfMeasurement[]>([
//     { id: '1', name: 'Number', symbol: 'Nos' },
//     { id: '2', name: 'Kilogram', symbol: 'Kg' },
//     { id: '3', name: 'Meter', symbol: 'Mtr' }
//   ]);

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   const addLedgerGroup = (group: LedgerGroup) => {
//     setLedgerGroups(prev => [...prev, group]);
//   };

//   const addLedger = (ledger: Ledger) => {
//     setLedgers(prev => [...prev, ledger]);
//   };

//   const addVoucher = (voucher: VoucherEntry) => {
//     setVouchers(prev => [...prev, voucher]);
//   };

//   const addStockItem = (item: StockItem) => {
//     setStockItems(prev => [...prev, item]);
//   };

//   const addUnit = (unit: UnitOfMeasurement) => {
//     setUnits(prev => [...prev, unit]);
//   };

//   return (
//     <AppContext.Provider value={{
//       theme,
//       toggleTheme,
//       companyInfo,
//       setCompanyInfo,
//       ledgerGroups,
//       ledgers,
//       vouchers,
//       stockItems,
//       units,
//       addLedgerGroup,
//       addLedger,
//       addVoucher,
//       addStockItem,
//       addUnit
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }
//   return context;
// };




// import React, { createContext, useContext, useState } from 'react';
// import type { ReactNode } from 'react';
// import type { CompanyInfo, Ledger, LedgerGroup, VoucherEntry, StockItem, UnitOfMeasurement, Godown } from '../types';
// import { defaultLedgerGroups, defaultLedgers } from '../data/defaultData';

// type ThemeMode = 'light' | 'dark';

// interface AppContextProps {
//   theme: ThemeMode;
//   toggleTheme: () => void;
//   companyInfo: CompanyInfo | null;
//   setCompanyInfo: (info: CompanyInfo) => void;
//   ledgerGroups: LedgerGroup[];
//   ledgers: Ledger[];
//   vouchers: VoucherEntry[];
//   stockItems: StockItem[];
//   units: UnitOfMeasurement[];
//   godowns: Godown[];
//   addLedgerGroup: (group: LedgerGroup) => void;
//   addLedger: (ledger: Ledger) => void;
//   addVoucher: (voucher: VoucherEntry) => void;
//   addStockItem: (item: StockItem) => void;
//   addUnit: (unit: UnitOfMeasurement) => void;
//   addGodown: (godown: Godown) => void;
//   updateStockItem: (id: string, updates: Partial<StockItem>) => void;
// }

// const AppContext = createContext<AppContextProps | undefined>(undefined);

// export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [theme, setTheme] = useState<ThemeMode>('light');
//   const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
//   const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>(defaultLedgerGroups);
//   const [ledgers, setLedgers] = useState<Ledger[]>(defaultLedgers);
//   const [vouchers, setVouchers] = useState<VoucherEntry[]>([]);
//   const [stockItems, setStockItems] = useState<StockItem[]>([]);
//   const [units, setUnits] = useState<UnitOfMeasurement[]>([
//     { id: '1', name: 'Number', symbol: 'Nos' },
//     { id: '2', name: 'Kilogram', symbol: 'Kg' },
//     { id: '3', name: 'Meter', symbol: 'Mtr' }
//   ]);
//   const [godowns, setGodowns] = useState<Godown[]>([
//     { id: 'g1', name: 'Main Godown' },
//     { id: 'g2', name: 'Secondary Godown' }
//   ]);

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   const addLedgerGroup = (group: LedgerGroup) => {
//     setLedgerGroups(prev => [...prev, group]);
//   };

//   const addLedger = (ledger: Ledger) => {
//     setLedgers(prev => [...prev, ledger]);
//   };

//   const addVoucher = (voucher: VoucherEntry) => {
//     setVouchers(prev => [...prev, voucher]);
//   };

//   const addStockItem = (item: StockItem) => {
//     setStockItems(prev => [...prev, item]);
//   };

//   const addUnit = (unit: UnitOfMeasurement) => {
//     setUnits(prev => [...prev, unit]);
//   };

//   const addGodown = (godown: Godown) => {
//     setGodowns(prev => [...prev, godown]);
//   };

//   const updateStockItem = (id: string, updates: Partial<StockItem>) => {
//     setStockItems(prev =>
//       prev.map(item => (item.id === id ? { ...item, ...updates } : item))
//     );
//   };

//   return (
//     <AppContext.Provider value={{
//       theme,
//       toggleTheme,
//       companyInfo,
//       setCompanyInfo,
//       ledgerGroups,
//       ledgers,
//       vouchers,
//       stockItems,
//       units,
//       godowns,
//       addLedgerGroup,
//       addLedger,
//       addVoucher,
//       addStockItem,
//       addUnit,
//       addGodown,
//       updateStockItem
//     }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error('useAppContext must be used within an AppProvider');
//   }
//   return context;
// };





import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CompanyInfo, Ledger, LedgerGroup, VoucherEntry, StockItem, UnitOfMeasurement, Godown } from '../types';
import { defaultLedgerGroups, defaultLedgers } from '../data/defaultData';

type ThemeMode = 'light' | 'dark';

interface AppContextProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  companyInfo: CompanyInfo | null;
  setCompanyInfo: (info: CompanyInfo) => void;
  ledgerGroups: LedgerGroup[];
  ledgers: Ledger[];
  vouchers: VoucherEntry[];
  stockItems: StockItem[];
  units: UnitOfMeasurement[];
  godowns: Godown[];
  addLedgerGroup: (group: LedgerGroup) => void;
  addLedger: (ledger: Ledger) => void;
  addVoucher: (voucher: VoucherEntry) => void;
  addStockItem: (item: StockItem) => void;
  addUnit: (unit: UnitOfMeasurement) => void;
  addGodown: (godown: Godown) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [ledgerGroups, setLedgerGroups] = useState<LedgerGroup[]>(defaultLedgerGroups);
  const [ledgers, setLedgers] = useState<Ledger[]>(defaultLedgers);
  const [vouchers, setVouchers] = useState<VoucherEntry[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [units, setUnits] = useState<UnitOfMeasurement[]>([
    { id: '1', name: 'Number', symbol: 'Nos' },
    { id: '2', name: 'Kilogram', symbol: 'Kg' },
    { id: '3', name: 'Meter', symbol: 'Mtr' }
  ]);
  const [godowns, setGodowns] = useState<Godown[]>([
    { id: 'g1', name: 'Main Godown' },
    { id: 'g2', name: 'Secondary Godown' }
  ]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addLedgerGroup = (group: LedgerGroup) => {
    setLedgerGroups(prev => [...prev, group]);
  };

  const addLedger = (ledger: Ledger) => {
    setLedgers(prev => [...prev, ledger]);
  };

  const addVoucher = (voucher: VoucherEntry) => {
    setVouchers(prev => [...prev, voucher]);
  };

  const addStockItem = (item: StockItem) => {
    setStockItems(prev => [...prev, item]);
  };

  const addUnit = (unit: UnitOfMeasurement) => {
    setUnits(prev => [...prev, unit]);
  };

  const addGodown = (godown: Godown) => {
    setGodowns(prev => [...prev, godown]);
  };

  const updateStockItem = (id: string, updates: Partial<StockItem>) => {
    setStockItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      companyInfo,
      setCompanyInfo,
      ledgerGroups,
      ledgers,
      vouchers,
      stockItems,
      units,
      godowns,
      addLedgerGroup,
      addLedger,
      addVoucher,
      addStockItem,
      addUnit,
      addGodown,
      updateStockItem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}