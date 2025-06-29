import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "./Api";
import {
  Building2,
  ImageIcon,
  Palette,
  TableProperties,
  Save,
  ArrowLeft,
  Settings,
} from "lucide-react";

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
      }

      const payload = { ...form, logoUrl };
      await API.post("/invoice-settings", payload);
      toast.success("Settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}

      <div className="flex items-center gap-2 text-[#1E1E2D] font-semibold text-2xl pb-6">
        <Settings size={24} stroke="#fabd05" />
        <span>Invoice Settings</span>
      </div>

      {/* Company Details */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex items-center gap-2 mb-4 text-[#1E1E2D] font-bold text-lg">
          <Building2 size={20} stroke="#fabd05" />
          Company Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, companyName: e.target.value }))
            }
            className="border rounded p-2"
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border rounded p-2"
          />
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="border rounded p-2"
          />
          <input
            placeholder="GST Number"
            value={form.gstin}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gstin: e.target.value }))
            }
            className="border rounded p-2"
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address: e.target.value }))
            }
            className="border rounded p-2 col-span-2"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex items-center gap-2 mb-4 text-[#1E1E2D] font-bold text-lg">
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
              src={form.logoUrl}
              alt="Logo"
              className="h-16 w-auto border rounded"
            />
          )}
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-white rounded-lg p-6 shadow mb-6">
        <div className="flex items-center gap-2 mb-4 text-[#1E1E2D] font-bold text-lg">
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
      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center gap-2 mb-4 text-[#1E1E2D] font-bold text-lg">
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
                <span className="capitalize text-[#1E1E2D]">{key}</span>
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
                setForm((prev) => ({ ...prev, vehicleField: e.target.checked }))
              }
              className="accent-[#fabd05] scale-150 cursor-pointer"
            />
            <span className="text-[#1E1E2D]">Show Vehicle Number</span>
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
