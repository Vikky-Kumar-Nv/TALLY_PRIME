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
// }




import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CompanyInfo, Ledger, LedgerGroup, VoucherEntry, StockItem, UnitOfMeasurement, Godown, StockGroup, GstClassification } from '../types';
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
  stockGroups: StockGroup[];
  gstClassifications: GstClassification[];
  units: UnitOfMeasurement[];
  godowns: Godown[];
  addLedgerGroup: (group: LedgerGroup) => void;
  addLedger: (ledger: Ledger) => void;
  addVoucher: (voucher: VoucherEntry) => void;
  updateVoucher: (id: string, updates: Partial<VoucherEntry>) => void;
  addStockItem: (item: StockItem) => void;
  addStockGroup: (group: StockGroup) => void;
  addGstClassification: (classification: GstClassification) => void;
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
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: 'i1', name: 'Item A', unit: '1', stockGroupId: 'sg1', openingBalance: 100, openingValue: 1000, gstRate: 18, hsnCode: '8517' },
    { id: 'i2', name: 'Item B', unit: '2', stockGroupId: 'sg2', openingBalance: 50, openingValue: 500, gstRate: 12, hsnCode: '6204' }
  ]);
  const [stockGroups, setStockGroups] = useState<StockGroup[]>([
    { id: 'sg1', name: 'Electronics', hsnCode: '8517', gstRate: 18 },
    { id: 'sg2', name: 'Clothing', hsnCode: '6204', gstRate: 12 }
  ]);
  const [gstClassifications, setGstClassifications] = useState<GstClassification[]>([
    { id: 'gc1', name: 'Electronics - 18%', hsnCode: '8517', gstRate: 18 },
    { id: 'gc2', name: 'Clothing - 12%', hsnCode: '6204', gstRate: 12 },
    { id: 'gc3', name: 'Food - 5%', hsnCode: '2106', gstRate: 5 }
  ]);
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

  const updateVoucher = (id: string, updates: Partial<VoucherEntry>) => {
    setVouchers(prev =>
      prev.map(voucher => (voucher.id === id ? { ...voucher, ...updates } : voucher))
    );
  };

  const addStockItem = (item: StockItem) => {
    setStockItems(prev => [...prev, { ...item, id: Math.random().toString(36).substring(2, 9) }]);
  };

  const addStockGroup = (group: StockGroup) => {
    setStockGroups(prev => [...prev, group]);
  };

  const addGstClassification = (classification: GstClassification) => {
    setGstClassifications(prev => [...prev, classification]);
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
      stockGroups,
      gstClassifications,
      units,
      godowns,
      addLedgerGroup,
      addLedger,
      addVoucher,
      updateVoucher,
      addStockItem,
      addStockGroup,
      addGstClassification,
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
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};