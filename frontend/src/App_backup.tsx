import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import CompanyForm from './components/company/CompanyForm';
import { AuthProvider } from './home/context/AuthContext';

// Home Pages
import HomePage from './home/pages/HomePage';
import PricingPage from './home/pages/PricingPage';
import PurchasePage from './home/pages/PurchasePage';
import AboutUsPage from './home/pages/AboutUsPage';
import CareersPage from './home/pages/CareersPage';
import ContactPage from './home/pages/ContactPage';
import PrivacyPolicyPage from './home/pages/PrivacyPolicyPage';
import LoginPage from './home/auth/LoginPage';
import Register from './home/auth/Register';

// Reports
import ConsolidationRoot from './components/reports/consolidation/ConsolidationRoot';

function App() {
  // Add keyboard shortcut listener for Alt+F1 for company selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+F1 for company selection
      if (e.altKey && e.key === 'F1') {
        e.preventDefault();
        window.location.href = '/app/company';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Home/Marketing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            
            {/* App Routes */}
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="company" element={<CompanyForm />} />
              <Route path="reports/consolidation" element={<ConsolidationRoot />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
