import { Routes, Route, Navigate } from 'react-router-dom';
import MiniErpLayout from './components/MiniErpLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequisitionsPage from './pages/RequisitionsPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import LeadsPage from './pages/LeadsPage';
import ReportsPage from './pages/ReportsPage';

export default function MiniErpApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MiniErpLayout><DashboardPage /></MiniErpLayout>} />
      <Route path="/dashboard" element={<MiniErpLayout><DashboardPage /></MiniErpLayout>} />
      <Route path="/requisitions" element={<MiniErpLayout><RequisitionsPage /></MiniErpLayout>} />
      <Route path="/products" element={<MiniErpLayout><ProductsPage /></MiniErpLayout>} />
      <Route path="/inventory" element={<MiniErpLayout><InventoryPage /></MiniErpLayout>} />
      <Route path="/leads" element={<MiniErpLayout><LeadsPage /></MiniErpLayout>} />
      <Route path="/reports" element={<MiniErpLayout><ReportsPage /></MiniErpLayout>} />
      <Route path="*" element={<Navigate to="/mini-erp/dashboard" replace />} />
    </Routes>
  );
}
