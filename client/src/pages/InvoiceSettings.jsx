import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Building2,
  ImageIcon,
  Palette,
  TableProperties,
  Save,
  Settings,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

export default function InvoiceSettings() {
  const [form, setForm] = useState({
    colorPrimary: "#1E1E2D",
    colorSecondary: "#fabd05",
    visibleFields: [
      "qty",
      "packets",
      "lengths",
      "rate",
      "CGST",
      "SGST",
      "total",
    ],
    companyName: "",
    gstin: "",
    address: "",
    phone: "",
    email: "",
    logoUrl: "",
    vehicleField: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await API.get("/invoice-settings");
        if (res.data) {
          setForm((prev) => ({
            ...prev,
            ...res.data,
            visibleFields: res.data.visibleFields || [],
            vehicleField: res.data.vehicleField ?? true,
          }));
        }
      } catch {
        toast.error("Failed to load invoice settings.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const toggleField = (fieldKey) => {
    setForm((prev) => ({
      ...prev,
      visibleFields: prev.visibleFields.includes(fieldKey)
        ? prev.visibleFields.filter((f) => f !== fieldKey)
        : [...prev.visibleFields, fieldKey],
    }));
  };

  const handleSave = async () => {
    try {
      let logoUrl = form.logoUrl;

      if (logoFile) {
        const data = new FormData();
        data.append("logo", logoFile);
        const res = await API.post("/logo/upload", data);
        logoUrl = res.data.url;

        setForm((prev) => ({
          ...prev,
          logoUrl,
        }));
      }

      const payload = { ...form, logoUrl };
      await API.post("/invoice-settings", payload);

      toast.success("Settings saved!", { autoClose: 3000 });
      setLogoFile(null);
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="relative p-8 max-w-5xl mx-auto text-[#1E1E2D]">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-[#fabd05] rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 font-semibold text-2xl pb-6">
        <Settings size={24} stroke="#fabd05" />
        <span>Invoice Settings</span>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-lg p-6 shadow mb-6 border-l-4 border-[#fabd05]">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg">
          <Building2 size={20} stroke="#fabd05" />
          Company Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="border rounded p-2"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded p-2"
          />
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border rounded p-2"
          />
          <input
            placeholder="GST Number"
            value={form.gstin}
            onChange={(e) => setForm({ ...form, gstin: e.target.value })}
            className="border rounded p-2"
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="border rounded p-2 col-span-2"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-lg p-6 shadow mb-6 border-l-4 border-[#fabd05]">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg">
          <ImageIcon size={20} stroke="#fabd05" />
          Company Logo
        </div>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="block"
          />
          {form.logoUrl && (
            <img
              src={
                form.logoUrl.startsWith("http")
                  ? form.logoUrl
                  : `${import.meta.env.VITE_BASE_URL}${
                      form.logoUrl
                    }?t=${Date.now()}`
              }
              alt="Logo"
              className="h-16 w-auto border rounded"
            />
          )}
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-white rounded-lg p-6 shadow mb-6 border-l-4 border-[#fabd05]">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg">
          <Palette size={20} stroke="#fabd05" />
          Brand Colors
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={form.colorPrimary}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, colorPrimary: e.target.value }))
              }
              className="w-12 h-10 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Secondary Color
            </label>
            <input
              type="color"
              value={form.colorSecondary}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, colorSecondary: e.target.value }))
              }
              className="w-12 h-10 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Invoice Columns */}
      <div className="bg-white rounded-lg p-6 shadow border-l-4 border-[#fabd05]">
        <div className="flex items-center gap-2 mb-4 font-bold text-lg">
          <TableProperties size={20} stroke="#fabd05" />
          Invoice Columns
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["qty", "packets", "lengths", "rate", "CGST", "SGST", "total"].map(
            (key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.visibleFields.includes(key)}
                  onChange={() => toggleField(key)}
                  className="accent-[#fabd05] scale-150 cursor-pointer"
                />
                <span className="capitalize">{key}</span>
              </label>
            )
          )}
        </div>
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.vehicleField}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  vehicleField: e.target.checked,
                }))
              }
              className="accent-[#fabd05] scale-150 cursor-pointer"
            />
            <span>Show Vehicle Number</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-right mt-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#1E1E2D] text-white px-6 py-2 rounded hover:bg-[#2c2c45] transition"
        >
          <Save size={16} stroke="#fabd05" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
