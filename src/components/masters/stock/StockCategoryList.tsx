import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { Plus, Edit, Trash, Printer, Download, Filter, ArrowLeft } from 'lucide-react';
import ReportTable from '../../reports/ReportTable';
import type { StockCategory } from '../../../types';

const StockCategoryList: React.FC = () => {
  const { theme, companyInfo } = useAppContext();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock stockCategories and deleteStockCategory since they're not in context
  const stockCategories = useMemo<StockCategory[]>(() => [], []);
  const deleteStockCategory = useCallback((id: string) => {
    console.log('Delete stock category:', id);
    alert('Stock category deleted successfully!');
  }, []);

  // Mock stock categories
  const [mockStockCategories] = useState<StockCategory[]>([
    {
      id: 'SC1',
      name: 'Car Shampoo Brands',
      parent: '',
      description: 'Categories for different shampoo brands',
    },
    {
      id: 'SC2',
      name: 'Wax Types',
      parent: 'SC1',
      description: 'Types of wax for car polishing',
    },
  ]);

  const filteredStockCategories = (stockCategories.length > 0 ? stockCategories : mockStockCategories).filter(
    (c: StockCategory) => c.name.toLowerCase().includes(filterName.toLowerCase())
  );

  const paginatedStockCategories = filteredStockCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStockCategories.length / itemsPerPage);

  const columns = useMemo(() => [
    { header: 'Name', accessor: 'name', align: 'left' as const },
    { 
      header: 'Parent Category', 
      accessor: 'parent', 
      align: 'left' as const, 
      render: (row: StockCategory) => stockCategories.find((c: StockCategory) => c.id === row.parent)?.name || 'None' 
    },
    { 
      header: 'Description', 
      accessor: 'description', 
      align: 'left' as const, 
      render: (row: StockCategory) => row.description || 'N/A' 
    },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      align: 'center' as const, 
      render: (row: StockCategory) => (
        <div className="flex space-x-2 justify-center">
          <button
            title="Edit Stock Category"
            onClick={() => navigate(`/app/masters/stock-category/edit/${row.id}`)}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Edit size={16} />
          </button>
          <button
            title="Delete Stock Category"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this stock category?')) {
                deleteStockCategory(row.id);
              }
            }}
            className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-red-700' : 'hover:bg-red-200'}`}
          >
            <Trash size={16} />
          </button>
        </div>
      )
    },
  ], [stockCategories, navigate, theme, deleteStockCategory]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Stock Category List</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { font-size: 24px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            </style>
          </head>
          <body>
            <h1>${companyInfo?.name || 'Hanuman Car Wash'} - Stock Category List</h1>
            <table>
              <thead>
                <tr>${columns.map(col => `<th style="text-align:${col.align}">${col.header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${paginatedStockCategories.map((row: StockCategory) => `<tr>${
                  columns.map(col => `<td style="text-align:${col.align}">${col.render ? col.render(row) : ''}</td>`).join('')
                }</tr>`).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [paginatedStockCategories, columns, companyInfo]);

  const handleExport = useCallback(() => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...paginatedStockCategories.map((row: StockCategory) => 
        columns.map(col => col.render ? col.render(row) : '').join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_category_list.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [paginatedStockCategories, columns]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F5') {
      e.preventDefault();
      setFilterName('');
      setCurrentPage(1);
    } else if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      handleExport();
    } else if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      handlePrint();
    }
  }, [handleExport, handlePrint]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`pt-[56px] px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center mb-6">
        <button
          title="Back to Masters"
          onClick={() => navigate('/app/masters')}
          className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Stock Categories
        </h1>
        <div className="ml-auto flex space-x-2">
          <Link
            to="/app/masters/stock-category/create"
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            <Plus size={18} /> New Category
          </Link>
          <button
            title="Toggle Filters"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Filter size={18} />
          </button>
          <button
            title="Print List"
            onClick={handlePrint}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Printer size={18} />
          </button>
          <button
            title="Download List"
            onClick={handleExport}
            className={`p-2 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {showFilterPanel && (
        <div className={`p-4 mb-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Stock Category Name
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'} focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Search by name"
              />
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <ReportTable
          theme={theme}
          columns={columns}
          data={paginatedStockCategories}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Previous
        </button>
        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Next
        </button>
      </div>

      <div className={`mt-6 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Keyboard Shortcuts:</span> F5 to refresh, Ctrl+E to export, Ctrl+P to print.
        </p>
      </div>
    </div>
  );
};

export default StockCategoryList;