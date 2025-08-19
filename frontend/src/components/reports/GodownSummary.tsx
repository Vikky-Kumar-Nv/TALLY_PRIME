import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';

interface GodownSummaryRow {
  godownId: number;
  godownName: string;
  itemId: number;
  itemName: string;
  unit: string;
  quantity: number; // decimal
  rate: number; // decimal
  value: number; // decimal
}

interface GodownAggregateRow {
  godownId: number;
  godownName: string;
  totalItems: number;
  totalQuantity: number;
  avgRate: number;
  totalValue: number;
}

const GodownSummary: React.FC = () => {
  const { theme, godowns } = useAppContext();
  const navigate = useNavigate();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [view, setView] = useState<'Detailed' | 'Godown'>('Detailed');
  const [search, setSearch] = useState('');

  // Filters state - add godown filter and asOnDate if needed
  const [filters, setFilters] = useState({
    godownId: '',
    asOnDate: new Date().toISOString().slice(0, 10),
  });

  const [data, setData] = useState<GodownSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on filter change
  useEffect(() => {
    async function fetchGodownSummary() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.godownId) params.append('godownId', filters.godownId);
        if (filters.asOnDate) params.append('asOnDate', filters.asOnDate);

  const res = await fetch(`https://tally-backend-dyn3.onrender.com/api/godown-summary?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Error: ${res.status}`);
        }

        const json: GodownSummaryRow[] = await res.json();
        setData(json);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load';
        setError(message);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGodownSummary();
  }, [filters]);

  // Filtered detailed data (client-side search by item or godown name)
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter(r =>
      r.itemName.toLowerCase().includes(term) ||
      r.godownName.toLowerCase().includes(term)
    );
  }, [data, search]);

  // Aggregated godown-wise data
  const godownAggregates: GodownAggregateRow[] = useMemo(() => {
    if (view !== 'Godown') return [];
    const map = new Map<number, GodownAggregateRow>();
    filteredData.forEach(r => {
      if (!map.has(r.godownId)) {
        map.set(r.godownId, {
          godownId: r.godownId,
            godownName: r.godownName,
            totalItems: 0,
            totalQuantity: 0,
            avgRate: 0,
            totalValue: 0,
        });
      }
      const agg = map.get(r.godownId)!;
      agg.totalItems += 1;
      agg.totalQuantity += r.quantity;
      agg.totalValue += r.value;
    });
    // compute avg rate
    map.forEach(agg => {
      agg.avgRate = agg.totalQuantity ? agg.totalValue / agg.totalQuantity : 0;
    });
    return Array.from(map.values()).sort((a,b)=>a.godownName.localeCompare(b.godownName));
  }, [filteredData, view]);

  const totalQuantity = useMemo(()=> filteredData.reduce((s,r)=>s+r.quantity,0),[filteredData]);
  const totalValue = useMemo(()=> filteredData.reduce((s,r)=>s+r.value,0),[filteredData]);
  const totalGodownQuantity = useMemo(()=> godownAggregates.reduce((s,r)=>s+r.totalQuantity,0),[godownAggregates]);
  const totalGodownValue = useMemo(()=> godownAggregates.reduce((s,r)=>s+r.totalValue,0),[godownAggregates]);

  const handlePrint = useCallback(()=>{
    let rowsHtml: string;
    if (view === 'Detailed') {
      rowsHtml = filteredData.map(r => `<tr><td>${r.godownName}</td><td>${r.itemName}</td><td>${r.unit}</td><td style="text-align:right">${r.quantity.toLocaleString()}</td><td style="text-align:right">₹${r.rate.toLocaleString()}</td><td style="text-align:right">₹${r.value.toLocaleString()}</td></tr>`).join('');
    } else {
      rowsHtml = godownAggregates.map(g => `<tr><td>${g.godownName}</td><td style="text-align:right">${g.totalItems}</td><td style="text-align:right">${g.totalQuantity.toLocaleString()}</td><td style="text-align:right">₹${g.avgRate.toLocaleString(undefined,{maximumFractionDigits:2})}</td><td style="text-align:right">₹${g.totalValue.toLocaleString()}</td></tr>`).join('');
    }
    const footerHtml = view === 'Detailed'
      ? `<tr><td colspan="3" style="text-align:right;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">${totalQuantity.toLocaleString()}</td><td></td><td style="text-align:right;font-weight:bold">₹${totalValue.toLocaleString()}</td></tr>`
      : `<tr><td style="text-align:right;font-weight:bold">Total</td><td style="text-align:right;font-weight:bold">${godownAggregates.reduce((s,r)=>s+r.totalItems,0)}</td><td style="text-align:right;font-weight:bold">${totalGodownQuantity.toLocaleString()}</td><td></td><td style="text-align:right;font-weight:bold">₹${totalGodownValue.toLocaleString()}</td></tr>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>Godown Summary</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px;font-size:12px}th{background:#eee}</style></head><body><h2>Godown Summary - ${view} View</h2><p>As on ${filters.asOnDate}</p><table><thead>${view==='Detailed'?'<tr><th>Godown</th><th>Stock Item</th><th>Unit</th><th>Quantity</th><th>Rate</th><th>Value</th></tr>':'<tr><th>Godown</th><th>Items</th><th>Total Qty</th><th>Avg Rate</th><th>Total Value</th></tr>'}</thead><tbody>${rowsHtml}</tbody><tfoot>${footerHtml}</tfoot></table></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  },[view, filteredData, godownAggregates, totalQuantity, totalValue, totalGodownQuantity, totalGodownValue, filters.asOnDate]);

  const handleExport = useCallback(()=>{
    const headers = view === 'Detailed'
      ? ['Godown','Stock Item','Unit','Quantity','Rate','Value']
      : ['Godown','Items','Total Qty','Avg Rate','Total Value'];
    const rows = view === 'Detailed'
      ? filteredData.map(r => [r.godownName, r.itemName, r.unit, r.quantity, r.rate, r.value])
      : godownAggregates.map(g => [g.godownName, g.totalItems, g.totalQuantity, g.avgRate, g.totalValue]);
    const csv = [headers.join(','), ...rows.map(r=>r.join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `godown_summary_${view.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },[view, filteredData, godownAggregates]);

  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F5') { e.preventDefault(); setFilters(f=>({...f})); }
      if (e.ctrlKey && e.key.toLowerCase() === 'p') { e.preventDefault(); handlePrint(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'e') { e.preventDefault(); handleExport(); }
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  },[handlePrint, handleExport, filters]);

  return (
    <div className="pt-[56px] px-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          title="Back to Reports"
          onClick={() => navigate('/app/reports')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
  <h1 className="text-2xl font-bold">Godown Summary</h1>
        <div className="ml-auto flex space-x-2">
          <div className="hidden md:block">
            <input
              title="Search"
              type="text"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
              placeholder="Search..."
              className={`p-2 rounded border text-sm ${theme==='dark'?'bg-gray-700 border-gray-600':'bg-white border-gray-300'}`}
            />
          </div>
          <button
            title="Toggle Filters"
            type="button"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Filter size={18} />
          </button>
          <button
            title="Print Report"
            type="button"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
          <button
            title="Download Report"
            type="button"
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
              <label className="block text-sm font-medium mb-1">View</label>
              <select
                title="Select View"
                value={view}
                onChange={(e)=> setView(e.target.value as 'Detailed'|'Godown')}
                className={`w-full p-2 rounded border ${theme==='dark'?'bg-gray-700 border-gray-600':'bg-white border-gray-300'}`}
              >
                <option value="Detailed">Detailed (Item-wise)</option>
                <option value="Godown">Godown-wise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Godown</label>
              <select
                title="Select Godown"
                value={filters.godownId}
                onChange={(e) => setFilters(f => ({ ...f, godownId: e.target.value }))}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="">All Godowns</option>
                {godowns.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">As on Date</label>
              <input
                title="Select Date"
                type="date"
                value={filters.asOnDate}
                onChange={(e) => setFilters(f => ({ ...f, asOnDate: e.target.value }))}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Summary Table */}
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Godown-wise Stock Summary</h2>
          <p className="text-sm opacity-75">{filters.asOnDate}</p>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              {view === 'Detailed' ? (
                <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                  <th className="border border-gray-300 px-4 py-3 text-left">Godown</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Stock Item</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">Unit</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Rate</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Value</th>
                </tr>
              ) : (
                <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                  <th className="border border-gray-300 px-4 py-3 text-left">Godown</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Items</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Avg Rate</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total Value</th>
                </tr>
              )}
            </thead>
            <tbody>
              {view === 'Detailed' ? (
                filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center opacity-70">No stock found in godowns</td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 px-4 py-2">{row.godownName}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.itemName}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.unit}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{row.quantity.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{row.rate.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{row.value.toLocaleString()}</td>
                    </tr>
                  ))
                )
              ) : (
                godownAggregates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center opacity-70">No stock found in godowns</td>
                  </tr>
                ) : (
                  godownAggregates.map(agg => (
                    <tr key={agg.godownId} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="border border-gray-300 px-4 py-2">{agg.godownName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{agg.totalItems}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{agg.totalQuantity.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{agg.avgRate.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">₹{agg.totalValue.toLocaleString()}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
            {(view === 'Detailed' ? filteredData.length > 0 : godownAggregates.length > 0) && (
              <tfoot>
                {view === 'Detailed' ? (
                  <tr className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 font-bold'}`}>
                    <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">Total:</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{totalQuantity.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2" />
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{totalValue.toLocaleString()}</td>
                  </tr>
                ) : (
                  <tr className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 font-bold'}`}>
                    <td className="border border-gray-300 px-4 py-2 text-right">Total:</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{godownAggregates.reduce((s,r)=>s+r.totalItems,0)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{totalGodownQuantity.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2" />
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{totalGodownValue.toLocaleString()}</td>
                  </tr>
                )}
              </tfoot>
            )}
          </table>
        )}
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm">
          <span className="font-semibold">Shortcuts:</span> F5 refresh · Ctrl+P print · Ctrl+E export · Use the view toggle for Godown-wise totals.
        </p>
      </div>
    </div>
  );
};

export default GodownSummary;
