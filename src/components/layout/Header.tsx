// import React from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { Moon, Sun, Menu } from 'lucide-react';

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const { theme, toggleTheme, companyInfo } = useAppContext();

//   return (
//     <header className={`flex items-center justify-between p-2 border-b ${
//       theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-900 border-blue-800'
//     }`}>
//       <div className="flex items-center">
//         <button 
//         title='Toggle Sidebar'
//           onClick={toggleSidebar}
//           className="p-1 mr-2 rounded-md text-white hover:bg-blue-800 dark:hover:bg-gray-700"
//         >
//           <Menu size={20} />
//         </button>
//         <div className="text-white font-bold">
//           {companyInfo ? companyInfo.name : 'Tally Prime'}
//           <span className="text-xs ml-2 text-blue-200 dark:text-gray-400">
//             {companyInfo ? companyInfo.financialYear : 'Select Company'}
//           </span>
//         </div>
//       </div>
//       <div className="flex items-center space-x-2">
//         <button 
//           onClick={toggleTheme}
//           className="p-1 rounded-md text-white hover:bg-blue-800 dark:hover:bg-gray-700"
//           aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//         >
//           {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
//         </button>
//         <span className="text-white text-xs hidden md:inline-block">
//           F1: Help | F2: Period | Alt+F1: Company
//         </span>
//       </div>
//     </header>
//   );
// };

// export default Header;




import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Moon, Sun, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme, companyInfo } = useAppContext();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-2 border-b h-14 ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-blue-900 border-blue-800'
      }`}
    >
      <div className="flex items-center">
        <button
          title="Toggle Sidebar"
          onClick={toggleSidebar}
          className="p-1 mr-2 rounded-md text-white hover:bg-blue-800 dark:hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
        <div className="text-white font-bold">
          {companyInfo ? companyInfo.name : 'Tally Prime'}
          <span className="text-xs ml-2 text-blue-200 dark:text-gray-400">
            {companyInfo ? companyInfo.financialYear : 'Select Company'}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-md text-white hover:bg-blue-800 dark:hover:bg-gray-700"
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <span className="text-white text-xs hidden md:inline-block">
          F1: Help | F2: Period | Alt+F1: Company
        </span>
      </div>
    </header>
  );
};

export default Header;
