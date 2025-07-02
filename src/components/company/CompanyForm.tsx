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
import Swal from "sweetalert2";
import { 
  Building, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  FileText, 
  Globe, 
  Hash,
  Save,
  X
} from "lucide-react";

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

// Reusable Input Field Component
interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  theme: string;
  title?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  icon,
  theme,
  title
}) => (
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      title={title}
      className={`w-full p-2 rounded border ${
        theme === "dark"
          ? "bg-gray-700 border-gray-600 focus:border-blue-500 text-white"
          : "bg-white border-gray-300 focus:border-blue-500"
      } outline-none transition-colors`}
    />
  </div>
);

// Reusable Select Field Component
interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  theme: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  options,
  icon,
  theme
}) => (
  <div>
    <label className="block text-sm font-medium mb-1" htmlFor={id}>
      {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-2 rounded border ${
        theme === "dark"
          ? "bg-gray-700 border-gray-600 text-white"
          : "bg-white border-gray-300 text-black"
      } outline-none transition-colors`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

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

  // Prepare options for select fields
  const stateOptions = [
    { value: "", label: "Select State" },
    ...states.map(({ code, name }) => ({
      value: `${name}(${code})`,
      label: `${name} (${code})`
    }))
  ];

  const taxTypeOptions = [
    { value: "GST", label: "GST" },
    { value: "VAT", label: "VAT" }
  ];

  const validateForm = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;

    if (!panRegex.test(company.panNumber)) {
      alert("Invalid PAN format (e.g., ABCDE1234F)");
      return false;
    }

    if (company.taxType === "GST" && !gstRegex.test(company.gstNumber)) {
      alert("Invalid GST Number format (15 characters)");
      return false;
    }

    if (!emailRegex.test(company.email)) {
      alert("Invalid email format");
      return false;
    }

    if (!phoneRegex.test(company.phoneNumber)) {
      alert("Phone number must be exactly 10 digits");
      return false;
    }

    if (!pinRegex.test(company.pin)) {
      alert("PIN code must be exactly 6 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

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
        Swal.fire({
          title: "Success!",
          text: "Company created successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          setCompanyInfo(company);
          navigate("/");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Failed to create company",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }

    } catch (err) {
  console.error("Submit error:", err);
  Swal.fire({
    title: "Oops!",
    text: "Something went wrong!",
    icon: "error",
    confirmButtonColor: "#d33",
  });
}

  };



  return (
    <div className="pt-[56px] px-4">
      <div
        className={`max-w-3xl mx-auto p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Company Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InputField
              id="name"
              name="name"
              label="Company Name"
              placeholder="Enter your company name"
              value={company.name}
              onChange={handleChange}
              required
              icon={<Building size={16} />}
              theme={theme}
            />

            <InputField
              id="financialYear"
              name="financialYear"
              label="Financial Year"
              value={company.financialYear}
              onChange={handleChange}
              required
              icon={<Calendar size={16} />}
              theme={theme}
              placeholder="e.g., 2024-25"
            />

            <InputField
            placeholder="e.g., 2024-25"
              id="booksBeginningYear"
              name="booksBeginningYear"
              label="Books Beginning From"
              value={company.booksBeginningYear}
              onChange={handleChange}
              required
              icon={<Calendar size={16} />}
              theme={theme}
              title="Enter the beginning financial year"
            />

            <div className="md:col-span-2">
              <InputField
              placeholder="Enter your address"
                id="address"
                name="address"
                label="Address"
                value={company.address}
                onChange={handleChange}
                icon={<MapPin size={16} />}
                theme={theme}
              />
            </div>

            <InputField
              id="pin"
              name="pin"
              label="PIN Code"
              value={company.pin}
              onChange={handleChange}
              icon={<Hash size={16} />}
              theme={theme}
              placeholder="6-digit PIN code"
            />

            <SelectField
              id="state"
              name="state"
              label="State"
              value={company.state || ""}
              onChange={handleChange}
              required
              options={stateOptions}
              icon={<MapPin size={16} />}
              theme={theme}
            />
            <InputField
              id="country"
              name="country"
              label="Country"
              value={company.country || ""}
              onChange={handleChange}
              required
              icon={<Globe size={16} />}
              theme={theme}
            />

            <InputField
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              value={company.phoneNumber}
              onChange={handleChange}
              icon={<Phone size={16} />}
              theme={theme}
              placeholder="10-digit mobile number"
            />

            <InputField
              id="email"
              placeholder="Enter your email"
              name="email"
              label="Email"
              type="email"
              value={company.email}
              onChange={handleChange}
              icon={<Mail size={16} />}
              theme={theme}
            />

            <InputField
              id="panNumber"
              name="panNumber"
              label="PAN Number"
              value={company.panNumber}
              onChange={handleChange}
              icon={<CreditCard size={16} />}
              theme={theme}
              placeholder="e.g., ABCDE1234F"
            />

            <SelectField
              id="taxType"
              name="taxType"
              label="Tax Type"
              value={company.taxType || "GST"}
              onChange={handleChange}
              options={taxTypeOptions}
              icon={<FileText size={16} />}
              theme={theme}
            />

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="taxNumber">
                <FileText size={16} className="inline mr-1" />
                {company.taxType} Number
              </label>
              <input
                type="text"
                id="taxNumber"
                name={company.taxType === "GST" ? "gstNumber" : "vatNumber"}
                value={company.taxType === "GST" ? company.gstNumber : company.vatNumber}
                onChange={handleChange}
                placeholder={`Enter ${company.taxType} number`}
                title={`Enter the ${company.taxType} Number`}
                className={`w-full p-2 rounded border ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-black focus:border-blue-500"
                } outline-none transition-colors`}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } transition-colors`}
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;