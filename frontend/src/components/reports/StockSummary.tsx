import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';
import ReportTable from './ReportTable';
import type { StockItem, StockGroup } from '../../types';

// Define types for summary data
interface ItemSummary {
  item: StockItem;
  inwardQty: number;
  outwardQty: number;
  closingQty: number;
  closingValue: number;
  profit: number;
}

interface GroupSummary {
  group: StockGroup;
  inwardQty: number;
  outwardQty: number;
  closingQty: number;
  closingValue: number;
  profit: number;
}

const StockSummary: React.FC = () => {
  const { theme, stockGroups, companyInfo, godowns } = useAppContext();
  const navigate = useNavigate();
   const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Added 'HSN' view for HSN-wise summary similar to Tally
  const [view, setView] = useState<'Item' | 'Group' | 'HSN'>('Item'); 
   type RawItemRow = {
     item?: StockItem & { openingBalance?: number };
     group?: StockGroup;
     inwardQty?: number;
     outwardQty?: number;
     closingQty?: number;
     closingValue?: number;
     profit?: number;
     unit?: string;
     openingBalance?: number; // some APIs might return directly
     name?: string; // fallback name
   };
   const [data, setData] = useState<RawItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    fromDate: companyInfo?.financialYear ? companyInfo.financialYear.split('-')[0] + '-04-01' : '2025-04-01',
    toDate: new Date().toISOString().slice(0, 10),
    stockGroupId: '',
    stockItemId: '',
    godownId: '',
    batchId: '',
    period: 'Monthly',
    basis: 'Quantity' as 'Quantity' | 'Value' | 'Cost',
    show: false,
  });
