import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, Printer, Download, Filter } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ReportTable from './ReportTable';
import type { StockTransaction } from '../../types';

type AgeingData = {
  item: {
    id: string;
    name: string;
    standardPurchaseRate?: number;
    standardSaleRate?: number;
  };
  ageing: { label: string; qty: number; value: number; }[];
  totalQty: number;
  totalValue: number;
};

const AgeingAnalysis: React.FC = () => {
  const { theme, stockItems, stockGroups } = useAppContext();
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: '2025-04-01',
    toDate: new Date().toISOString().split('T')[0],
    stockGroupId: '',
    stockItemId: '',
    godownId: '',
    batchId: '',
    period: 'Monthly' as 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly',
    basis: 'Quantity' as 'Quantity' | 'Value' | 'Cost',
    showProfit: false,
  });
  const [transactions] = useState<StockTransaction[]>([
    {
      id: '1',
      stockItemId: '1',
      voucherId: '1',
      voucherType: 'purchase',
      voucherNo: 'PUR-001',
      date: '2025-03-01',
      quantity: 100,
      rate: 50,
      value: 5000,
      godownId: '1',
    },
    {
      id: '2',
      stockItemId: '1',
      voucherId: '2',
      voucherType: 'sales',
      voucherNo: 'SAL-001',
      date: '2025-06-15',
      quantity: -20,
      rate: 70,
      value: -1400,
      godownId: '1',
    },
  ]);

  const calculateAgeing = () => {
    const today = new Date(filters.toDate);
    const ageingBuckets = [
      { label: '0-30 Days', days: 30 },
      { label: '31-60 Days', days: 60 },
      { label: '61-90 Days', days: 90 },
      { label: '91-180 Days', days: 180 },
      { label: 'Above 180 Days', days: Infinity },
    ];

    return stockItems
      .filter(item => (
        (!filters.stockGroupId || item.stockGroupId === filters.stockGroupId) &&
        (!filters.stockItemId || item.id === filters.stockItemId)
      ))
      .map(item => {
        const itemTxns = transactions.filter(txn => 
          txn.stockItemId === item.id &&
          txn.quantity > 0 &&
          (!filters.godownId || txn.godownId === filters.godownId)
        );
        const ageing = ageingBuckets.map(bucket => {
          const qty = itemTxns
            .filter(txn => {
              const txnDate = new Date(txn.date);
              const daysOld = (today.getTime() - txnDate.getTime()) / (1000 * 3600 * 24);
              return daysOld <= bucket.days && (bucket.days === Infinity || daysOld > (ageingBuckets[ageingBuckets.indexOf(bucket) - 1]?.days || 0));
            })
            .reduce((sum, txn) => sum + txn.quantity, 0);
          const value = filters.basis === 'Cost' 
            ? qty * (item.standardPurchaseRate || 0)
            : qty * (item.standardSaleRate || 0);
          return { label: bucket.label, qty, value };
        });
        const totalQty = ageing.reduce((sum, a) => sum + a.qty, 0);
        const totalValue = ageing.reduce((sum, a) => sum + a.value, 0);
        return { item, ageing, totalQty, totalValue };
      });
  };

  const data = calculateAgeing();

  const columns = useMemo(() => [
    { 
      header: 'Stock Item', 
      accessor: 'name', 
      align: 'left' as const, 
      render: (row: AgeingData) => row.item.name 
    },
    ...(!filters.basis.includes('Qty') ? [] : [
      { header: '0-30 Days', accessor: '0-30', align: 'right' as const, render: (row: AgeingData) => row.ageing[0].qty.toLocaleString() },
      { header: '31-60 Days', accessor: '31-60', align: 'right' as const, render: (row: AgeingData) => row.ageing[1].qty.toLocaleString() },
      { header: '61-90 Days', accessor: '61-90', align: 'right' as const, render: (row: AgeingData) => row.ageing[2].qty.toLocaleString() },
      { header: '91-180 Days', accessor: '91-180', align: 'right' as const, render: (row: AgeingData) => row.ageing[3].qty.toLocaleString() },
      { header: 'Above 180 Days', accessor: '180+', align: 'right' as const, render: (row: AgeingData) => row.ageing[4].qty.toLocaleString() },
      { header: 'Total Qty', accessor: 'totalQty', align: 'right' as const, render: (row: AgeingData) => row.totalQty.toLocaleString() },
    ]),
    ...(filters.basis !== 'Quantity' ? [
      { header: '0-30 Days Value', accessor: '0-30-value', align: 'right' as const, render: (row: AgeingData) => `₹${row.ageing[0].value.toLocaleString()}` },
      { header: '31-60 Days Value', accessor: '31-60-value', align: 'right' as const, render: (row: AgeingData) => `₹${row.ageing[1].value.toLocaleString()}` },
      { header: '61-90 Days Value', accessor: '61-90-value', align: 'right' as const, render: (row: AgeingData) => `₹${row.ageing[2].value.toLocaleString()}` },
      { header: '91-180 Days Value', accessor: '91-180-value', align: 'right' as const, render: (row: AgeingData) => `₹${row.ageing[3].value.toLocaleString()}` },
      { header: 'Above 180 Days Value', accessor: '180+-value', align: 'right' as const, render: (row: AgeingData) => `₹${row.ageing[4].value.toLocaleString()}` },
      { header: 'Total Value', accessor: 'totalValue', align: 'right' as const, render: (row: AgeingData) => `₹${row.totalValue.toLocaleString()}` },
    ] : []),
  ], [filters.basis]);

  const footer = useMemo(() => [
    { accessor: 'name', value: 'Total' },
    ...(!filters.basis.includes('Qty') ? [] : [
      { accessor: '0-30', value: data.reduce((sum, row) => sum + row.ageing[0].qty, 0).toLocaleString() },
      { accessor: '31-60', value: data.reduce((sum, row) => sum + row.ageing[1].qty, 0).toLocaleString() },
      { accessor: '61-90', value: data.reduce((sum, row) => sum + row.ageing[2].qty, 0).toLocaleString() },
      { accessor: '91-180', value: data.reduce((sum, row) => sum + row.ageing[3].qty, 0).toLocaleString() },
      { accessor: '180+', value: data.reduce((sum, row) => sum + row.ageing[4].qty, 0).toLocaleString() },
      { accessor: 'totalQty', value: data.reduce((sum, row) => sum + row.totalQty, 0).toLocaleString() },
    ]),
    ...(filters.basis !== 'Quantity' ? [
      { accessor: '0-30-value', value: `₹${data.reduce((sum, row) => sum + row.ageing[0].value, 0).toLocaleString()}` },
      { accessor: '31-60-value', value: `₹${data.reduce((sum, row) => sum + row.ageing[1].value, 0).toLocaleString()}` },
      { accessor: '61-90-value', value: `₹${data.reduce((sum, row) => sum + row.ageing[2].value, 0).toLocaleString()}` },
      { accessor: '91-180-value', value: `₹${data.reduce((sum, row) => sum + row.ageing[3].value, 0).toLocaleString()}` },
      { accessor: '180+-value', value: `₹${data.reduce((sum, row) => sum + row.ageing[4].value, 0).toLocaleString()}` },
      { accessor: 'totalValue', value: `₹${data.reduce((sum, row) => sum + row.totalValue, 0).toLocaleString()}` },
    ] : []),
  ], [data, filters.basis]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Ageing Analysis</title><style>body{font-family:Arial,sans-serif;padding:20px}h1{font-size:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd}</style></head>
          <body>
            <h1>Hanuman Car Wash - Ageing Analysis</h1>
            <p>As on ${filters.toDate}</p>
            <table>
              <thead>
                <tr>${columns.map(col => `<th style="text-align:${col.align}">${col.header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${
                  columns.map(col => `<td style="text-align:${col.align}">${col.render ? col.render(row) : String((row as Record<string, unknown>)[col.accessor] ?? '')}</td>`).join('')
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
  }, [filters.toDate, columns, data, footer]);

  const handleExport = useCallback(() => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...data.map(row => columns.map(col => col.render ? col.render(row) : String((row as Record<string, unknown>)[col.accessor] ?? '')).join(',')),
      footer.map(f => f.value).join(','),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ageing_analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [columns, data, footer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
  }, [filters, handleExport, handlePrint]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Stock Ageing Analysis</h1>
        <div className="ml-auto flex space-x-2">
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

      <FilterPanel
        theme={theme}
        show={showFilterPanel}
        onToggle={() => setShowFilterPanel(!showFilterPanel)}
        filters={filters}
        onFilterChange={setFilters}
        stockGroups={stockGroups}
        stockItems={stockItems}
        godowns={[]}
      />

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Stock Ageing Analysis</h2>
          <p className="text-sm opacity-75">As on {filters.toDate}</p>
        </div>

        <ReportTable
          theme={theme}
          columns={columns}
          data={data}
          footer={footer}
        />
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> F5 to refresh, F12 to configure, Ctrl+E to export, Ctrl+P to print.
        </p>
      </div>
    </div>
  );
};

export default AgeingAnalysis;