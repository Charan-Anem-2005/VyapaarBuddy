import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage";
import BuyPage from "./pages/BuyPage";
import SellPage from "./pages/SellPage";
import TransactionsPage from "./pages/TransactionsPage";
import ItemManagerPage from "./pages/ItemManagerPage";
import ProtectedRoute from "./ProtectedRoute";
import Sidebar from "./Sidebar";
import Navbar from "./components/Navbar";
import InvoiceSettings from "./pages/InvoiceSettings";

function DashboardLayout() {
  return (
    <div className="flex h-[calc(100vh-110px)]">
      {" "}
      {/* assuming navbar is 64px tall */}
      <Sidebar />
      <main className="ml-64 w-full overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

function AppWrapper() {
  const location = useLocation();

  const hideNavbarRoutes = ["/auth"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InventoryPage />} />
          <Route path="buy" element={<BuyPage />} />
          <Route path="sell" element={<SellPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="invoice-settings" element={<InvoiceSettings />} />
          <Route path="item-manager" element={<ItemManagerPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
