import React, { useRef, useState } from 'react';
import { Printer, Save, Trash2, Edit, FileJson, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'qrcode';

interface PartyInfo {
	gstin: string;
	name: string;
	addressLines: string[];
	pin: string;
	state?: string;
	place?: string;
}

interface ItemLine {
	description: string;
	hsn: string;
	quantity: number;
	unitPrice: number;
	discount: number; 
	gstRate: number; 
	igst?: boolean; 
	cess?: number;
	otherCharges?: number; 
	unit?: string; // added for NIC JSON export
}

interface EInvoiceGenerationProps {
	theme: 'light' | 'dark';
	onClose?: () => void;
	seller: PartyInfo;
	purchaser: PartyInfo;
	docInfo: {
		number: string;
		date: string; // ISO
		category: string; // e.g. B2B
		type: string; // Tax Invoice
		igstOnIntra?: boolean;
	};
	items: ItemLine[];
	roundOff?: number; // positive / negative
}

const currency = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const EInvoiceGeneration: React.FC<EInvoiceGenerationProps> = ({
	theme,
	onClose,
	seller,
	purchaser,
	docInfo,
	items,
	roundOff = 0,
}) => {
	const printRef = useRef<HTMLDivElement>(null);
		const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: `eInvoice_${docInfo.number}` });

	// e-Invoice generation state (mock frontend only)
	const [generated, setGenerated] = useState(false);
	const [irn, setIrn] = useState<string | null>(null);
	const [ackNo, setAckNo] = useState<string | null>(null);
	const [ackDt, setAckDt] = useState<string | null>(null);
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);		const handleGenerateEInvoice = async () => {
			if (generated) return;
			// Mock IRN hash (not real algorithm). Replace with backend IRP response later.
			const base = `${docInfo.number}|${docInfo.date}|${seller.gstin}|${purchaser.gstin}|${lines.length}|${Date.now()}`;
			const pseudoHash = btoa(unescape(encodeURIComponent(base))).replace(/[^A-Z0-9]/gi, '').slice(0, 50).toUpperCase();
			const mockAckNo = 'ACK' + Date.now().toString().slice(-8);
			const nowIso = new Date().toISOString();
			
			// Generate QR code data as per GST specification
			const qrData = `${pseudoHash}|${seller.gstin}|${docInfo.number}|${new Date(docInfo.date).toLocaleDateString('en-GB')}|${invoiceAmount.toFixed(2)}|${purchaser.gstin}|${mockAckNo}|${nowIso}`;
			
			try {
				const qrUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 2 });
				setQrDataUrl(qrUrl);
			} catch (err) {
				console.error('QR generation failed:', err);
			}
			
			setIrn(pseudoHash);
			setAckNo(mockAckNo);
			setAckDt(nowIso);
			setGenerated(true);
			// Optional: auto print after short delay
			setTimeout(() => handlePrint?.(), 700);
		};

	// Aggregations
	const lines = items.map(line => {
		const taxableVal = line.quantity * line.unitPrice - line.discount;
		const gstRate = line.gstRate || 0;
		const isIGST = !!line.igst;
		const cgstRate = isIGST ? 0 : gstRate / 2;
		const sgstRate = isIGST ? 0 : gstRate / 2;
		const igstRate = isIGST ? gstRate : 0;
		const cgstAmt = taxableVal * cgstRate / 100;
		const sgstAmt = taxableVal * sgstRate / 100;
		const igstAmt = taxableVal * igstRate / 100;
		const cessAmt = line.cess || 0;
		const other = line.otherCharges || 0;
		const lineTotal = taxableVal + cgstAmt + sgstAmt + igstAmt + cessAmt + other;
		return { ...line, taxableVal, cgstAmt, sgstAmt, igstAmt, cessAmt, other, lineTotal };
	});

	const totals = lines.reduce((acc, l) => {
		acc.taxable += l.taxableVal;
		acc.cgst += l.cgstAmt;
		acc.sgst += l.sgstAmt;
		acc.igst += l.igstAmt;
		acc.cess += l.cessAmt;
		acc.other += l.other;
		return acc;
	}, { taxable: 0, cgst: 0, sgst: 0, igst: 0, cess: 0, other: 0 });
	const invoiceAmount = totals.taxable + totals.cgst + totals.sgst + totals.igst + totals.cess + totals.other + roundOff;

	const downloadJSON = () => {
			// Helper: State name/code mapping (simplified; extend as needed)
			const stateCodeMap: Record<string, string> = {
				'Andhra Pradesh': '37','Arunachal Pradesh': '12','Assam': '18','Bihar': '10','Chhattisgarh': '22','Goa': '30','Gujarat': '24','Haryana': '06','Himachal Pradesh': '02','Jammu and Kashmir': '01','Jharkhand': '20','Karnataka': '29','Kerala': '32','Madhya Pradesh': '23','Maharashtra': '27','Manipur': '14','Meghalaya': '17','Mizoram': '15','Nagaland': '13','Odisha': '21','Punjab': '03','Rajasthan': '08','Sikkim': '11','Tamil Nadu': '33','Telangana': '36','Tripura': '16','Uttar Pradesh': '09','Uttarakhand': '05','West Bengal': '19','Delhi': '07','Puducherry': '34','Chandigarh': '04'
			};
			const sellerStateCode = stateCodeMap[seller.state || ''] || (seller.gstin ? seller.gstin.slice(0,2) : '00');
			const buyerStateCode = stateCodeMap[purchaser.state || ''] || (purchaser.gstin ? purchaser.gstin.slice(0,2) : sellerStateCode);
			const discountTotal = lines.reduce((s,l)=> s + l.discount, 0);
			interface EInvoicePayload {
				Version: string;
				TranDtls: object;
				DocDtls: object;
				SellerDtls: object;
				BuyerDtls: object;
				ValDtls: object;
				EwbDtls: object;
				RefDtls: object;
				ItemList: object[];
				Irn?: string;
				AckNo?: string | null;
				AckDt?: string | null;
			}
			const payload: EInvoicePayload = {
				Version: '1.1',
				TranDtls: {
					TaxSch: 'GST',
					SupTyp: docInfo.category,
					IgstOnIntra: docInfo.igstOnIntra ? 'Y' : 'N',
					RegRev: 'N',
					EcmGstin: null
				},
				DocDtls: { Typ: docInfo.type === 'Tax Invoice' ? 'INV' : docInfo.type === 'Credit Note' ? 'CRN' : docInfo.type === 'Debit Note' ? 'DN' : 'INV', No: docInfo.number, Dt: new Date(docInfo.date).toLocaleDateString('en-GB') },
				SellerDtls: {
					Gstin: seller.gstin,
					LglNm: seller.name,
					Addr1: seller.addressLines[0] || '',
					Addr2: seller.addressLines[1] || seller.addressLines[0] || '',
					Loc: seller.addressLines[2] || seller.place || seller.state || '',
					Pin: parseInt(seller.pin,10) || 0,
					Stcd: sellerStateCode,
					Ph: null,
					Em: null
				},
				BuyerDtls: {
					Gstin: purchaser.gstin,
					LglNm: purchaser.name,
					Addr1: purchaser.addressLines[0] || '',
					Addr2: purchaser.addressLines[1] || purchaser.addressLines[0] || '',
					Loc: purchaser.addressLines[2] || purchaser.place || purchaser.state || '',
					Pin: parseInt(purchaser.pin,10) || 0,
					Pos: buyerStateCode,
					Stcd: buyerStateCode,
					Ph: null,
					Em: null
				},
				ValDtls: {
					AssVal: Number(totals.taxable.toFixed(2)),
					IgstVal: Number(totals.igst.toFixed(2)),
					CgstVal: Number(totals.cgst.toFixed(2)),
					SgstVal: Number(totals.sgst.toFixed(2)),
					CesVal: Number(totals.cess.toFixed(2)),
					StCesVal: 0,
					Discount: Number(discountTotal.toFixed(2)),
					OthChrg: Number(totals.other.toFixed(2)),
					RndOffAmt: Number(roundOff.toFixed(2)),
					TotInvVal: Number(invoiceAmount.toFixed(2))
				},
				EwbDtls: {
					TransId: null,
					TransName: null,
					TransMode: '1',
					Distance: 0,
					TransDocNo: docInfo.number,
					TransDocDt: new Date(docInfo.date).toLocaleDateString('en-GB'),
					VehNo: '',
					VehType: 'R'
				},
				RefDtls: { InvRm: 'NICGEPP2.0' },
				ItemList: lines.map((l, idx) => {
					const totAmt = l.quantity * l.unitPrice; // before discount
					return {
						SlNo: (idx + 1).toString(),
						PrdDesc: l.description,
						IsServc: 'N',
						HsnCd: l.hsn,
						Qty: l.quantity,
						FreeQty: 0,
						Unit: l.unit || 'NOS',
						UnitPrice: l.unitPrice,
						TotAmt: Number(totAmt.toFixed(2)),
						Discount: Number(l.discount.toFixed(2)),
						PreTaxVal: 0,
						AssAmt: Number(l.taxableVal.toFixed(2)),
						GstRt: l.gstRate,
						IgstAmt: Number(l.igstAmt.toFixed(2)),
						CgstAmt: Number(l.cgstAmt.toFixed(2)),
						SgstAmt: Number(l.sgstAmt.toFixed(2)),
						CesRt: 0,
						CesAmt: Number(l.cessAmt.toFixed(2)),
						CesNonAdvlAmt: 0,
						StateCesRt: 0,
						StateCesAmt: 0,
						StateCesNonAdvlAmt: 0,
						OthChrg: Number(l.other.toFixed(2)),
						TotItemVal: Number(l.lineTotal.toFixed(2))
					};
				}),
				// Optional blocks (placeholders) – populate when data available
				// PayDtls: { Nm: '', Mode: '', FinInsBr: '', PayTerm: '', PayInstr: '', CrTrn: '', DirDr: '', CrDay: 0, PaidAmt: 0, PaymtDue: 0 },
				// ShipDtls: { LglNm: purchaser.name, Gstin: purchaser.gstin, Addr1: purchaser.addressLines[0] || '', Addr2: purchaser.addressLines[1] || '', Loc: purchaser.place || '', Pin: parseInt(purchaser.pin,10)||0, Stcd: buyerStateCode },
				// ExpDtls: { ShipBNo: '', ShipBDt: '', Port: '', RefClm: '', ForCur: '', CntCode: '', ExpDuty: '' },
				// AddlDocDtls: [ { DocTyp: '', DocNo: '', DocDt: '', Docs: '' } ]
			};
			// Append IRN details if already generated in UI
			if (generated && irn) {
				payload.Irn = irn;
				payload.AckNo = ackNo;
				payload.AckDt = ackDt && new Date(ackDt).toISOString();
			}
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `eInvoice_${docInfo.number}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const containerCls = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
	const sectionHeaderCls = theme === 'dark' ? 'bg-amber-700/40 text-white' : 'bg-amber-100 text-gray-800';
	const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className={`w-full max-w-4xl print:w-[210mm] mx-auto rounded shadow-xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible ${containerCls}`} ref={printRef}>
				{/* Header */}
			<div className={`flex items-center justify-between px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}> 
					  <h1 className="text-2xl font-bold">Preview e-Invoice</h1>
					<div className="flex gap-2">
						<button onClick={downloadJSON} title='Download JSON' className="px-3 py-1 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"><FileJson size={14} className='mr-1'/>JSON</button>
						<button onClick={handlePrint} title='Print' className="px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white flex items-center"><Printer size={14} className='mr-1'/>Print</button>
						{onClose && <button onClick={onClose} title='Close' className="px-3 py-1 text-sm rounded bg-gray-500 hover:bg-gray-600 text-white flex items-center"><X size={14} className='mr-1'/>Close</button>}
					</div>
				</div>

				{/* Document Details */}
				<div className={`border-b ${borderColor}`}>
					<div className={`${sectionHeaderCls} px-4 py-2 font-semibold`}>1. Document Details</div>
					<table className="w-full text-sm">
						<tbody>
							<tr className={`border-b ${borderColor}`}>
								<td className="px-4 py-2 w-40">Category</td>
								<td className="px-4 py-2">: {docInfo.category}</td>
								<td className="px-4 py-2 w-40">Document No</td>
								<td className="px-4 py-2">: {docInfo.number}</td>
								<td className="px-4 py-2 w-40">IGST on INTRA</td>
								<td className="px-4 py-2">: {docInfo.igstOnIntra ? 'Yes' : 'No'}</td>
							</tr>
							<tr>
								<td className="px-4 py-2">Document Type</td>
								<td className="px-4 py-2">: {docInfo.type}</td>
								<td className="px-4 py-2">Document Date</td>
								<td className="px-4 py-2">: {new Date(docInfo.date).toLocaleDateString('en-GB')}</td>
								<td colSpan={2}></td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Party Details */}
				<div className={`border-b ${borderColor}`}>
					<div className={`${sectionHeaderCls} px-4 py-2 font-semibold`}>2. Party Details</div>
					<div className="grid grid-cols-2 gap-4 p-4">
						<div className={`border ${borderColor} p-4 text-sm leading-5`}>
							<div className="font-semibold mb-1">Seller</div>
							<div><strong>GSTIN</strong> : {seller.gstin}</div>
							<div className='whitespace-pre-line'>{seller.name}</div>
							{seller.addressLines.map((l,i)=>(<div key={i}>{l}</div>))}
							<div>{seller.pin}  {seller.state}</div>
						</div>
						<div className={`border ${borderColor} p-4 text-sm leading-5`}>
							<div className="font-semibold mb-1">Purchaser</div>
							<div><strong>GSTIN</strong> : {purchaser.gstin}</div>
							<div className='whitespace-pre-line'>{purchaser.name}</div>
							{purchaser.addressLines.map((l,i)=>(<div key={i}>{l}</div>))}
							<div>{purchaser.pin}  {purchaser.state}</div>
							<div><strong>Place of Supply :</strong>{purchaser.place}</div>
						</div>
					</div>
				</div>

				{/* Item Details */}
				<div className={`border-b ${borderColor}`}>
					<div className={`${sectionHeaderCls} px-4 py-2 font-semibold`}>3. Item Details</div>
					<div className="overflow-x-auto">
						<table className="w-full text-xs border-collapse">
							<thead>
								<tr className={`border-b ${borderColor} bg-gray-100`}>
									<th className='px-2 py-2 text-left'>SL</th>
									<th className='px-2 py-2 text-left'>Product Descri</th>
									<th className='px-2 py-2 text-left'>HSN</th>
									<th className='px-2 py-2 text-right'>Quantit</th>
									<th className='px-2 py-2 text-right'>Unit Pric</th>
									<th className='px-2 py-2 text-right'>Discount</th>
									<th className='px-2 py-2 text-right'>Taxable Val</th>
									<th className='px-2 py-2 text-right'>GST Rate</th>
									<th className='px-2 py-2 text-right'>IGST</th>
									<th className='px-2 py-2 text-right'>SGST</th>
									<th className='px-2 py-2 text-right'>CGST</th>
									<th className='px-2 py-2 text-right'>Total CESS</th>
									<th className='px-2 py-2 text-right'>Other Cha</th>
									<th className='px-2 py-2 text-right'>Item Total</th>
								</tr>
							</thead>
							<tbody>
								{lines.map((l,idx)=>(
									<tr key={idx} className={`border-b ${borderColor}`}>
										<td className='px-2 py-1'>{idx+1}</td>
										<td className='px-2 py-1'>{l.description}</td>
										<td className='px-2 py-1'>{l.hsn}</td>
										<td className='px-2 py-1 text-right'>{l.quantity}</td>
										<td className='px-2 py-1 text-right'>{currency(l.unitPrice)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.discount)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.taxableVal)}</td>
										<td className='px-2 py-1 text-right'>{l.gstRate}%</td>
										<td className='px-2 py-1 text-right'>{currency(l.igstAmt)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.sgstAmt)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.cgstAmt)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.cessAmt)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.other)}</td>
										<td className='px-2 py-1 text-right'>{currency(l.lineTotal)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Totals Row Set */}
					<div className="overflow-x-auto mt-4">
						<table className='w-full text-xs border-collapse'>
							<tbody>
								<tr className={`border ${borderColor}`}>
									<td className='px-2 py-2 w-28'><strong>Tax'ble Amt</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.taxable)}</td>
									<td className='px-2 py-2 w-28'><strong>CGST Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.cgst)}</td>
									<td className='px-2 py-2 w-28'><strong>SGST Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.sgst)}</td>
									<td className='px-2 py-2 w-28'><strong>IGST Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.igst)}</td>
									<td className='px-2 py-2 w-28'><strong>CESS Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.cess)}</td>
									<td className='px-2 py-2 w-28'><strong>State CESS Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>0.00</td>
									<td className='px-2 py-2 w-28'><strong>Discount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(lines.reduce((s,l)=>s+l.discount,0))}</td>
									<td className='px-2 py-2 w-28'><strong>Other Charges</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(totals.other)}</td>
									<td className='px-2 py-2 w-28'><strong>Round off Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(roundOff)}</td>
									<td className='px-2 py-2 w-28'><strong>Total Inv. Amount</strong></td>
									<td className='px-2 py-2 w-28 text-right'>{currency(invoiceAmount)}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='px-4 py-2 text-xs'>Generated By  : <strong>{seller.gstin}</strong></div>
				</div>

				{/* e-Invoice Generated Details */}
				{generated && (
					<div className={`border-b ${borderColor}`}>
						<div className={`${sectionHeaderCls} px-4 py-2 font-semibold`}>4. e-Invoice Details</div>
						<table className='w-full text-sm'>
							<tbody>
								<tr className={`border-b ${borderColor}`}>
									<td className='px-4 py-2 w-48'>IRN</td>
									<td className='px-4 py-2 break-all'>: {irn}</td>
									<td className='px-4 py-2 w-48'>Ack No</td>
									<td className='px-4 py-2'>: {ackNo}</td>
								</tr>
								<tr>
									<td className='px-4 py-2'>Ack Date/Time</td>
									<td className='px-4 py-2'>: {ackDt && new Date(ackDt).toLocaleString()}</td>
									<td className='px-4 py-2'>Status</td>
									<td className='px-4 py-2'>: Generated</td>
								</tr>
							</tbody>
						</table>
						<div className='px-4 py-4'>
							<div className='text-xs text-amber-600 dark:text-amber-400 mb-2'>IRN shown above is a mock hash for UI demonstration. Replace with real IRP response.</div>
							<div className='flex items-start gap-4'>
								<div className='flex-1'>
									<div className='text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded break-all'>
										<strong>QR Payload:</strong> {irn?.slice(0,20)}...|{seller.gstin}|{docInfo.number}|{new Date(docInfo.date).toLocaleDateString('en-GB')}|{invoiceAmount.toFixed(2)}
									</div>
								</div>
								{qrDataUrl && (
									<div className='text-center'>
										<div className='text-xs font-semibold mb-1'>GST QR Code</div>
										<img src={qrDataUrl} alt="GST QR Code" className='border border-gray-300 rounded' />
										<div className='text-xs text-gray-500 mt-1'>Scan to verify</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}				{/* Footer Actions (Edit/Delete/Generate) */}
					<div className={`flex justify-end gap-3 px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}> 
					<button className='px-6 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 flex items-center text-sm'><Trash2 size={14} className='mr-2'/>Delete</button>
					<button className='px-6 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white flex items-center text-sm'><Edit size={14} className='mr-2'/>Edit</button>
						{!generated && (
							<button onClick={handleGenerateEInvoice} className='px-6 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center text-sm'>
								<Save size={14} className='mr-2'/>Generate e-Invoice
							</button>
						)}
						{generated && (
							<button disabled className='px-6 py-2 rounded bg-emerald-500 text-white flex items-center text-sm cursor-default'>
								✅ Generated
							</button>
						)}
				</div>
			</div>
		</div>
	);
};

export default EInvoiceGeneration;
