import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { Bar, Pie } from "react-chartjs-2";
import API from "./Api";

// Chart.js setup
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import {
  Database,
  CheckCircle2,
  XCircle,
  PieChart,
  FilePlus,
  Trash2,
  Search,
  Download,
} from "lucide-react";

const initialForm = {
  PROFILE: "",
  CODE: "",
  HSN_CODE: "",
  DESCRIPTION: "",
  WEIGHT_KG_M: "",
  PROFILE_LEGT: "",
  LENGT_PACKT: "",
  PACKS: "",
  LENGTHS: "",
  QTY: "",
  RATE: "",
  AMOUNT: "",
};

export default function ItemManagerPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadTimeoutReached, setLoadTimeoutReached] = useState(false);

  useEffect(() => {
    fetchItems();
    const timer = setTimeout(() => setLoadTimeoutReached(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setLoadTimeoutReached(false);
    try {
      const res = await API.get(`/items`);
      setItems(res.data);
    } catch {
      toast.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/items`, form);
      toast.success(res.data.message || "Item added successfully");
      setForm(initialForm);
      fetchItems();
    } catch (err) {
      toast.error(
        "Error adding item: " + (err.response?.data?.error || err.message)
      );
    }
  };
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };
  const handleDelete = async () => {
    try {
      await API.delete(`/items/${deleteId}`);
      toast.success("Item deleted successfully");
    } catch {
      toast.error("Error deleting item");
    } finally {
      setShowConfirm(false);
      fetchItems();
    }
  };

  const filtered = items.filter(
    (i) =>
      [i.PROFILE, i.CODE, i.DESCRIPTION].some((text) =>
        text?.toLowerCase().includes(searchTerm.toLowerCase())
      ) && i.PROFILE?.toLowerCase() !== "total"
  );

  const visible = items.filter((i) => i.PROFILE?.toLowerCase() !== "total");
  const total = visible.length;
  const outOfStock = visible.filter((item) => {
    const { QTY, PACKS, LENGTHS, AMOUNT } = item;
    return (
      (+QTY || 0) <= 0 ||
      (+PACKS || 0) <= 0 ||
      (+LENGTHS || 0) <= 0 ||
      (+AMOUNT || 0) <= 0
    );
  }).length;
  const inStock = total - outOfStock;

  const chartData = {
    labels: ["Total", "In Stock", "Out of Stock"],
    datasets: [
      {
        data: [total, inStock, outOfStock],
        backgroundColor: ["#1E1E2D", "#10B981", "#EF4444"],
        borderRadius: 4,
      },
    ],
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "Inventory_List.xlsx");
    toast.success("Exported to Excel");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 text-[#1E1E2D]">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Database className="text-[#fabd05]" /> Item Manager
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xl font-semibold flex items-center gap-2 justify-center">
            <Database /> Total
          </p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xl font-semibold flex items-center gap-2 justify-center">
            <CheckCircle2 className="text-green-600" /> In Stock
          </p>
          <p className="text-3xl font-bold">{inStock}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-xl font-semibold flex items-center gap-2 justify-center">
            <XCircle className="text-red-600" /> Out of Stock
          </p>
          <p className="text-3xl font-bold">{outOfStock}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 bg-white p-4 rounded shadow flex justify-center">
        <div className="w-64 h-64">
          <Pie data={chartData} />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        {Object.entries(initialForm).map(([key]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">
              {key}
            </label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-2 bg-[#1E1E2D] text-white w-fit px-4 py-2 rounded hover:bg-[#2a2a4b] flex items-center gap-2"
        >
          <FilePlus className="text-[#fabd05]" /> Add Item
        </button>
      </form>

      {/* Search & Export */}
      <div className="flex flex-wrap justify-between items-center mt-8 mb-4 gap-2">
        <div className="flex items-center gap-2 bg-white p-2 border rounded shadow">
          <Search className="text-[#fabd05]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Code, Profile or Description..."
            className="flex-1 px-2 py-1 outline-none"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="bg-[#fabd05] text-[#1E1E2D] px-4 py-2 rounded hover:bg-yellow-400 flex items-center gap-2"
        >
          <Download /> Export to Excel
        </button>
      </div>

      {/* Inventory Table */}
      <div>
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <PieChart className="text-[#fabd05]" /> Inventory List
        </h3>

        {loading && !loadTimeoutReached ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#fabd05] mx-auto" />
            <p className="mt-2 text-gray-600">Loading items...</p>
          </div>
        ) : filtered.length > 0 ? (
          <table className="w-full bg-white shadow rounded table-auto">
            <thead className="bg-gray-200">
              <tr>
                {["CODE", "PROFILE", "DESCRIPTION", "QTY", "Actions"].map(
                  (header) => (
                    <th key={header} className="p-2 border text-left">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const qty = +item.QTY || 0;
                const out = qty <= 0;
                return (
                  <tr
                    key={item._id}
                    className={out ? "bg-red-100" : "odd:bg-gray-100"}
                  >
                    <td className="p-2 border">{item.CODE}</td>
                    <td className="p-2 border">{item.PROFILE}</td>
                    <td className="p-2 border">{item.DESCRIPTION}</td>
                    <td className="p-2 border">{qty.toFixed(2)}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => confirmDelete(item._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 p-6">
            No items available
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#1E1E2D]">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this item?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#1E1E2D] text-white rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
