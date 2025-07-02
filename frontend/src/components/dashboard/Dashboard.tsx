// import React from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { Book, DollarSign, ShoppingBag, Activity } from 'lucide-react';

// const Dashboard: React.FC = () => {
//   const { theme, companyInfo, ledgers, vouchers } = useAppContext();

//   const stats = [
//     {
//       title: 'Ledger Accounts',
//       value: ledgers.length,
//       icon: <Book size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
//     },
//     {
//       title: 'Total Vouchers',
//       value: vouchers.length,
//       icon: <ShoppingBag size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'
//     },
//     {
//       title: 'Cash Balance',
//       value: '₹ ' + ledgers.find(l => l.name === 'Cash')?.openingBalance.toLocaleString() || '0',
//       icon: <DollarSign size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-amber-50'
//     },
//     {
//       title: 'Bank Balance',
//       value: '₹ ' + ledgers.find(l => l.name === 'Bank Account')?.openingBalance.toLocaleString() || '0',
//       icon: <Activity size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'
//     }
//   ];

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       {!companyInfo ? (
//         <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
//           <h2 className="text-xl font-semibold mb-4">Welcome to Tally Prime</h2>
//           <p className="mb-4">No company is currently open. Use Alt+F1 to create or select a company.</p>
//           <button className={`px-4 py-2 rounded-md ${
//             theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700 text-white'
//           }`}>
//             Create Company
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
//             <h2 className="text-xl font-semibold mb-2">{companyInfo.name}</h2>
//             <p className="text-sm opacity-75 mb-4">Financial Year: {companyInfo.financialYear}</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm">
//                   <span className="opacity-75">Address:</span> {companyInfo.address}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">PIN:</span> {companyInfo.pin}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">Phone:</span> {companyInfo.phoneNumber}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm">
//                   <span className="opacity-75">Email:</span> {companyInfo.email}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">PAN:</span> {companyInfo.panNumber}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">GSTIN:</span> {companyInfo.gstNumber}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             {stats.map((stat, index) => (
//               <div key={index} className={`p-6 rounded-lg ${stat.color} ${theme === 'dark' ? '' : 'shadow'}`}>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm opacity-75 mb-1">{stat.title}</p>
//                     <p className="text-2xl font-semibold">{stat.value}</p>
//                   </div>
//                   <div className={`p-2 rounded-full ${
//                     theme === 'dark' ? 'bg-gray-700' : 'bg-white'
//                   }`}>
//                     {stat.icon}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'}`}>
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               <button className={`p-4 rounded-lg text-center ${
//                 theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//               }`}>
//                 <DollarSign size={24} className="mx-auto mb-2" />
//                 <span>Create Voucher</span>
//               </button>
//               <button className={`p-4 rounded-lg text-center ${
//                 theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//               }`}>
//                 <Book size={24} className="mx-auto mb-2" />
//                 <span>Ledger</span>
//               </button>
//               <button className={`p-4 rounded-lg text-center ${
//                 theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//               }`}>
//                 <ShoppingBag size={24} className="mx-auto mb-2" />
//                 <span>Stock Item</span>
//               </button>
//               <button className={`p-4 rounded-lg text-center ${
//                 theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//               }`}>
//                 <Activity size={24} className="mx-auto mb-2" />
//                 <span>Balance Sheet</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import { Book, DollarSign, ShoppingBag, Activity } from 'lucide-react';

// const Dashboard: React.FC = () => {
//   const { theme, companyInfo, ledgers, vouchers } = useAppContext();
//   const navigate = useNavigate();

//   const handleCreateCompany = () => {
//     navigate('/company');
//   };

//   const stats = [
//     {
//       title: 'Ledger Accounts',
//       value: ledgers.length,
//       icon: <Book size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50',
//     },
//     {
//       title: 'Total Vouchers',
//       value: vouchers.length,
//       icon: <ShoppingBag size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-green-50',
//     },
//     {
//       title: 'Cash Balance',
//       value:
//         '₹ ' + ledgers.find((l) => l.name === 'Cash')?.openingBalance.toLocaleString() || '0',
//       icon: <DollarSign size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-amber-50',
//     },
//     {
//       title: 'Bank Balance',
//       value:
//         '₹ ' +
//           ledgers.find((l) => l.name === 'Bank Account')?.openingBalance.toLocaleString() || '0',
//       icon: <Activity size={24} />,
//       color: theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50',
//     },
//   ];

//   return (
//     <div className="pt-[56px] px-4">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       {!companyInfo ? (
//         <div
//           className={`p-6 rounded-lg mb-6 ${
//             theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
//           }`}
//         >
//           <h2 className="text-xl font-semibold mb-4">Welcome to Tally Prime</h2>
//           <p className="mb-4">No company is currently open. Use Alt+F1 to create or select a company.</p>
//           <button
//             onClick={handleCreateCompany}
//             className={`px-4 py-2 rounded-md cursor-pointer ${
//               theme === 'dark'
//                 ? 'bg-blue-600 hover:bg-blue-700'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             Create Company
//           </button>
//         </div>
//       ) : (
//         <>
//           <div
//             className={`p-6 rounded-lg mb-6 ${
//               theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
//             }`}
//           >
//             <h2 className="text-xl font-semibold mb-2"> {companyInfo.name}</h2>
//             <p className="text-sm opacity-75 mb-4">Financial Year: {companyInfo.financialYear}</p>
//             <p className="text-sm opacity-75 mb-4">Books Begining From: {companyInfo.booksBeginningYear}</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm">
//                   <span className="opacity-75">Address:</span> {companyInfo.address}
//                 </p>
//                  <p className="text-sm">
//                      <span className="opacity-75">State:</span> {companyInfo.state}
//                 </p>
//                 <p className="text-sm">
//                      <span className="opacity-75">State:</span> {companyInfo.country}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">PIN:</span> {companyInfo.pin}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">Phone:</span> {companyInfo.phoneNumber}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm">
//                   <span className="opacity-75">Email:</span> {companyInfo.email}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">PAN:</span> {companyInfo.panNumber}
//                 </p>
//                 <p className="text-sm">
//                   <span className="opacity-75">GSTIN:</span> {companyInfo.gstNumber}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className={`p-6 rounded-lg ${stat.color} ${theme === 'dark' ? '' : 'shadow'}`}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm opacity-75 mb-1">{stat.title}</p>
//                     <p className="text-2xl font-semibold">{stat.value}</p>
//                   </div>
//                   <div
//                     className={`p-2 rounded-full ${
//                       theme === 'dark' ? 'bg-gray-700' : 'bg-white'
//                     }`}
//                   >
//                     {stat.icon}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div
//             className={`p-6 rounded-lg ${
//               theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow'
//             }`}
//           >
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//               <button
//                 className={`p-4 rounded-lg text-center ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <DollarSign size={24} className="mx-auto mb-2" />
//                 <span>Create Voucher</span>
//               </button>
//               <button
//                 className={`p-4 rounded-lg text-center ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <Book size={24} className="mx-auto mb-2" />
//                 <span>Ledger</span>
//               </button>
//               <button
//                 className={`p-4 rounded-lg text-center ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <ShoppingBag size={24} className="mx-auto mb-2" />
//                 <span>Stock Item</span>
//               </button>
//               <button
//                 className={`p-4 rounded-lg text-center ${
//                   theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <Activity size={24} className="mx-auto mb-2" />
//                 <span>Balance Sheet</span>
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;





import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Book, DollarSign, ShoppingBag, Activity } from "lucide-react";

const Dashboard: React.FC = () => {
  const { theme, companyInfo, ledgers, vouchers } = useAppContext();
  const navigate = useNavigate();

  const handleCreateCompany = () => {
    navigate("/app/company");
  };

  const stats = [
    {
      title: "Ledger Accounts",
      value: ledgers.length,
      icon: <Book size={24} />,
      color: theme === "dark" ? "bg-gray-800" : "bg-blue-50",
    },
    {
      title: "Total Vouchers",
      value: vouchers.length,
      icon: <ShoppingBag size={24} />,
      color: theme === "dark" ? "bg-gray-800" : "bg-green-50",
    },
    {
      title: "Cash Balance",
      value:
        "₹ " +
        (ledgers
          .find((l) => l.name === "Cash")
          ?.openingBalance.toLocaleString() || "0"),
      icon: <DollarSign size={24} />,
      color: theme === "dark" ? "bg-gray-800" : "bg-amber-50",
    },
    {
      title: "Bank Balance",
      value:
        "₹ " +
        (ledgers
          .find((l) => l.name === "Bank Account")
          ?.openingBalance.toLocaleString() || "0"),
      icon: <Activity size={24} />,
      color: theme === "dark" ? "bg-gray-800" : "bg-purple-50",
    },
  ];

  return (
    <div className="pt-[56px] px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {!companyInfo ? (
        <div
          className={`p-6 rounded-lg mb-6 ${
            theme === "dark" ? "bg-gray-800" : "bg-white shadow"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Welcome to Tally Prime</h2>
          <p className="mb-4">
            No company is currently open. Use Alt+F1 to create or select a
            company.
          </p>
          <button
            onClick={handleCreateCompany}
            className={`px-4 py-2 rounded-md cursor-pointer ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Create Company
          </button>
        </div>
        
      ) : (
        <>
          <div
            className={`p-6 rounded-lg mb-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-white shadow"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">{companyInfo.name}</h2>
            <p className="text-sm opacity-75 mb-4">
              Financial Year: {companyInfo.financialYear}
            </p>
            <p className="text-sm opacity-75 mb-4">
              Books Beginning From: {companyInfo.booksBeginningYear}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm">
                  <span className="opacity-75">Address:</span>{" "}
                  {companyInfo.address}
                </p>
                <p className="text-sm">
                  <span className="opacity-75">State:</span> {companyInfo.state}
                </p>
                <p className="text-sm">
                  <span className="opacity-75">Country:</span>{" "}
                  {companyInfo.country}
                </p>
                <p className="text-sm">
                  <span className="opacity-75">PIN:</span> {companyInfo.pin}
                </p>
                <p className="text-sm">
                  <span className="opacity-75">Phone:</span>{" "}
                  {companyInfo.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="opacity-75">Email:</span> {companyInfo.email}
                </p>
                <p className="text-sm">
                  <span className="opacity-75">PAN:</span>{" "}
                  {companyInfo.panNumber}
                </p>
               <p className="text-sm">
  <span className="opacity-75">
    {companyInfo.taxType === "VAT" ? "VAT Number:" : "GST Number:"}
  </span>{" "}
  {companyInfo.taxType === "VAT" ? companyInfo.vatNumber : companyInfo.gstNumber}
</p>

              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${stat.color} ${
                  theme === "dark" ? "" : "shadow"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-75 mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      theme === "dark" ? "bg-gray-700" : "bg-white"
                    }`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white shadow"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                className={`p-4 rounded-lg text-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <DollarSign size={24} className="mx-auto mb-2" />
                <span>Create Voucher</span>
              </button>
              <button
                className={`p-4 rounded-lg text-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Book size={24} className="mx-auto mb-2" />
                <span>Ledger</span>
              </button>
              <button
                className={`p-4 rounded-lg text-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <ShoppingBag size={24} className="mx-auto mb-2" />
                <span>Stock Item</span>
              </button>
              <button
                className={`p-4 rounded-lg text-center ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <Activity size={24} className="mx-auto mb-2" />
                <span>Balance Sheet</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;