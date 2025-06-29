import { useEffect, useState } from "react";
import API from "./Api";
import { toast } from "react-toastify";

export default function InvoiceSettings() {
  const [form, setForm] = useState({
    colorPrimary: "#007BFF",
    colorSecondary: "#E9F5FF",
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

  // Fetch saved settings on mount
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
        const res = await API.post("/logo/upload", data); // assumes logo upload route
        logoUrl = res.data.url;
      }

      const payload = {
        ...form,
        logoUrl,
      };

      await API.post("/invoice-settings", payload);
      toast.success("Settings saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow text-[#1E1E2D]">
      <h2 className="text-2xl font-bold mb-4">Invoice Settings</h2>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="font-semibold block">Company Logo</label>
        <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />
        {form.logoUrl && (
          <img src={form.logoUrl} alt="Logo" className="h-16 mt-2" />
        )}
      </div>

      {/* Color Picker */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block font-semibold">Primary Color</label>
          <input
            type="color"
            value={form.colorPrimary}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, colorPrimary: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block font-semibold">Secondary Color</label>
          <input
            type="color"
            value={form.colorSecondary}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, colorSecondary: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Visible Fields */}
      <div className="mb-4">
        <label className="block font-semibold">Visible Table Columns</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["qty", "packets", "lengths", "rate", "CGST", "SGST", "total"].map(
            (key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={form.visibleFields.includes(key)}
                  onChange={() => toggleField(key)}
                />{" "}
                {key}
              </label>
            )
          )}
        </div>
      </div>

      {/* Vehicle Field */}
      <div className="mb-4">
        <label className="block font-semibold">Show Vehicle Number</label>
        <input
          type="checkbox"
          checked={form.vehicleField}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, vehicleField: e.target.checked }))
          }
        />
      </div>

      {/* Company Details */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Company Name</label>
        <input
          type="text"
          value={form.companyName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, companyName: e.target.value }))
          }
          className="w-full border rounded p-2"
        />

        <label className="font-semibold block mt-3 mb-1">GSTIN</label>
        <input
          type="text"
          value={form.gstin}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, gstin: e.target.value }))
          }
          className="w-full border rounded p-2"
        />

        <label className="font-semibold block mt-3 mb-1">Address</label>
        <textarea
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
          className="w-full border rounded p-2"
        />

        <label className="font-semibold block mt-3 mb-1">Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="w-full border rounded p-2"
        />

        <label className="font-semibold block mt-3 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full border rounded p-2"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-[#1E1E2D] text-white px-4 py-2 rounded hover:bg-[#2b2b53]"
      >
        Save Settings
      </button>
    </div>
  );
}
