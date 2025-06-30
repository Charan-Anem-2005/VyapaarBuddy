import { Link, useLocation } from "react-router-dom";
import {
  Boxes,
  ShoppingCart,
  DollarSign,
  FileText,
  PackageSearch,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: ".", label: "Current Materials", icon: <Boxes size={20} /> },
    { path: "buy", label: "Buy", icon: <ShoppingCart size={20} /> },
    { path: "sell", label: "Sell", icon: <DollarSign size={20} /> },
    {
      path: "transactions",
      label: "Invoices & Transactions",
      icon: <FileText size={20} />,
    },
    {
      path: "item-manager",
      label: "Item Manager",
      icon: <PackageSearch size={20} />,
    },
    {
      path: "invoice-settings",
      label: "Invoice Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="fixed left-0 w-64 h-full bg-white text-[#1E1E2D] border-r border-gray-200 flex flex-col p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-8 text-[#1E1E2D] font-extrabold text-2xl">
        <LayoutDashboard color="#fabd05" size={28} />
        Store Panel
      </div>

      <nav className="flex flex-col gap-2 text-[16px] font-medium">
        {navItems.map(({ path, label, icon }) => {
          const isActive =
            (location.pathname.endsWith(path) && path !== ".") ||
            (path === "." && location.pathname === "/account");

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-[#fabd05] text-[#1E1E2D] font-semibold shadow"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`${isActive ? "text-[#1E1E2D]" : "text-[#fabd05]"}`}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
