// import React, { useState } from "react";
// import { useAppContext } from "../../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import type { CompanyInfo } from "../../types";

// const states = [
//   { code: "37", name: "Andhra Pradesh" },
//   { code: "12", name: "Arunachal Pradesh" },
//   { code: "18", name: "Assam" },
//   { code: "10", name: "Bihar" },
//   { code: "22", name: "Chhattisgarh" },
//   { code: "30", name: "Goa" },
//   { code: "24", name: "Gujarat" },
//   { code: "06", name: "Haryana" },
//   { code: "02", name: "Himachal Pradesh" },
//   { code: "20", name: "Jharkhand" },
//   { code: "29", name: "Karnataka" },
//   { code: "32", name: "Kerala" },
//   { code: "23", name: "Madhya Pradesh" },
//   { code: "27", name: "Maharashtra" },
//   { code: "14", name: "Manipur" },
//   { code: "17", name: "Meghalaya" },
//   { code: "15", name: "Mizoram" },
//   { code: "13", name: "Nagaland" },
//   { code: "21", name: "Odisha" },
//   { code: "03", name: "Punjab" },
//   { code: "08", name: "Rajasthan" },
//   { code: "11", name: "Sikkim" },
//   { code: "33", name: "Tamil Nadu" },
//   { code: "36", name: "Telangana" },
//   { code: "16", name: "Tripura" },
//   { code: "09", name: "Uttar Pradesh" },
//   { code: "05", name: "Uttarakhand" },
//   { code: "19", name: "West Bengal" },
//   { code: "07", name: "Delhi" },
//   { code: "01", name: "Jammu and Kashmir" },
//   { code: "38", name: "Ladakh" },
// ];

// const CompanyForm: React.FC = () => {
//   const { theme, setCompanyInfo } = useAppContext();
//   const navigate = useNavigate();

//   const [company, setCompany] = useState<CompanyInfo>({
//     name: "",
//     financialYear: "",
//     booksBeginningYear: "",
//     address: "",
//     pin: "",
//     phoneNumber: "",
//     email: "",
//     panNumber: "",
//     gstNumber: "",
//     state: "",
//     country: "India",
//   });
//   const [taxType, setTaxType] = useState<"GST" | "VAT">("GST");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCompany((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCompanyInfo(company);
//     navigate("/");
//   };

//   return (
//     <div className="pt-[56px] px-4 ">
//       <div
//         className={`max-w-3xl mx-auto  p-6 rounded-lg ${
//           theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"
//         }`}
//       >
//         <h2 className="text-2xl font-bold mb-6">Company Information</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="name">
//                 Company Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={company.name}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="financialYear"
//               >
//                 Financial Year
//               </label>
//               <input
//                 type="text"
//                 id="financialYear"
//                 name="financialYear"
//                 value={company.financialYear}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="financialYear"
//               >
//                 Books Beginning From
//               </label>
//               <input
//                 title="Enter the beginning financial year"
//                 type="text"
//                 id="booksBeginningYear"
//                 name="booksBeginningYear"
//                 value={company.booksBeginningYear}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="address"
//               >
//                 Address
//               </label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={company.address}
//                 onChange={handleChange}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="pin">
//                 PIN Code
//               </label>
//               <input
//                 type="text"
//                 id="pin"
//                 name="pin"
//                 value={company.pin}
//                 onChange={handleChange}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="state">
//                 State
//               </label>
//               <select
//                 id="state"
//                 name="state"
//                 value={company.state}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 text-white"
//                     : "bg-white border-gray-300 text-black"
//                 } outline-none transition-colors`}
//               >
//                 <option value="">Select State</option>
//                 {states.map(({ code, name }) => (
//                   <option key={code} value={`${name}(${code})`}>
//                     {name} ({code})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="financialYear"
//               >
//                 Country
//               </label>
//               <input
//                 type="text"
//                 id="financialYear"
//                 name="financialYear"
//                 value={company.country}
//                 onChange={handleChange}
//                 required
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="phoneNumber"
//               >
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 value={company.phoneNumber}
//                 onChange={handleChange}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={company.email}
//                 onChange={handleChange}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>

//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="panNumber"
//               >
//                 PAN Number
//               </label>
//               <input
//                 type="text"
//                 id="panNumber"
//                 name="panNumber"
//                 value={company.panNumber}
//                 onChange={handleChange}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>
//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="taxType"
//               >
//                 Tax Type
//               </label>
//               <select
//                 id="taxType"
//                 name="taxType"
//                 value={taxType}
//                 onChange={(e) => setTaxType(e.target.value as "GST" | "VAT")}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 text-white"
//                     : "bg-white border-gray-300 text-black"
//                 } outline-none transition-colors`}
//               >
//                 <option value="GST">GST</option>
//                 <option value="VAT">VAT</option>
//               </select>
//             </div>