// Fetch data on filters change
  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.fromDate) params.append('fromDate', filters.fromDate);
        if (filters.toDate) params.append('toDate', filters.toDate);
        if (filters.stockGroupId) params.append('stockGroupId', filters.stockGroupId);
        if (filters.stockItemId) params.append('stockItemId', filters.stockItemId);
        if (filters.godownId) params.append('godownId', filters.godownId);
        if (filters.batchId) params.append('batchId', filters.batchId);
        if (filters.period) params.append('period', filters.period);
        if (filters.basis) params.append('basis', filters.basis);
        if (filters.show) params.append('show', String(filters.show));

  const response = await fetch(`https://tally-backend-dyn3.onrender.com/api/stock-summary?${params.toString()}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `Error: ${response.status}`);
        }
        const json = await response.json();

        setData(json);
      }
      catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load data';
        setError(message);
        setData([]);
      }
      finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [filters]);
// Compute grouped data if view is Group, else use data directly
  const groupedData = useMemo(() => {
    if (view === 'Group') {
  const groupsMap = new Map<string, GroupSummary>();
      data.forEach(item => {
        const groupId = item.item?.stockGroupId || item.group?.id || 'unknown';
        if (!groupsMap.has(groupId)) {
          const group = stockGroups.find(g => g.id === groupId);
          if (!group) return;
          groupsMap.set(groupId, {
            group,
            inwardQty: 0,
            outwardQty: 0,
            closingQty: 0,
            closingValue: 0,
            profit: 0
          });
        }
        const grp = groupsMap.get(groupId);
        if (grp) {
          grp.inwardQty += item.inwardQty ?? 0;
          grp.outwardQty += item.outwardQty ?? 0;
          grp.closingQty += item.closingQty ?? 0;
          grp.closingValue += item.closingValue ?? 0;
          grp.profit += item.profit ?? 0;
        }
      });
      return Array.from(groupsMap.values());
    }
    return data;
  }, [data, view, stockGroups]);

  // Compute HSN-wise grouped data when view is HSN
  interface HsnSummary {
    hsnCode: string;
    inwardQty: number;
    outwardQty: number;
    closingQty: number;
    closingValue: number;
    profit: number;
    openingQty: number;
  }

  const hsnData = useMemo(() => {
    if (view !== 'HSN') return [] as HsnSummary[];
    const map = new Map<string, HsnSummary>();
    data.forEach(row => {
      const code = row.item?.hsnCode || 'Unknown';
      if (!map.has(code)) {
        map.set(code, {
          hsnCode: code,
          inwardQty: 0,
          outwardQty: 0,
          closingQty: 0,
          closingValue: 0,
          profit: 0,
          openingQty: 0,
        });
      }
      const rec = map.get(code)!;
      rec.inwardQty += row.inwardQty ?? 0;
      rec.outwardQty += row.outwardQty ?? 0;
      rec.closingQty += row.closingQty ?? 0;
      rec.closingValue += row.closingValue ?? 0;
      rec.profit += row.profit ?? 0;
      rec.openingQty += row.openingBalance ?? row.item?.openingBalance ?? 0;
    });
    return Array.from(map.values());
  }, [data, view]);

  // Define your columns (adjust accessors/renderers for your data)
  interface ColumnDef {
    header: string;
    accessor: string;
    align: 'left' | 'right' | 'center';
    // Allow render to accept any row variant used across views
    render?: (row: RawItemRow | GroupSummary | HsnSummary) => React.ReactNode;
  }
  const columns: ColumnDef[] = useMemo(() => {
    if (view === 'HSN') {
      const hsnCols: ColumnDef[] = [
        { header: 'HSN Code', accessor: 'hsnCode', align: 'left', render: (row) => (row as HsnSummary).hsnCode },
        { header: 'Opening Qty', accessor: 'openingQty', align: 'right', render: (row) => (row as HsnSummary).openingQty.toLocaleString() },
        { header: 'Inward Qty', accessor: 'inwardQty', align: 'right', render: (row) => (row as HsnSummary).inwardQty.toLocaleString() },
        { header: 'Outward Qty', accessor: 'outwardQty', align: 'right', render: (row) => (row as HsnSummary).outwardQty.toLocaleString() },
        { header: 'Closing Qty', accessor: 'closingQty', align: 'right', render: (row) => (row as HsnSummary).closingQty.toLocaleString() },
        { header: 'Closing Value', accessor: 'closingValue', align: 'right', render: (row) => `₹${(row as HsnSummary).closingValue.toLocaleString()}` },
      ];
      if (filters.show) {
        hsnCols.push({ header: 'Profit', accessor: 'profit', align: 'right', render: (row) => `₹${(row as HsnSummary).profit.toLocaleString()}` });
      }
      return hsnCols;
    }
    const base: ColumnDef[] = [
      {
        header: view === 'Item' ? 'Stock Item' : 'Stock Group',
        accessor: 'name',
        align: 'left',
        render: (row) =>
          view === 'Item'
            ? (row as RawItemRow).item?.name || (row as RawItemRow).name || ''
            : (row as GroupSummary).group?.name || '',
      },
      // HSN column only for Item view (not Group)
      ...(view === 'Item' ? [{
        header: 'HSN Code',
        accessor: 'hsnCode',
        align: 'left' as const,
        render: (row: RawItemRow) => row.item?.hsnCode || '-',
      }] : []),
      {
        header: 'Unit',
        accessor: 'unit',
        align: 'left',
        render: (row) => view === 'Item' ? (row as RawItemRow).unit || '' : '',
      },
      {
        header: 'Opening Qty',
        accessor: 'openingBalance',
        align: 'right',
        render: (row) => view === 'Item'
          ? ((row as RawItemRow).openingBalance ?? (row as RawItemRow).item?.openingBalance ?? 0).toLocaleString()
          : '',
      },
      {
        header: 'Inward Qty',
        accessor: 'inwardQty',
        align: 'right',
        render: (row) => ((row as RawItemRow | GroupSummary).inwardQty ?? 0).toLocaleString(),
      },
      {
        header: 'Outward Qty',
        accessor: 'outwardQty',
        align: 'right',
        render: (row) => ((row as RawItemRow | GroupSummary).outwardQty ?? 0).toLocaleString(),
      },
      {
        header: 'Closing Qty',
        accessor: 'closingQty',
        align: 'right',
        render: (row) => ((row as RawItemRow | GroupSummary).closingQty ?? 0).toLocaleString(),
      },
      {
        header: 'Closing Value',
        accessor: 'closingValue',
        align: 'right',
        render: (row) => `₹${((row as RawItemRow | GroupSummary).closingValue ?? 0).toLocaleString()}`,
      },
      ...(filters.show
        ? [{
            header: 'Profit',
            accessor: 'profit',
            align: 'right' as const,
            render: (row: RawItemRow | GroupSummary) => `₹${((row as RawItemRow | GroupSummary).profit ?? 0).toLocaleString()}`,
          }]
        : []),
    ];
    return base;
  }, [view, filters.show]);

  // Footer totals
  const footer = useMemo(() => {
    // Totals always derived from raw item-level data for consistency
    const totalOpening = data.reduce((sum, r) => sum + (r.item?.openingBalance || r.openingBalance || 0), 0);
    const totalInward = data.reduce((sum, r) => sum + (r.inwardQty || 0), 0);
    const totalOutward = data.reduce((sum, r) => sum + (r.outwardQty || 0), 0);
    const totalClosingQty = data.reduce((sum, r) => sum + (r.closingQty || 0), 0);
    const totalClosingValue = data.reduce((sum, r) => sum + (r.closingValue || 0), 0);
    const totalProfit = data.reduce((sum, r) => sum + (r.profit || 0), 0);

    if (view === 'HSN') {
      return [
        { accessor: 'hsnCode', value: 'Total' },
        { accessor: 'openingQty', value: totalOpening.toLocaleString() },
        { accessor: 'inwardQty', value: totalInward.toLocaleString() },
        { accessor: 'outwardQty', value: totalOutward.toLocaleString() },
        { accessor: 'closingQty', value: totalClosingQty.toLocaleString() },
        { accessor: 'closingValue', value: `₹${totalClosingValue.toLocaleString()}` },
        ...(filters.show ? [{ accessor: 'profit', value: `₹${totalProfit.toLocaleString()}` }] : []),
      ];
    }
    return [
      { accessor: 'name', value: 'Total' },
      ...(view === 'Item' ? [{ accessor: 'hsnCode', value: '' }] : []),
      { accessor: 'unit', value: '' },
      { accessor: 'openingQty', value: totalOpening.toLocaleString() },
      { accessor: 'inwardQty', value: totalInward.toLocaleString() },
      { accessor: 'outwardQty', value: totalOutward.toLocaleString() },
      { accessor: 'closingQty', value: totalClosingQty.toLocaleString() },
      { accessor: 'closingValue', value: `₹${totalClosingValue.toLocaleString()}` },
      ...(filters.show ? [{ accessor: 'profit', value: `₹${totalProfit.toLocaleString()}` }] : []),
    ];
  }, [data, filters.show, view]);


  
  

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Stock Summary</title><style>body{font-family:Arial,sans-serif;padding:20px}h1{font-size:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd}</style></head>
          <body>
            <h1>${companyInfo?.name || 'Hanuman Car Wash'} - Stock Summary</h1>
            <p>From ${filters.fromDate} to ${filters.toDate}</p>
            <table>
              <thead>
                <tr>${columns.map(col => `<th style="text-align:${col.align}">${col.header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${
                  columns.map(col => `<td style="text-align:${col.align}">${col.render ? col.render(row) : (row as Record<string, unknown>)[col.accessor]}</td>`).join('')
                }</tr>`).join('')}
              </tbody>
              <tfoot>
                <tr>${footer.map(f => `<td style="text-align:${columns.find(c => c.accessor === f.accessor)?.align}">${f.value}</td>`).join('')}</tr>
              </tfoot>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [companyInfo?.name, filters.fromDate, filters.toDate, columns, data, footer]);

  const handleExport = useCallback(() => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...data.map(row => columns.map(col => col.render ? col.render(row) : (row as Record<string, unknown>)[col.accessor]).join(',')),
      footer.map(f => f.value).join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, data, footer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        setFilters({ ...filters }); // Trigger re-render
      } else if (e.key === 'F12') {
        e.preventDefault();
        alert('Configuration options not implemented yet.');
      } else if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        handleExport();
      } else if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters, handleExport, handlePrint]);

  return (
    <div className="pt-[56px] px-4">
      <div className="flex items-center mb-6">
        <button
          title="Back to Reports"
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Stock Summary</h1>
        <div className="ml-auto flex space-x-2">
          <select
          title="View Type"
            value={view}
            onChange={(e) => setView(e.target.value as 'Item' | 'Group' | 'HSN')}
            className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="Item">Stock Item-wise</option>
            <option value="Group">Stock Group-wise</option>
            <option value="HSN">HSN-wise</option>
          </select>
          <button
            title="Toggle Filters"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Filter size={18} />
          </button>
          <button
            title="Print Report"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
          <button
            title="Download Report"
            onClick={handleExport}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Godown</label>
              <select
                title="Filter by Godown"
                value={filters.godownId}
                onChange={(e)=> setFilters(f=>({...f, godownId: e.target.value }))}
                className={`w-full p-2 rounded border ${theme==='dark'?'bg-gray-700 border-gray-600':'bg-white border-gray-300'}`}
              >
                <option value="">All Godowns</option>
                {godowns.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input
                title="From Date"
                type="date"
                value={filters.fromDate}
                onChange={(e)=> setFilters(f=>({...f, fromDate: e.target.value }))}
                className={`w-full p-2 rounded border ${theme==='dark'?'bg-gray-700 border-gray-600':'bg-white border-gray-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                title="To Date"
                type="date"
                value={filters.toDate}
                onChange={(e)=> setFilters(f=>({...f, toDate: e.target.value }))}
                className={`w-full p-2 rounded border ${theme==='dark'?'bg-gray-700 border-gray-600':'bg-white border-gray-300'}`}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={()=> setFilters(f=>({...f}))}
                className={`px-4 py-2 rounded font-medium ${theme==='dark'?'bg-blue-600 hover:bg-blue-700 text-white':'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >Apply</button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
  <div className="mb-4 text-center">
    <h2 className="text-xl font-bold">Stock Summary Report</h2>
    <p className="text-sm opacity-75">
      From {filters.fromDate} to {filters.toDate}
    </p>
  </div>

  {loading && <p>Loading...</p>}
  {error && <p className="text-red-600">{error}</p>}

  {!loading && !error && (
    <ReportTable
      theme={theme}
      columns={columns}
      data={view === 'Group' ? groupedData : view === 'HSN' ? hsnData : data}
      footer={footer}
      onRowClick={(row) => {
        if (view === 'Item') {
          navigate(`/reports/movement-analysis?itemId=${(row as ItemSummary).item.id ?? ''}`);
        } else if (view === 'Group') {
          navigate(`/reports/movement-analysis?groupId=${(row as GroupSummary).group.id ?? ''}`);
        }
        // No navigation for HSN rows (could be extended later)
      }}
    />
  )}
</div>


      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> F5 to refresh, F12 to configure, Ctrl+E to export, Ctrl+P to print.
        </p>
      </div>
    </div>
  );
};

export default StockSummary;