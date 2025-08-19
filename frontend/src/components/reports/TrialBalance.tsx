import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Printer, Download } from 'lucide-react';

// Types based on your data structure
interface Ledger {
  id: number;
  name: string;
  groupId: number;
  openingBalance: number;
  balanceType: 'debit' | 'credit';
  // Optional extra fields if backend provides period movement / closing
  periodDebit?: number;
  periodCredit?: number;
  closingBalance?: number;
  closingType?: 'debit' | 'credit';
}

interface GroupData {
  groupName: string;
  groupType: string;
  ledgers: Ledger[];
  total: { debit: number; credit: number };
}

const TrialBalance: React.FC = () => {
  const navigate = useNavigate();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [groupedData, setGroupedData] = useState<Record<string, GroupData>>({}); // raw from API
  // Raw API may include grand totals; we recompute dynamically so omit separate state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Filter toggles (yes/no) similar to Tally: show opening, transactions, closing
  const [showOpening, setShowOpening] = useState<'yes' | 'no'>('yes');
  const [showTransactions, setShowTransactions] = useState<'yes' | 'no'>('yes');
  const [showClosing, setShowClosing] = useState<'yes' | 'no'>('yes');

  // Fetch trial balance data from backend
  const fetchTrialBalance = async () => {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch('https://tally-backend-dyn3.onrender.com/api/trial-balance');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error: ${res.status}: ${text}`);
  }
  const data = await res.json();
      setGroupedData(data.groupedData);
  // Grand totals now derived at render time
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching data';
      setError(message);
  setGroupedData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialBalance();
  }, []);

  const handleLedgerClick = (ledger: Ledger) => {
    navigate(`/app/reports/ledger?ledgerId=${ledger.id}`);
  };

  const handleGroupClick = (groupType: string) => {
    navigate(`/app/reports/group-summary/${groupType}`);
  };

  // Helper functions to display debit and credit amounts
  // Balance helper functions removed (dynamic columns logic handles display)

  return (
    <div className="pt-[56px] px-4">
      <div className="flex items-center mb-6">
        <button
          title="Back to Reports"
          type="button"
          onClick={() => navigate('/app/reports')}
          className="mr-4 p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Trial Balance</h1>
        <div className="ml-auto flex space-x-2">
          <button
            title="Toggle Filters"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            <Filter size={18} />
          </button>
          <button title="Print Report" className="p-2 rounded-md hover:bg-gray-200">
            <Printer size={18} />
          </button>
          <button title="Download Report" className="p-2 rounded-md hover:bg-gray-200">
            <Download size={18} />
          </button>
        </div>
      </div>

      {showFilterPanel && (
        <div className="p-4 mb-6 rounded-lg bg-white shadow">
          <h3 className="font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="showOpening">Show Opening Balance</label>
              <select
                id="showOpening"
                title="Show Opening Balance"
                value={showOpening}
                onChange={e => setShowOpening(e.target.value as 'yes'|'no')}
                className="w-full p-2 rounded border bg-white border-gray-300"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="showTransactions">Show Transactions</label>
              <select
                id="showTransactions"
                title="Show Transactions"
                value={showTransactions}
                onChange={e => setShowTransactions(e.target.value as 'yes'|'no')}
                className="w-full p-2 rounded border bg-white border-gray-300"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="showClosing">Show Closing Balance</label>
              <select
                id="showClosing"
                title="Show Closing Balance"
                value={showClosing}
                onChange={e => setShowClosing(e.target.value as 'yes'|'no')}
                className="w-full p-2 rounded border bg-white border-gray-300"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Derived display data with opening/transaction/closing decomposition */}
      {/** Compute derived ledger rows once (not depending on toggles except totals display) **/}
      {/** We keep logic above the table but below filters for clarity **/}

      <div className="p-6 rounded-lg bg-white shadow">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold">Trial Balance</h2>
          {/** <p className="text-sm opacity-75">As of {new Date().toLocaleDateString()}</p> */}
        </div>

        {loading && <p className="text-center text-gray-500">Loading trial balance...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left" rowSpan={2}>Particulars</th>
                  <th className="px-4 py-3 text-left" rowSpan={2}>Group</th>
                  {showOpening==='yes' && (
                    <th className="px-4 py-3 text-center" colSpan={2}>Opening Balance</th>
                  )}
                  {showTransactions==='yes' && (
                    <th className="px-4 py-3 text-center" colSpan={2}>Transactions</th>
                  )}
                  {showClosing==='yes' && (
                    <th className="px-4 py-3 text-center" colSpan={2}>Closing Balance</th>
                  )}
                </tr>
                <tr className="border-b-2 border-gray-300">
                  {showOpening==='yes' && (<>
                    <th className="px-4 py-2 text-right">Dr</th>
                    <th className="px-4 py-2 text-right">Cr</th>
                  </>)}
                  {showTransactions==='yes' && (<>
                    <th className="px-4 py-2 text-right">Dr</th>
                    <th className="px-4 py-2 text-right">Cr</th>
                  </>)}
                  {showClosing==='yes' && (<>
                    <th className="px-4 py-2 text-right">Dr</th>
                    <th className="px-4 py-2 text-right">Cr</th>
                  </>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedData).map(([groupType, groupData]) => {
                  // Derive display values per ledger & group totals
                  const groupTotals = { opDr:0, opCr:0, txDr:0, txCr:0, clDr:0, clCr:0 };
                  const displayLedgers = groupData.ledgers.map(l => {
                    const openingDr = l.balanceType==='debit'? l.openingBalance : 0;
                    const openingCr = l.balanceType==='credit'? l.openingBalance : 0;
                    const txnDr = l.periodDebit || 0;
                    const txnCr = l.periodCredit || 0;
                    const net = (openingDr + txnDr) - (openingCr + txnCr);
                    const closingDr = net >=0 ? net : 0;
                    const closingCr = net < 0 ? -net : 0;
                    groupTotals.opDr += openingDr; groupTotals.opCr += openingCr;
                    groupTotals.txDr += txnDr; groupTotals.txCr += txnCr;
                    groupTotals.clDr += closingDr; groupTotals.clCr += closingCr;
                    return { ledger: l, openingDr, openingCr, txnDr, txnCr, closingDr, closingCr };
                  });
                  return (
                    <React.Fragment key={groupType}>
                      <tr
                        className="bg-gray-100 border-b border-gray-300 cursor-pointer hover:opacity-80"
                        title={`Click to view ${groupData.groupName} group summary`}
                        onClick={() => handleGroupClick(groupType)}
                      >
                        <td className="px-4 py-3 font-bold text-blue-600">{groupData.groupName}</td>
                        <td className="px-4 py-3 text-sm opacity-75">Group Total</td>
                        {showOpening==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.opDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.opCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                        {showTransactions==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.txDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.txCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                        {showClosing==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.clDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold">{groupTotals.clCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                      </tr>
                      {displayLedgers.map(r => (
                        <tr
                          key={r.ledger.id}
                          className="border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                          title={`Click to view ${r.ledger.name} ledger details`}
                          onClick={() => handleLedgerClick(r.ledger)}
                        >
                          <td className="px-8 py-2 text-sm">{r.ledger.name}</td>
                          <td className="px-4 py-2 text-sm opacity-75">{groupData.groupName}</td>
                          {showOpening==='yes' && (<>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.openingDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.openingCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          </>)}
                          {showTransactions==='yes' && (<>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.txnDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.txnCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          </>)}
                          {showClosing==='yes' && (<>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.closingDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                            <td className="px-4 py-2 text-right font-mono text-sm">{r.closingCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          </>)}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                {/* Overall totals recomputed for displayed columns */}
                {(() => {
                  const totals = { opDr:0, opCr:0, txDr:0, txCr:0, clDr:0, clCr:0 };
                  Object.values(groupedData).forEach(g => {
                    g.ledgers.forEach(l => {
                      const openingDr = l.balanceType==='debit'? l.openingBalance : 0;
                      const openingCr = l.balanceType==='credit'? l.openingBalance : 0;
                      const txnDr = l.periodDebit || 0;
                      const txnCr = l.periodCredit || 0;
                      const net = (openingDr + txnDr) - (openingCr + txnCr);
                      const closingDr = net >=0 ? net : 0;
                      const closingCr = net < 0 ? -net : 0;
                      totals.opDr += openingDr; totals.opCr += openingCr;
                      totals.txDr += txnDr; totals.txCr += txnCr;
                      totals.clDr += closingDr; totals.clCr += closingCr;
                    });
                  });
                  return (
                    <>
                      <tr className="font-bold border-t-2 border-gray-300">
                        <td className="px-4 py-3" colSpan={2}>Total</td>
                        {showOpening==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono">{totals.opDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono">{totals.opCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                        {showTransactions==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono">{totals.txDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono">{totals.txCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                        {showClosing==='yes' && (<>
                          <td className="px-4 py-3 text-right font-mono">{totals.clDr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td className="px-4 py-3 text-right font-mono">{totals.clCr.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                        </>)}
                      </tr>
                      {showClosing==='yes' && totals.clDr === totals.clCr && (
                        <tr>
                          <td colSpan={(showOpening==='yes'?2:0)+(showTransactions==='yes'?2:0)+(showClosing==='yes'?2:0)+2} className="px-4 py-2 text-center">
                            <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Closing balances tally</span>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })()}
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 rounded bg-blue-50">
        <p className="text-sm">
          <span className="font-semibold">Pro Tip:</span> Press F5 to refresh the report, F12 to configure display options.
        </p>
      </div>
    </div>
  );
};

export default TrialBalance;