//             <div>
//               <label
//                 className="block text-sm font-medium mb-1"
//                 htmlFor="gstNumber"
//               >
//                 {taxType} Number
//               </label>
//               <input
//                 type="text"
//                 id="gstNumber"
//                 name="gstNumber"
//                 value={company.gstNumber}
//                 onChange={handleChange}
//                 placeholder={`Enter ${taxType} Number`}
//                 className={`w-full p-2 rounded border ${
//                   theme === "dark"
//                     ? "bg-gray-700 border-gray-600 focus:border-blue-500"
//                     : "bg-white border-gray-300 focus:border-blue-500"
//                 } outline-none transition-colors`}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className={`px-4 py-2 rounded ${
//                 theme === "dark"
//                   ? "bg-gray-700 hover:bg-gray-600"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={`px-4 py-2 rounded ${
//                 theme === "dark"
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-blue-600 hover:bg-blue-700 text-white"
//               }`}
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CompanyForm;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import type { CompanyInfo } from "../../types";

const states = [
  { code: "37", name: "Andhra Pradesh" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "18", name: "Assam" },
  { code: "10", name: "Bihar" },
  { code: "22", name: "Chhattisgarh" },
  { code: "30", name: "Goa" },
  { code: "24", name: "Gujarat" },
  { code: "06", name: "Haryana" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "20", name: "Jharkhand" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "27", name: "Maharashtra" },
  { code: "14", name: "Manipur" },
  { code: "17", name: "Meghalaya" },
  { code: "15", name: "Mizoram" },
  { code: "13", name: "Nagaland" },
  { code: "21", name: "Odisha" },
  { code: "03", name: "Punjab" },
  { code: "08", name: "Rajasthan" },
  { code: "11", name: "Sikkim" },
  { code: "33", name: "Tamil Nadu" },
  { code: "36", name: "Telangana" },
  { code: "16", name: "Tripura" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "05", name: "Uttarakhand" },
  { code: "19", name: "West Bengal" },
  { code: "07", name: "Delhi" },
  { code: "01", name: "Jammu and Kashmir" },
  { code: "38", name: "Ladakh" },
];

const CompanyForm: React.FC = () => {
  const { theme, setCompanyInfo } = useAppContext();
  const navigate = useNavigate();

  const [company, setCompany] = useState<CompanyInfo>({
  name: "",
  financialYear: "",
  booksBeginningYear: "",
  address: "",
  pin: "",
  phoneNumber: "",
  email: "",
  panNumber: "",
  gstNumber: "",
  vatNumber: "", // Add this
  state: "",
  country: "India",
  taxType: "VAT",
});


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(company),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Company created successfully!");
      console.log("🔍 Submitting company:", company);

      setCompanyInfo(company); // Optional: store in context
      navigate("/");
    } else {
      alert(data.message || "Failed to create company");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Something went wrong!");
  }
};


  return (
    <div className="pt-[56px] px-4">
      <div
        className={`max-w-3xl mx-auto p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Company Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Company Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={company.name}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="financialYear"
              >
                Financial Year
              </label>
              <input
                type="text"
                id="financialYear"
                name="financialYear"
                value={company.financialYear}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="booksBeginningYear"
              >
                Books Beginning From
              </label>
              <input
                title="Enter the beginning financial year"
                type="text"
                id="booksBeginningYear"
                name="booksBeginningYear"
                value={company.booksBeginningYear}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="address"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={company.address}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="pin">
                PIN Code
              </label>
              <input
                type="text"
                id="pin"
                name="pin"
                value={company.pin}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="state">
                State
              </label>
              <select
                id="state"
                name="state"
                value={company.state}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                } outline-none transition-colors`}
              >
                <option value="">Select State</option>
                {states.map(({ code, name }) => (
                  <option key={code} value={`${name}(${code})`}>
                    {name} ({code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="country"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={company.country}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={company.phoneNumber}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={company.email}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="panNumber"
              >
                PAN Number
              </label>
              <input
                type="text"
                id="panNumber"
                name="panNumber"
                value={company.panNumber}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="taxType"
              >
                Tax Type
              </label>
              <select
                id="taxType"
                name="taxType"
                value={company.taxType}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                } outline-none transition-colors`}
              >
                <option value="GST">GST</option>
                <option value="VAT">VAT</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="gstNumber"
              >
                {company.taxType} Number
              </label>
              {company.taxType === "GST" ? (
  <input
    type="text"
    id="gstNumber"
    name="gstNumber"
    value={company.gstNumber}
    onChange={handleChange}
  />
) : (
  <input
    type="text"
    id="vatNumber"
    name="vatNumber"
    value={company.vatNumber}
    onChange={handleChange}
  />
)}

              
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;